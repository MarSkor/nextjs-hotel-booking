"use server";

import { verificationStatus } from "@/lib/verification-status";
import { auth } from "../../auth";
import { reviewReplies, reviews } from "@/database/schema";
import { db } from "@/database/drizzle";
import { revalidatePath } from "next/cache";
import { logEvent } from "@/lib/logEvent";
import config from "@/lib/config";
import { workflowClient } from "@/lib/email";
import { eq } from "drizzle-orm";
import { reviewSchema } from "@/lib/validations";

export const deleteReview = async (reviewId) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: verificationStatus.UNAUTHORIZED };

  try {
    const review = await db.query.reviews.findFirst({
      where: (rev, { and, eq }) =>
        and(eq(rev.id, reviewId), eq(rev.userId, userId)),
      with: { accommodation: true },
    });

    if (!review) return { error: "Review not found" };

    const accommodationSlug = review.accommodation.slug;
    const accommodationId = review.accommodationId;
    const bookingId = review.bookingId;

    await db.delete(reviews).where(eq(reviews.id, reviewId));

    try {
      //upstash workflow must run locally (with its own local variables) or be deployed
      await workflowClient.trigger({
        url: `${config.env.apiEndpoint}/api/workflows/update-rating`,
        body: { accommodationId },
      });

      await logEvent({
        actorId: userId,
        type: "REVIEW_DELETED",
        targetId: reviewId,
        metadata: { accommodationId, type: "review" },
      });
    } catch (error) {
      console.error("Side-effect failed, but review was deleted", error);
    }

    revalidatePath(`/account/booking-history/${bookingId}`);
    revalidatePath(`/accommodation/${accommodationSlug}`);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to delete review" };
  }
};

export const submitReview = async (data) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: verificationStatus.UNAUTHORIZED };

  const validation = reviewSchema.safeParse(data);
  if (!validation.success) {
    return { error: "Invalid data: " + validation.error.errors[0].message };
  }

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
    if (!reviewId) throw new Error("Database failed to return ID");

    try {
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
    } catch (error) {
      console.log("error: ", error);
    }

    const acc = await db.query.accommodations.findFirst({
      where: (table, { eq }) => eq(table.id, data.accommodationId),
    });

    if (acc) revalidatePath(`/accommodation/${acc.slug}`);
    revalidatePath(`/account/booking-history/${data.bookingId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to submit review" };
  }
};

export const upsertReviewReply = async (reviewId, replyText) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN")
    return { error: verificationStatus.UNAUTHORIZED };

  try {
    await db
      .insert(reviewReplies)
      .values({
        reviewId,
        ownerId: session.user.id,
        reply: replyText,
      })
      .onConflictDoUpdate({
        target: reviewReplies.reviewId,
        set: {
          reply: replyText,
          updatedAt: new Date(),
        },
      });

    await logEvent({
      actorId: session.user.id,
      type: "ADMIN_REVIEW_REPLIED",
      targetId: reviewId,
      metadata: { replyLength: replyText.length, comment: replyText },
    });

    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save reply" };
  }
};
