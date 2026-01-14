"use server";

import { db } from "@/database/drizzle";
import { auth } from "../../auth";
import { and, desc, eq, sql } from "drizzle-orm";
import { bookings, favorites, userEvents, users } from "@/database/schema";
import { FAVORITES_PER_PAGE, BOOKINGS_PER_PAGE } from "@/utils/constants";
import { revalidatePath } from "next/cache";
import config from "@/lib/config";
import { workflowClient } from "@/lib/email";
import { verificationStatus } from "@/lib/verification-status";
import { headers } from "next/headers";

export const fetchAllBookings = async (userId, offset) => {
  try {
    const data = await db.query.bookings.findMany({
      where: and(eq(bookings.userId, userId), eq(bookings.status, "confirmed")),
      with: { accommodation: true },
      orderBy: [desc(bookings.createdAt)],
      limit: BOOKINGS_PER_PAGE,
      offset: offset,
    });
    return data;
  } catch (error) {
    // console.log("Database Error: ", error);
    throw new Error("Failed to fetch booking history.");
  }
};

export const getBookingHistoryPages = async (userId) => {
  const [{ count: bookingsHistoryCount }] = await db
    .select({ count: sql`count(*)` })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  const totalCount = Number(bookingsHistoryCount ?? 0);
  const totalPages = Math.ceil(totalCount / BOOKINGS_PER_PAGE);

  return totalPages;
};

export const fetchAllFavorites = async (userId, offset) => {
  try {
    const data = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      with: { accommodation: true },
      orderBy: desc(favorites.createdAt),
      limit: FAVORITES_PER_PAGE,
      offset: offset,
    });
    return data;
  } catch (error) {
    // console.log("Database Error: ", error);
    throw new Error("Failed to fetch user favorites.");
  }
};

export const getFavoritesPages = async (userId) => {
  const [{ count: favoritesCount }] = await db
    .select({ count: sql`count(*)` })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  const totalCount = Number(favoritesCount ?? 0);
  const totalPages = Math.ceil(totalCount / FAVORITES_PER_PAGE);

  return totalPages;
};

export const isAccommodationFavorite = async (accommodationId) => {
  const session = await auth();
  if (!session?.user.id) return false;

  const res = await db.query.favorites.findFirst({
    where: and(
      eq(favorites.userId, session.user.id),
      eq(favorites.accommodationId, accommodationId)
    ),
  });

  return !!res;
};

export const toggleFavoriteAction = async (userId, accommodationId) => {
  const existingFavorite = await db.query.favorites.findFirst({
    where: and(
      eq(favorites.userId, userId),
      eq(favorites.accommodationId, accommodationId)
    ),
  });

  if (existingFavorite) {
    await db.delete(favorites).where(eq(favorites.id, existingFavorite.id));
  } else {
    await db.insert(favorites).values({ userId, accommodationId });
  }
  revalidatePath("/");
  revalidatePath("/account/favorites");
  return { favorite: !existingFavorite };
};

export const deleteAccount = async () => {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, error: verificationStatus.UNAUTHORIZED };

  const userId = session.user.id;
  const email = session.user.email;
  const fullName = session.user.name;

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = headerList.get("user-agent") || "unknown";

  try {
    await db.insert(userEvents).values({
      userId,
      type: "ACCOUNT_DELETED",
      ip,
      userAgent,
    });
    await workflowClient.trigger({
      url: `${config.env.apiEndpoint}/api/workflows/delete-account`,
      body: { email, fullName },
    });

    await db.delete(users).where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.log("delete user error: ", error);
    return { success: false, error: "Failed to delete account." };
  }
};
