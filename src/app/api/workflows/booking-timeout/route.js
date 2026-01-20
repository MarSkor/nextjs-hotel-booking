import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export const { POST } = serve(async (context) => {
  const { bookingId } = context.requestPayload;

  await context.sleep("wait-for-payment", 30 * 60);

  const booking = await context.run("check-booking-status", async () => {
    const [res] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);
    return res;
  });
  if (booking && booking.status === "PENDING") {
    await context.run("cancel-booking", async () => {
      await db
        .update(bookings)
        .set({ status: "CANCELLED" })
        .where(eq(bookings.id, bookingId));

      revalidateTag("admin-stats");
    });
  }
});
