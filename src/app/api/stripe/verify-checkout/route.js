import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session?.metadata?.bookingId) {
      return NextResponse.json({ success: false });
    }
    if (session.payment_status === "paid") {
      await db
        .update(bookings)
        .set({ status: "confirmed", isPaid: true })
        .where(eq(bookings.id, session.metadata.bookingId));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
