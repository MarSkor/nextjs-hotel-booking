import Success from "@/features/booking/components/Success";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

const BookingSuccess = async ({ searchParams }) => {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const {
    status,
    customer_details: { email: customerEmail },
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return <Success customerEmail={customerEmail} sessionId={session_id} />;
  }
};

export default BookingSuccess;
