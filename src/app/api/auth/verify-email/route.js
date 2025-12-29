import { db } from "@/database/drizzle";
import { emailVerifications, userEvents, users } from "@/database/schema";
import config from "@/lib/config";
import { workflowClient } from "@/lib/email";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, reason: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    const [record] = await db
      .select()
      .from(emailVerifications)
      .where(eq(emailVerifications.token, token));

    if (!record) {
      return NextResponse.json(
        { success: false, error: "INVALID_TOKEN" },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      await db
        .delete(emailVerifications)
        .where(eq(emailVerifications.token, token));

      return NextResponse.json(
        { success: false, error: "TOKEN_EXPIRED" },
        { status: 410 }
      );
    }

    if (record.userId !== session.user.id) {
      return Response.json(
        { success: false, reason: "TOKEN_USER_MISMATCH" },
        { status: 403 }
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, record.userId));

    if (!user?.pendingEmail) {
      await db
        .delete(emailVerifications)
        .where(eq(emailVerifications.token, token));
      return NextResponse.json({ success: false }, { status: 400 });
    }

    await db
      .update(users)
      .set({
        email: user.pendingEmail,
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
      ip: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    });

    await workflowClient.trigger({
      url: `${config.env.apiEndpoint}/api/workflows/update-email`,
      body: {
        userId: user.id,
        oldEmail: user.email,
        newEmail: user.pendingEmail,
        fullName: user.name,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
