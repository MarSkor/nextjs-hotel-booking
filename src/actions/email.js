"use server";

import { db } from "@/database/drizzle";
import { auth } from "../../auth";
import { eq } from "drizzle-orm";
import { emailVerifications, userEvents, users } from "@/database/schema";
import config from "@/lib/config";
import { headers } from "next/headers";
import { workflowClient } from "@/lib/email";
import ratelimit from "@/lib/rateLimit";
import { verificationStatus } from "@/lib/verification-status";

export const updateEmail = async ({ newEmail }) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");
  const userAgent = (await headers()).get("user-agent");

  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, newEmail),
  });
  if (existingUser) return { success: false, error: "Email already in use." };

  try {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    await db
      .delete(emailVerifications)
      .where(eq(emailVerifications.userId, session.user.id));

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id));

    if (!user || user.email === newEmail) {
      return { success: true };
    }

    await db.insert(userEvents).values({
      userId: user.id,
      type: "EMAIL_CHANGE_REQUESTED",
      ip,
      userAgent,
    });

    await db.insert(emailVerifications).values({
      token,
      userId: user.id,
      newEmail: newEmail,
      expiresAt,
    });

    await db
      .update(users)
      .set({ pendingEmail: newEmail })
      .where(eq(users.id, session.user.id));

    await workflowClient.trigger({
      url: `${config.env.apiEndpoint}/api/workflows/verify-email`,
      body: {
        userId: user.id,
        fullName: user.fullName,
        oldEmail: user.email,
        newEmail,
        token,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Unable to update email at the moment. Please try again later.",
    };
  }
};

export const resendEmailVerification = async () => {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, error: verificationStatus.ERROR };

  const userId = session.user.id;

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user?.pendingEmail) {
    return { success: false, error: verificationStatus.ERROR };
  }

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");
  const userAgent = (await headers()).get("user-agent");

  try {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await db
      .delete(emailVerifications)
      .where(eq(emailVerifications.userId, userId));

    await db.insert(emailVerifications).values({
      token,
      userId,
      newEmail: user.pendingEmail,
      expiresAt,
    });

    await db.insert(userEvents).values({
      userId,
      type: "EMAIL_VERIFICATION_RESENT",
      ip,
      userAgent,
    });

    await workflowClient.trigger({
      url: `${config.env.apiEndpoint}/api/workflows/verify-email`,
      body: {
        userId,
        newEmail: user.pendingEmail,
        oldEmail: user.email,
        fullName: user.fullName,
        token,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: verificationStatus.ERROR };
  }
};

export const verifyEmailToken = async (token) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: verificationStatus.UNAUTHENTICATED };
  }

  const userId = session.user.id;
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const userAgent = (await headers()).get("user-agent");

  try {
    const [record] = await db
      .select()
      .from(emailVerifications)
      .where(eq(emailVerifications.token, token));

    if (!record) {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (user && !user.pendingEmail && user.emailVerified) {
        return { status: verificationStatus.SUCCESS };
      }
      return { status: verificationStatus.INVALID };
    }

    if (record.userId !== userId) {
      return { status: verificationStatus.UNAUTHORIZED };
    }

    if (record.expiresAt < new Date()) {
      await db
        .delete(emailVerifications)
        .where(eq(emailVerifications.token, token));
      return { status: verificationStatus.EXPIRED };
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, record.userId));

    if (!user) {
      return { status: verificationStatus.INVALID };
    }

    if (user.email === record.newEmail) {
      await db
        .delete(emailVerifications)
        .where(eq(emailVerifications.token, token));
      return {
        status: verificationStatus.SUCCESS,
        newEmail: user.email,
      };
    }

    await db
      .update(users)
      .set({
        email: record.newEmail,
        pendingEmail: null,
        emailVerified: new Date(),
      })
      .where(eq(users.id, user.id));

    await db
      .delete(emailVerifications)
      .where(eq(emailVerifications.token, token));

    await db.insert(userEvents).values({
      userId: user.id,
      type: "EMAIL_CHANGED",
      ip,
      userAgent,
    });

    await workflowClient.trigger({
      url: `${config.env.apiEndpoint}/api/workflows/email-change-confirmed`,
      body: {
        userId,
        newEmail: record.newEmail,
        oldEmail: user.email,
        fullName: user.fullName,
      },
    });

    return { status: verificationStatus.SUCCESS, email: record.newEmail };
  } catch (error) {
    return { success: false, status: verificationStatus.ERROR, error };
  }
};
