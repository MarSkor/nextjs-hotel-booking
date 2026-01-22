import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { accommodations, reviews } from "@/database/schema";
import { eq, and, count, avg } from "drizzle-orm";

export const { POST } = serve(async (context) => {
  const { accommodationId } = context.requestPayload;

  const stats = await context.run("calculate-stats", async () => {
    const result = await db
      .select({
        avgRating: avg(reviews.rating),
        reviewCount: count(),
      })
      .from(reviews)
      .where(
        and(
          eq(reviews.accommodationId, accommodationId),
          eq(reviews.status, "APPROVED"),
        ),
      );

    const reviewCount = Number(result[0]?.reviewCount ?? 0);
    const rawAvg = result[0]?.avgRating ?? "0";
    const formattedAvg =
      reviewCount > 0 ? parseFloat(rawAvg).toFixed(1) : "0.0";

    return {
      avgRating: formattedAvg,
      count: reviewCount,
    };
  });

  await context.run("update-accommodation", async () => {
    await db
      .update(accommodations)
      .set({
        averageRating: stats.avgRating,
        reviewCount: stats.count,
      })
      .where(eq(accommodations.id, accommodationId));
  });
});
