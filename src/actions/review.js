"use server";

import { verificationStatus } from "@/lib/verification-status";
import { auth } from "../../auth";
import { reviews } from "@/database/schema";
import { db } from "@/database/drizzle";
import { revalidatePath } from "next/cache";
import { logEvent } from "@/lib/logEvent";

export const submitReview = async (data) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: verificationStatus.UNAUTHORIZED };

  try {
    const existingReview = await db.query.reviews.findFirst({
      where: (reviews, { eq }) => eq(reviews.bookingId, data.bookingId),
    });

    const res = await db
      .insert(reviews)
      .values({
        userId,
        accommodationId: data.accommodationId,
        bookingId: data.bookingId,
        rating: data.rating.toString(),
        comment: data.comment,
        title: data.title,
        status: "PENDING",
      })
      .onConflictDoUpdate({
        target: reviews.bookingId,
        set: {
          rating: data.rating.toString(),
          comment: data.comment,
          title: data.title,
          updatedAt: new Date(),
          status: "PENDING",
        },
      })
      .returning({ id: reviews.id });

    const reviewId = res[0]?.id;

    await logEvent({
      actorId: userId,
      type: "REVIEW_SUBMITTED",
      targetId: reviewId,
      metadata: {
        accommodationId: data.accommodationId,
        bookingId: data.bookingId,
        rating: data.rating,
        isUpdate: !!existingReview,
        payload: {
          rating: data.rating,
          title: data.title,
          comment: data.comment,
        },
        previous: existingReview
          ? {
              rating: existingReview.rating,
              title: existingReview.title,
              comment: existingReview.comment,
            }
          : null,
      },
    });

    revalidatePath("/account/booking-history/[id]", "page");
    return { success: true };
  } catch (error) {
    console.log("error: ", error);
    return { error: "Failed to submit review" };
  }
};
