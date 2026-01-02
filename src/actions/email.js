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
  console.log("new email: ", newEmail);
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");
  const userAgent = (await headers()).get("user-agent");

  try {
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

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await db
      .update(users)
      .set({ pendingEmail: newEmail })
      .where(eq(users.id, session.user.id));

    await db.insert(emailVerifications).values({
      token,
      userId: user.id,
      expiresAt,
    });

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
    console.log("error: ", error);
    return {
      success: false,
      error: "Unable to update email at the moment. Please try again later.",
    };
  }
};

export const resendEmailVerification = async (userId) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user?.pendingEmail) return;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");
  const userAgent = (await headers()).get("user-agent");

  try {
    await db.insert(userEvents).values({
      userId: user.id,
      type: "EMAIL_VERIFICATION_RESENT",
      ip,
      userAgent,
    });

    await db
      .delete(emailVerifications)
      .where(eq(emailVerifications.userId, userId));

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await db.insert(emailVerifications).values({
      userId,
      token,
      expiresAt,
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
  } catch (error) {
    console.log("error: ", error);
    return {
      success: false,
      error:
        "An error occured resending verification email. Please try again later.",
    };
  }
};

export const verifyEmailToken = async (token, userId) => {
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");
  const userAgent = (await headers()).get("user-agent");

  const [record] = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.token, token));

  if (!record) return { status: verificationStatus.INVALID };

  if (record.expiresAt < new Date()) {
    await db
      .delete(emailVerifications)
      .where(eq(emailVerifications.token, token));
    return { status: verificationStatus.EXPIRED };
  }

  if (record.userId !== userId) {
    return { status: verificationStatus.INVALID };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, record.userId));

  if (!user) {
    return { status: "INVALID" };
  }

  if (!user.pendingEmail) {
    await db
      .delete(emailVerifications)
      .where(eq(emailVerifications.token, token));

    return {
      status: verificationStatus.ALREADY_VERIFIED,
      email: user.email,
      alreadyVerified: true,
    };
  }

  const newEmail = user.pendingEmail;
  const oldEmail = user.email;

  try {
    await db
      .update(users)
      .set({
        email: newEmail,
        pendingEmail: null,
        emailVerifiedAt: new Date(),
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

    return {
      status: verificationStatus.SUCCESS,
      newEmail,
      oldEmail,
    };
  } catch (error) {
    console.log("verifyemailtoken error: ", error);
    return { success: false, status: "ERROR", error };
  }
};
