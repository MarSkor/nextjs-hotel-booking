"use server";

import { db } from "@/database/drizzle";
import {
  accommodations,
  bookings,
  contactMessages,
  reviews,
  users,
} from "@/database/schema";
import { eq, count, sum, avg, and, gte, lte } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import { logEvent } from "@/lib/logEvent";
import { auth } from "../../auth";
import { verificationStatus } from "@/lib/verification-status";
import { RESOURCE_MAP } from "@/utils/resourceMap";
import { imagekit } from "@/lib/imageKit";

dayjs.extend(weekday);
dayjs.extend(utc);

export const getAdminStats = unstable_cache(
  async () => {
    const now = dayjs();
    const startOfThisMonth = now.startOf("month").toDate();
    const startOfLastMonth = now.subtract(1, "month").startOf("month").toDate();
    const endOfLastMonth = now.subtract(1, "month").endOf("month").toDate();
    const today = now.startOf("day").toDate();

    try {
      const getMetric = async (table, condition) => {
        const [res] = await db
          .select({ value: count() })
          .from(table)
          .where(condition);
        return Number(res?.value ?? 0);
      };

      const [
        revThisMonth,
        revLastMonth,
        bookedNights,
        totalAccs,
        activeBookings,
        pendingBookings,
        unreadMessages,
        avgRating,
      ] = await Promise.all([
        db
          .select({ val: sum(bookings.totalPrice) })
          .from(bookings)
          .where(
            and(
              eq(bookings.status, "CONFIRMED"),
              gte(bookings.createdAt, startOfThisMonth),
            ),
          ),

        db
          .select({ val: sum(bookings.totalPrice) })
          .from(bookings)
          .where(
            and(
              eq(bookings.status, "CONFIRMED"),
              gte(bookings.createdAt, startOfLastMonth),
              lte(bookings.createdAt, endOfLastMonth),
            ),
          ),

        db
          .select({ val: sum(bookings.nights) })
          .from(bookings)
          .where(
            and(
              eq(bookings.status, "CONFIRMED"),
              gte(bookings.checkIn, startOfThisMonth),
            ),
          ),

        db.select({ val: count() }).from(accommodations),

        getMetric(
          bookings,
          and(
            eq(bookings.status, "CONFIRMED"),
            lte(bookings.checkIn, today),
            gte(bookings.checkOut, today),
          ),
        ),

        getMetric(bookings, eq(bookings.status, "PENDING")),

        getMetric(contactMessages, eq(contactMessages.status, "UNREAD")),

        db.select({ val: avg(reviews.rating) }).from(reviews),
      ]);

      const currentRev = Number(revThisMonth[0]?.val ?? 0);
      const lastRev = Number(revLastMonth[0]?.val ?? 0);
      const revenueGrowth =
        lastRev === 0 ? 100 : ((currentRev - lastRev) / lastRev) * 100;

      const daysInMonth = now.daysInMonth();
      const capacity = Number(totalAccs[0]?.val ?? 0) * daysInMonth;
      const actualNights = Number(bookedNights[0]?.val ?? 0);
      const occupancyRate =
        capacity === 0 ? 0 : (actualNights / capacity) * 100;

      return {
        revenue: {
          total: currentRev,
          growth: revenueGrowth.toFixed(1),
        },
        occupancy: occupancyRate.toFixed(1),
        activeInHouse: activeBookings,
        pendingActions: pendingBookings + unreadMessages,
        rating: Number(avgRating[0]?.val ?? 0).toFixed(1),
      };
    } catch (error) {
      // console.log("admin stats error: ", error);
      return null;
    }
  },
  ["admin-stats-cache"],
  {
    revalidate: 3600,
    tags: ["admin-stats"],
  },
);

export const reviewModeration = async (id, status) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN")
    return { success: false, error: verificationStatus.UNAUTHORIZED };

  try {
    await db.update(reviews).set({ status }).where(eq(reviews.id, id));

    await logEvent({
      actorId: session.user.id,
      type:
        status === "APPROVED"
          ? "ADMIN_REVIEW_APPROVED"
          : "ADMIN_REVIEW_REJECTED",
      targetId: id,
      metadata: { newStatus: status },
    });

    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update review" };
  }
};

export const deleteResourceAction = async (resource, id) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return {
      success: false,
      error: verificationStatus.UNAUTHORIZED,
      message: "Unauthorized.",
    };
  }

  const config = RESOURCE_MAP[resource];
  if (!config) return { success: false, message: "Invalid resource type." };

  try {
    const item = await db.query[resource].findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });
    if (!item) return { success: false, message: `${config.label} not found.` };

    if (config.hasFiles && item.featuredImage?.fileId) {
      try {
        await imagekit.deleteFile(item.featuredImage.fileId);
      } catch (err) {
        return {
          success: false,
          error: verificationStatus.ERROR,
          message: "ImageKit file deletion failed.",
        };
      }
    }

    await db.delete(config.table).where(eq(config.table.id, id));

    await logEvent({
      actorId: session.user.id,
      type: "ADMIN_RESOURCE_DELETE",
      targetId: id,
      metadata: {
        resource,
        deletedData: item,
      },
    });
    revalidatePath(config.path, "page");
    if (resource === "accommodations") {
      revalidatePath(`/admin/accommodations/edit/${id}`, "page");
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: verificationStatus.ERROR,
      message: "An error occurred deleting the resource.",
    };
  }
};

export const messageModeration = async (id, status) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return {
      success: false,
      error: verificationStatus.UNAUTHORIZED,
      message: "Unauthorized",
    };
  }

  try {
    await db
      .update(contactMessages)
      .set({ status })
      .where(eq(contactMessages.id, id));

    await logEvent({
      actorId: session.user.id,
      type: "ADMIN_MESSAGE_READ",
      targetId: id,
      metadata: { newStatus: status },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: verificationStatus.ERROR,
      message: "Failed to update status",
    };
  }
};

export const bookingModeration = async (bookingId) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status: "CANCELLED" })
      .where(eq(bookings.id, bookingId))
      .returning();

    if (!updatedBooking) throw new Error("Booking not found");

    await logEvent({
      actorId: session.user.id,
      type: "ADMIN_BOOKING_CANCELLED",
      targetId: bookingId,
      metadata: {
        cancelledBy: session.user.email,
        bookingName: updatedBooking.name,
        bookingEmail: updatedBooking.email,
      },
    });

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to cancel booking." };
  }
};
