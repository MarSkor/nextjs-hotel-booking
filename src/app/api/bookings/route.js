import { bookings, accommodations } from "@/database/schema";
import config from "@/lib/config";
import { db } from "@/database/drizzle";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { calculateNights } from "@/utils/date";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { accommodationId, checkIn, checkOut } = await req.json();
    if (!accommodationId || !checkIn || !checkOut)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    //prevent booking of past dates
    const today = new Date();
    if (new Date(checkIn) < new Date(today.toISOString().slice(0, 10))) {
      return NextResponse.json(
        { message: "Cannot book past dates" },
        { status: 400 }
      );
    }

    let nights;
    try {
      nights = calculateNights(checkIn, checkOut);
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    //fetch accs. data
    const accRowsDb = await db
      .select()
      .from(accommodations)
      .where(eq(accommodations.id, accommodationId))
      .limit(1);
    if (accRowsDb.length === 0)
      return NextResponse.json(
        { message: "Could not find accommodation." },
        { status: 404 }
      );

    const accommodation = accRowsDb[0];

    //checking if its available with already existing booking using sql
    const overlapping = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.accommodationId, accommodationId),
          sql`${bookings.checkIn} < ${new Date(checkOut).toISOString()} AND ${
            bookings.checkOut
          } > ${new Date(checkIn).toISOString()}`
        )
      );
    if (overlapping.length > 0) {
      return NextResponse.json(
        { message: "Accommodation not available for selected dates" },
        { status: 400 }
      );
    }

    //calculating the price
    const priceToCents = Math.round(Number(accommodation.pricePerNight) * 100);
    const priceTotal = priceToCents * nights;

    // pending booking
    const [newBooking] = await db
      .insert(bookings)
      .values({
        userId: session.user.id,
        accommodationId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        nights,
        priceTotal,
        status: "pending",
      })
      .returning();

    //stripe;
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: (accommodation.currency || "USD").toLowerCase(),
            product_data: {
              name: `Booking — ${accommodation.title}`,
              description: `${nights} night(s) at ${accommodation.title}`,
            },
            unit_amount: priceTotal,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: newBooking.id,
        userId: session.user.id,
        accommodationId,
      },
      success_url: `${config.env.apiEndpoint}/bookings/success?bookingId=${newBooking.id}`,
      cancel_url: `${config.env.apiEndpoint}/bookings/cancelled?bookingId=${newBooking.id}`,
    });

    //saving stripe session ids
    await db
      .update(bookings)
      .set({
        checkoutSessionId: stripeSession.id,
        paymentIntentId: stripeSession.payment_intent
          ? String(stripeSession.payment_intent)
          : null,
      })
      .where(eq(bookings.id, newBooking.id));

    console.log("new booking", newBooking);

    return NextResponse.json({
      sessionUrl: stripeSession.url,
      checkoutSessionId: stripeSession.id,
    });
  } catch (error) {
    console.error("Error booking accommodation", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
