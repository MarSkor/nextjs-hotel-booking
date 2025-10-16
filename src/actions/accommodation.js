"use server";
import { db } from "@/database/drizzle";
import { accommodations } from "@/database/schema/accommodations";

async function generateUniqueSlug(title) {
  const baseSlug = slugify(title);
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db
      .select({ slug: accommodations.slug })
      .from(accommodations)
      .where(eq(accommodations.slug, uniqueSlug))
      .limit(1);

    if (existing.length === 0) break;

    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  return uniqueSlug;
}

export const createAccommodation = async (params) => {
  try {
    const slug = await generateUniqueSlug(params.title);
    const newAccommodation = await db
      .insert(accommodations)
      .values({
        ...params,
        slug,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAccommodation[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occured while creating the accommodation.",
    };
  }
};
