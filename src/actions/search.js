"use server";

import { db } from "@/database/drizzle";
import { accommodations } from "@/database/schema";
import { ilike, or, sql } from "drizzle-orm";

export const getSearchData = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const res = await db
    .select({
      id: accommodations.id,
      slug: accommodations.slug,
      title: accommodations.title,
      propertyType: accommodations.propertyType,
      price: accommodations.pricePerNight,
      image: accommodations.featuredImage,
    })
    .from(accommodations)
    .where(
      or(
        ilike(accommodations.title, `%${query}%`),
        ilike(sql`${accommodations.propertyType}::text`, `%${query}%`)
      )
    )
    .limit(5);

  return res;
};
