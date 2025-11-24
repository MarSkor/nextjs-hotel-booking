import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import config from "@/lib/config";
import { workflowClient } from "@/lib/email";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";

const endpointSecret = config.env.stripe.webhookSecret;

//update the checkout - stripe events
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
      event.type
    );
    return new NextResponse("No bookingId in metadata", { status: 200 });
  }

  try {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));

    if (!booking) {
      console.warn("Webhook - Booking not found", bookingId);
      return new NextResponse("Booking not found.", { status: 200 });
    }

    switch (event.type) {
      case "checkout.session.completed":
        if (bookingId) {
          await db
            .update(bookings)
            .set({ status: "confirmed", isPaid: true })
            .where(eq(bookings.id, bookingId));

          try {
            await workflowClient.trigger({
              url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/workflows/booking-confirmation`,
              body: {
                email: session.customer_email,
                name: session.customer_details?.name || "",
                title: session.metadata?.title || "",
                checkIn: session.metadata?.checkIn,
                checkOut: session.metadata?.checkOut,
                totalPrice: session.amount_total / 100,
              },
            });
          } catch (error) {
            console.error(
              "Failed booking confirmation workflow:",
              error.message
            );
          }
        }
        break;

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        if (booking.status !== "cancelled" && !booking.isPaid) {
          await db
            .update(bookings)
            .set({ status: "cancelled" })
            .where(eq(bookings.id, bookingId));

          await stripe.checkout.sessions.expire(session.id);
        }
        break;

      default:
        console.log("Webhook event: ", EventTarget.type);
    }
    return NextResponse.json("Event Received", {
      status: 200,
    });
  } catch (error) {
    console.error("Webhook processing error.", error);
    return new NextResponse("Internal webhook error", { status: 500 });
  }
}
