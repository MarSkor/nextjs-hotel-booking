import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");

  try {
    if (!bookingId) {
      return NextResponse.json({
        success: false,
        message: "Missing bookingID",
      });
    }

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));

    if (!booking) {
      return NextResponse.json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.checkoutSessionId && booking.status === "pending") {
      try {
        await stripe.checkout.sessions.expire(booking.checkoutSessionId);
      } catch (error) {
        console.error("Something went wrong.");
      }
    }

    await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, bookingId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
