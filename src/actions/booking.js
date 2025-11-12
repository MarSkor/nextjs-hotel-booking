"use server";
import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import dayjs from "dayjs";

export const getBookingDates = async (accommodationId) => {
  const data = await db
    .select({ checkIn: bookings.checkIn, checkOut: bookings.checkOut })
    .from(bookings)
    .where(
      eq(bookings.accommodationId, accommodationId),
      eq(bookings.status, "confirmed")
    );
  return data.map((d) => ({
    from: dayjs(d.checkIn).startOf("day").toDate(),
    to: dayjs(d.checkOut).endOf("day").toDate(),
  }));
};

export const createBooking = async (data) => {
  console.log("data: ", data);
  try {
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
        status: "pending",
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
      metadata: { bookingId: booking.id },
      success_url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/booking/cancel`,
    });
    await db
      .update(bookings)
      .set({ checkoutSessionId: stripeCheckOutSession.id })
      .where(eq(bookings.id, booking.id));
    return {
      url: stripeCheckOutSession.url,
    };
  } catch (error) {
    console.error("error creating booking: ", error.message);
    return {
      success: false,
      message: error.message || "Error. Could not create booking.",
    };
  }
};
