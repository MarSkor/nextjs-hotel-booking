"use server";

import { db } from "@/database/drizzle";
import { accommodations, bookings, users } from "@/database/schema";
import { gt, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";

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

export const deleteUser = async (id) => {
  if (!id) return { success: false, message: "User ID is required" };

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!user) {
      return {
        success: false,
        message: "Could not find user.",
      };
    }
    if (user.role === "ADMIN") {
      return {
        success: false,
        message: "Admin accounts cannot be deleted.",
      };
    }

    await db.delete(users).where(eq(users.id, id));
    revalidatePath("/admin/users", "page");
    return {
      success: true,
      message: "User Successfully Deleted.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Unexpected error trying to delete user.",
    };
  }
};
