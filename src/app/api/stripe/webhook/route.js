import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { accommodations, bookings } from "@/database/schema";
import config from "@/lib/config";
import { workflowClient } from "@/lib/email";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { logEvent } from "@/lib/logEvent";

const endpointSecret = config.env.stripe.webhookSecret;

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    console.error("Error verifying webhook signature.", error);
    return new NextResponse(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  const session = event.data.object;
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    console.warn(
      "Webhook received without bookingID: Event Type: ",
      event.type,
    );
    return new NextResponse("No bookingId in metadata", { status: 200 });
  }

  const [booking] = await db
    .select({
      ...bookings,
      title: accommodations.title,
    })
    .from(bookings)
    .leftJoin(accommodations, eq(bookings.accommodationId, accommodations.id))
    .where(eq(bookings.id, bookingId));

  if (!booking) {
    return new NextResponse("Booking not found.", { status: 200 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        if (bookingId) {
          await db
            .update(bookings)
            .set({ status: "CONFIRMED", isPaid: true })
            .where(eq(bookings.id, bookingId));

          await logEvent({
            actorId: booking.userId,
            type: "BOOKING_CONFIRMED",
            targetId: bookingId,
            metadata: {
              stripeSessionId: session.id,
              amount: booking.totalPrice,
            },
          });

          try {
            await workflowClient.trigger({
              url: `${config.env.prodApiEndpoint}/api/workflows/booking-confirmation`,
              body: {
                email: session.customer_email,
                name: session.customer_details?.name || booking.name,
                title: booking.title || "",
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                totalPrice: booking.totalPrice,
                message: booking.message,
              },
            });
          } catch (error) {
            console.error(
              "Failed booking confirmation workflow:",
              error.message,
            );
          }
        }
        break;

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        if (booking.status !== "CANCELLED" && !booking.isPaid) {
          await db
            .update(bookings)
            .set({ status: "CANCELLED" })
            .where(eq(bookings.id, bookingId));

          await logEvent({
            actorId: booking.userId,
            type: "BOOKING_CANCELLED",
            targetId: bookingId,
            metadata: {
              reason:
                event.type === "checkout.session.expired"
                  ? "Stripe session expired"
                  : "Payment failed",
              stripeSessionId: session.id,
            },
          });

          await stripe.checkout.sessions.expire(session.id);
        }
        break;
    }
    return NextResponse.json("Event Received", {
      status: 200,
    });
  } catch (error) {
    // console.error("Webhook processing error.", error);
    return new NextResponse("Internal webhook error", { status: 500 });
  }
}
