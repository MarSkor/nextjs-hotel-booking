"use server";

import { verificationStatus } from "@/lib/verification-status";
import { auth } from "../../auth";
import { reviewReplies, reviews, accommodations } from "@/database/schema";
import { db } from "@/database/drizzle";
import { revalidatePath } from "next/cache";
import { logEvent } from "@/lib/logEvent";
import config from "@/lib/config";
import { workflowClient } from "@/lib/email";
import { eq } from "drizzle-orm";

export const deleteReview = async (reviewId) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: verificationStatus.UNAUTHORIZED };

  try {
    const review = await db.query.reviews.findFirst({
      where: (rev, { and, eq }) =>
        and(eq(rev.id, reviewId), eq(rev.userId, userId)),
      with: {
        accommodation: true,
      },
    });

    if (!review) return { error: "Review not found" };

    const accommodationSlug = review.accommodation.slug;
    const accommodationId = review.accommodationId;

    await db.delete(reviews).where(eq(reviews.id, reviewId));

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

    revalidatePath("/account/booking-history/[id]", "page");
    revalidatePath(`/accommodation/${accommodationSlug}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete review" };
  }
};

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
        status: "APPROVED",
      })
      .onConflictDoUpdate({
        target: reviews.bookingId,
        set: {
          rating: data.rating.toString(),
          comment: data.comment,
          title: data.title,
          updatedAt: new Date(),
          status: "APPROVED",
        },
      })
      .returning({ id: reviews.id });

    const acc = await db.query.accommodations.findFirst({
      where: eq(accommodations.id, data.accommodationId),
      columns: { slug: true },
    });

    if (acc) {
      revalidatePath(`/accommodation/${acc.slug}`);
    }

    const reviewId = res[0]?.id;

    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    });

    if (review) {
      await workflowClient.trigger({
        url: `${config.env.apiEndpoint}/api/workflows/update-rating`,
        body: { accommodationId: review.accommodationId },
      });
    }

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
