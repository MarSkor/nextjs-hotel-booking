"use server";

import { db } from "@/database/drizzle";
import {
  accommodations,
  bookings,
  contactMessages,
  reviews,
  users,
} from "@/database/schema";
import { gt, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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

export const getAdminStats = async () => {
  try {
    const weekStart = dayjs().utc().weekday(1).startOf("day").toDate();

    const totalUsers = await db.select().from(users);
    const newUsers = await db
      .select()
      .from(users)
      .where(gt(users.createdAt, weekStart));

    const totalAccs = await db.select().from(accommodations);
    const newAccs = await db
      .select()
      .from(accommodations)
      .where(gt(accommodations.createdAt, weekStart));

    const totalBookings = await db.select().from(bookings);
    const newBookings = await db
      .select()
      .from(bookings)
      .where(gt(bookings.createdAt, weekStart));

    return {
      users: {
        total: totalUsers.length,
        newThisWeek: newUsers.length,
      },
      accommodations: {
        total: totalAccs.length,
        newThisWeek: newAccs.length,
      },
      bookings: {
        total: totalBookings.length,
        newThisWeek: newBookings.length,
      },
    };
  } catch (error) {
    // console.error("Error fetching data: ", error);
    return {
      users: {
        total: 0,
        newThisWeek: 0,
      },
      accommodations: {
        total: 0,
        newThisWeek: 0,
      },
      bookings: {
        total: 0,
        newThisWeek: 0,
      },
    };
  }
};

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
    // console.error(error);
    return { error: "Failed to update review" };
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
        // console.error("ImageKit deletion failed, proceeding with DB delete...");
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
    // console.error(`Delete failed for ${resource}:`, error);
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
    console.log("error: ", error);
    return {
      success: false,
      error: verificationStatus.ERROR,
      message: "Failed to update status",
    };
  }
};
