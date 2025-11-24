import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ success: false, message: "Missing session_id" });
  }

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.checkoutSessionId, sessionId));

  if (!booking) return NextResponse.json({ success: false });

  if (!booking.isPaid) {
    return NextResponse.json({
      success: false,
      message: "Payment is still being processed...",
    });
  }

  return NextResponse.json({
    success: true,
    booking,
  });
}
