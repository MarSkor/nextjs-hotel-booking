"use server";
import { verificationStatus } from "@/lib/verification-status";
import { auth } from "../../auth";
import { compare, hash } from "bcryptjs";
import { db } from "@/database/drizzle";
import { passwordResets, users } from "@/database/schema";
import { and, eq, sql } from "drizzle-orm";
import { workflowClient } from "@/lib/email";
import config from "@/lib/config";
import { logEvent } from "@/lib/logEvent";

export const sendPasswordResetPin = async (email) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return { success: true };

  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

  await db.delete(passwordResets).where(eq(passwordResets.email, email));
  await db.insert(passwordResets).values({ email, pin, token, expiresAt });

  await workflowClient.trigger({
    url: `${config.env.apiEndpoint}/api/workflows/reset-password-pin`,
    body: { email, code: pin, fullName: user.fullName },
  });

  return { success: true };
};

export const verifyPin = async ({ email, pin }) => {
  const [record] = await db
    .select()
    .from(passwordResets)
    .where(
      and(
        eq(passwordResets.email, email),
        eq(passwordResets.pin, pin),
        sql`${passwordResets.expiresAt} > NOW()`,
      ),
    );

  if (!record) return { success: false, error: "Invalid or expired PIN" };
  return { success: true, token: record.token };
};

export const resetPassword = async ({
  email,
  token,
  oldPassword,
  newPassword,
  bypassToken = false,
}) => {
  if (!bypassToken) {
    const [record] = await db
      .select()
      .from(passwordResets)
      .where(
        and(eq(passwordResets.email, email), eq(passwordResets.token, token)),
      );

    if (!record) {
      return { success: false, error: verificationStatus.INVALID };
    }
  } else {
    const session = await auth();
    if (!session || session.user.email !== email) {
      return { success: false, error: verificationStatus.UNAUTHORIZED };
    }
  }

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return { success: false, error: "User not found." };

  const isOldValid = await compare(oldPassword, user.password);
  if (!isOldValid)
    return {
      success: false,
      status: verificationStatus.FORBIDDEN,
      error: "Old password does not match.",
    };

  try {
    const hashedPassword = await hash(newPassword, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user.id));

    await db.delete(passwordResets).where(eq(passwordResets.email, email));

    await logEvent({
      actorId: user.id,
      type: bypassToken ? "PASSWORD_CHANGED" : "PASSWORD_RESET",
      targetId: user.id,
      metadata: {
        reason: "User updated profile settings",
      },
    });

    if (!bypassToken) {
      await db.delete(passwordResets).where(eq(passwordResets.email, email));
    }

    await workflowClient.trigger({
      url: `${config.env.apiEndpoint}/api/workflows/password-reset-confirmed`,
      body: { email, fullName: user.fullName },
    });

    return { success: true, status: verificationStatus.SUCCESS };
  } catch (error) {
    return {
      success: false,
      status: verificationStatus.ERROR,
      error: "An error occurred. Please try again later.",
    };
  }
};

export const changePassword = async (data) => {
  const session = await auth();
  if (!session?.user?.email)
    return { success: false, error: verificationStatus.UNAUTHORIZED };

  return await resetPassword({
    email: session.user.email,
    token: null,
    bypassToken: true,
    oldPassword: data.oldPassword,
    newPassword: data.newPassword,
  });
};
