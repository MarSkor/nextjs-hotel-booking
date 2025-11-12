"use server";

import { db } from "@/database/drizzle";
import { accommodations, bookings, users } from "@/database/schema";
import { gt } from "drizzle-orm";

const startOfWeek = () => {
  const now = new Date();
  const firstDay = now.getDate() - now.getDay() + 1;
  return new Date(now.setDate(firstDay));
};

//to fix, not showing "new" statuses.
export const getAdminStats = async () => {
  try {
    const weekStart = startOfWeek();

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

    // console.log("newaccs: ", newAccs.length);

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
    console.error("Error fetching data: ", error);
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
