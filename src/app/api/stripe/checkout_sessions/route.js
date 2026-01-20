import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import { eq, sql, and, lt } from "drizzle-orm";
import dayjs from "dayjs";
import { logEvent } from "@/lib/logEvent";

export async function POST(req) {
  const headersList = await headers();
  const origin = headersList.get("origin");
  const { bookingDetails } = await req.json();

  const checkIn = new Date(bookingDetails.checkIn);
  const checkOut = new Date(bookingDetails.checkOut);

  try {
    const now = new Date();
    const expired = await db
      .update(bookings)
      .set({ status: "CANCELLED" })
      .where(
        and(
          eq(bookings.status, "PENDING"),
          lt(bookings.createdAt, dayjs(now).subtract(1, "day").toDate()),
        ),
      )
      .returning({ id: bookings.id });

    for (const b of expired) {
      await logEvent({
        actorId: null,
        type: "BOOKING_CANCELLED",
        targetId: b.id,
        metadata: { reason: "System Auto-Cleanup: Expired Pending" },
      });
    }

    const overlappingBooking = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.accommodationId, bookingDetails.accommodationId),
          eq(bookings.status, "CONFIRMED"),
          sql`${bookings.checkIn} < ${checkIn} AND ${bookings.checkOut} > ${checkOut}`,
        ),
      );

    if (overlappingBooking.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Some or all selected dates of the accommodation are already booked",
        },
        { status: 409 },
      );
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        userId: bookingDetails.userId ?? null,
        isGuest: bookingDetails.isGuest ?? false,
        accommodationId: bookingDetails.accommodationId,
        name: bookingDetails.name,
        email: bookingDetails.email,
        checkIn,
        checkOut,
        nights: bookingDetails.totalNights,
        totalPrice: bookingDetails.totalPrice,
        guests: bookingDetails.guests,
        message: bookingDetails.message,
        phone: bookingDetails.phone,
        status: "PENDING",
        isPaid: false,
      })
      .returning();

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: bookingDetails.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            // unit_amount: Math.round(Number(data.totalPrice) * 100)
            unit_amount: 0, // removes the card input details, user can check out immediately
            product_data: {
              name: bookingDetails.title,
              description: `${bookingDetails.totalNights} nights, ${bookingDetails.guests} guests.`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        accommodationId: booking.accommodationId,
        userId: bookingDetails.userId ?? null,
      },
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/cancel?bookingId=${booking.id}`,
    });

    await db
      .update(bookings)
      .set({ checkoutSessionId: stripeSession.id })
      .where(eq(bookings.id, booking.id));

    await logEvent({
      actorId: booking.userId ?? null,
      type: "BOOKING_CREATED",
      targetId: booking.id,
      metadata: {
        accommodationId: booking.accommodationId,
        totalPrice: booking.totalPrice,
        isGuest: booking.isGuest,
      },
    });

    return NextResponse.json(
      {
        url: stripeSession.url,
        sessionId: stripeSession.id,
        bookingId: booking.id,
      },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Payment failed", error);
    return new NextResponse(
      { error: error.message },
      { status: error.statusCode || 500 },
    );
  }
}
