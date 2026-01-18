"use server";
import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import { and, eq, inArray, lt, sql } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import dayjs from "dayjs";
import { headers } from "next/headers";
import { logEvent } from "@/lib/logEvent";

export const getBookingDates = async (accommodationId) => {
  const data = await db
    .select({ checkIn: bookings.checkIn, checkOut: bookings.checkOut })
    .from(bookings)
    .where(
      eq(bookings.accommodationId, accommodationId),
      eq(bookings.status, "CONFIRMED"),
    );
  return data.map((d) => ({
    from: dayjs(d.checkIn).startOf("day").toDate(),
    to: dayjs(d.checkOut).endOf("day").toDate(),
  }));
};

export const createBooking = async (data) => {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const now = new Date();

    await db
      .update(bookings)
      .set({ status: "CANCELLED" })
      .where(
        and(
          eq(bookings.status, "PENDING"),
          lt(bookings.createdAt, dayjs(now).subtract(1, "day").toDate()),
        ),
      );

    const overlappingBooking = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.accommodationId, data.accommodationId),
          inArray(bookings.status, ["PENDING", "CONFIRMED"]),
          sql`${bookings.checkIn} < ${data.checkOut} AND ${bookings.checkOut} > ${data.checkIn}`,
        ),
      );

    if (overlappingBooking.length > 0) {
      return {
        success: false,
        message:
          "Some or all selected dates of the accommodation are already booked",
      };
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        userId: data.userId ?? null,
        isGuest: data.isGuest ?? false,
        accommodationId: data.accommodationId,
        name: data.name,
        email: data.email,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        nights: data.totalNights,
        totalPrice: data.totalPrice,
        guests: data.guests,
        message: data.message,
        phone: data.phone,
        status: "PENDING",
        isPaid: false,
      })
      .returning();

    const stripeCheckOutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            // unit_amount: Math.round(Number(data.totalPrice) * 100)
            unit_amount: 0, // removes the card input details, user can check out immediately
            product_data: {
              name: data.title,
              description: `${data.totalNights} nights, ${data.guests} guests`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        accommodationId: data.accommodationId,
        userId: data.userId ?? null,
      },
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/cancel?bookingId=${booking.id}`,
    });
    await db
      .update(bookings)
      .set({ checkoutSessionId: stripeCheckOutSession.id })
      .where(eq(bookings.id, booking.id));

    await logEvent({
      actorId: data.userId ?? null,
      type: "BOOKING_CREATED",
      targetId: data.userId ?? null,
      metadata: {
        isGuest: data.isGuest ?? false,
        name: data.name,
        email: data.email,
        accommodationId: data.accommodationId,
        totalPrice: data.price,
        checkIn: data.startDate,
        checkOut: data.endDate,
        guestCount: data.guests,
      },
    });

    return {
      success: true,
      url: stripeCheckOutSession.url,
      bookingId: booking.id,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Error. Could not create booking.",
    };
  }
};
