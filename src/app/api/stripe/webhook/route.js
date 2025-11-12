import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import config from "@/lib/config";
import { workflowClient } from "@/lib/email";
import { stripe } from "@/lib/stripe";

const webhookSecret = config.env.stripe.webhookSecret;

export async function POST(req) {
  const buffer = await req.arrayBuffer();
  const stripeSignature = req.headers.get("stripe-signature");
  const body = Buffer.from(buffer).toString();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      webhookSecret
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  const session = event.data.object;
  if (event.type === "checkout.session.completed") {
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await db
        .update(bookings)
        .set({ status: "confirmed", isPaid: true })
        .where(eq(bookings.id, bookingId));

      await workflowClient.trigger({
        url: `${config.env.prodApiEndpoint}/api/workflows/booking-confirmation`,
        body: {
          email: session.customer_email,
          name: session.customer_details?.name || "",
          title: session.metadata?.title || "",
          checkIn: session.metadata?.checkIn,
          checkOut: session.metadata?.checkOut,
          totalPrice: session.amount_total / 100,
        },
      });
    }
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await db
        .update(bookings)
        .set({ status: "cancelled" })
        .where(eq(bookings.id, bookingId));
    }
  }
  return new Response("Webhook handled.", { status: 200 });
}
