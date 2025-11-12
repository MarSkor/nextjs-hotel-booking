"use server";
import { db } from "@/database/drizzle";
import { accommodations } from "@/database/schema/accommodations";
import { slugify } from "@/utils/Helpers";
import { eq } from "drizzle-orm";
import ImageKit from "imagekit";
import config from "@/lib/config";
import { revalidatePath } from "next/cache";

const imagekit = new ImageKit({
  publicKey: config.env.imagekit.publicKey,
  privateKey: config.env.imagekit.privateKey,
  urlEndpoint: config.env.imagekit.urlEndpoint,
});

const generateUniqueSlug = async (title) => {
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
};

export const getAccommodationById = async (id) => {
  try {
    if (!id)
      return {
        success: false,
        message: "Accommodation ID is not provided.",
      };
    const [accommodation] = await db
      .select()
      .from(accommodations)
      .where(eq(accommodations.id, id))
      .limit(1);

    if (!accommodation) return null;

    return {
      ...accommodation,
    };
  } catch (error) {
    // console.error("Error", error);
    return {
      success: false,
      message: "Failed to load accommodation details.",
    };
  }
};

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

export const updateAccommodation = async (params) => {
  const { id, featuredImage, ...rest } = params;

  if (!id) {
    return { success: false, message: "Accommodation ID is required" };
  }

  try {
    const existingAccommodation = await db.query.accommodations.findFirst({
      where: eq(accommodations.id, id),
    });

    if (!existingAccommodation) {
      return {
        success: false,
        message: "Could not find accommodation.",
      };
    }
    //featuredImage check
    const newFeaturedImage = featuredImage;
    const prevFeaturedImage = existingAccommodation.featuredImage;

    if (
      newFeaturedImage &&
      prevFeaturedImage &&
      newFeaturedImage.fileId !== prevFeaturedImage.fileId
    ) {
      try {
        await imagekit.deleteFile(fileId);
      } catch (error) {
        console.warn(
          "Previous featured image is already deleted: ",
          error.message
        );
      }
    }

    const slug = await generateUniqueSlug(rest.title, id);

    const updatedAccommodation = await db
      .update(accommodations)
      .set({
        ...rest,
        slug,
        featuredImage: newFeaturedImage || null,
        updatedAt: new Date(),
      })
      .where(eq(accommodations.id, id))
      .returning();

    // console.log("updatedAccs: ", updatedAccs);

    revalidatePath(`/admin/accommodations/edit/${id}`);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedAccommodation[0])),
    };
  } catch (error) {
    console.error("Error", error.message);
    return {
      success: false,
      message: "An error occurred while updating the accommodation.",
    };
  }
};

export const deleteAccommodation = async (id) => {
  if (!id)
    return {
      success: false,
      message: "Accommodation ID is missing.",
    };

  try {
    const acc = await db.query.accommodations.findFirst({
      where: eq(accommodations.id, id),
    });
    if (!acc)
      return {
        success: false,
        message: "Accommodation Not Found.",
      };
    if (acc.featuredImage?.fileId) {
      try {
        await imagekit.deleteFile(acc.featuredImage.fileId);
      } catch (err) {
        // console.warn("Image already deleted in ImageKit.");
        return {
          success: false,
        };
      }
    }

    await db.delete(accommodations).where(eq(accommodations.id, id));

    revalidatePath("/admin/accommodations", "page");
    revalidatePath(`/admin/accommodations/edit/${id}`, "page");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to delete accommodation.",
    };
  }
};
