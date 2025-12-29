"use server";

import { db } from "@/database/drizzle";
import { auth } from "../../auth";
import { eq } from "drizzle-orm";
import { emailVerifications, userEvents, users } from "@/database/schema";
import config from "@/lib/config";
import { headers } from "next/headers";
import { workflowClient } from "@/lib/email";
import ratelimit from "@/lib/rateLimit";

export const updateEmail = async ({ newEmail }) => {
  console.log("new email: ", newEmail);
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

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
      userAgent: (await headers()).get("user-agent"),
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

export const resendEmailVerification = async (userId, pendingEmail) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user?.pendingEmail) return;

  try {
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
        newEmail: pendingEmail,
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

export const verifyEmailToken = async ({ token, userId }) => {
  const [record] = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.token, token));

  if (!record) return { status: "invalid" };

  if (record.expiresAt < new Date()) {
    return { status: "expired" };
  }

  if (record.userId !== userId) {
    return { status: "forbidden" };
  }
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, record.userId));

  if (!user?.pendingEmail) return { status: "invalid" };

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
    });
  } catch (error) {
    return { status: "error", error };
  }

  return {
    status: "success",
    newEmail,
    oldEmail,
  };
};
