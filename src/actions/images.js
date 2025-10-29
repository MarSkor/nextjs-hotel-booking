"use server";
import { db } from "@/database/drizzle";
import { accommodations } from "@/database/schema";
import config from "@/lib/config";
import { eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { revalidatePath } from "next/cache";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export const deleteTempImageFile = async (fileId) => {
  if (!fileId)
    return {
      success: false,
      message: "Missing fileId",
    };
  try {
    await imagekit.deleteFile(fileId);
    return { success: true };
  } catch (error) {
    // console.error("Temp delete error:", error);
    return { success: false, message: error.message };
  }
};

export const deleteImageFile = async (fileId, accId) => {
  // console.log("delete imagefile", { fileId, accId });
  if (!fileId || !accId) {
    return { success: false, message: "Missing ID(s)." };
  }

  try {
    const accommodation = await db.query.accommodations.findFirst({
      where: eq(accommodations.id, accId),
    });

    if (!accommodation) {
      return {
        success: false,
        message: "Could not find accommodation.",
      };
    }

    if (accommodation.featuredImage?.fileId !== fileId) {
      console.warn({
        dbFileId: accommodation.featuredImage?.fileId,
        receivedFileId: fileId,
      });
      return {
        success: false,
        message: "FileID does not match the accommodation's featured image.",
      };
    }

    try {
      await imagekit.deleteFile(fileId);
    } catch (error) {
      let message = "Failed to delete image.";
      if (error?.message?.includes("invalid input syntax")) {
        message = "Invalid database update — check featuredImage column type.";
      } else if (error?.message) {
        message = error.message.split("\n")[0]; // only first line
      }

      return {
        success: false,
        message,
      };
    }

    const updatedRes = await db
      .update(accommodations)
      .set({ featuredImage: null })
      .where(eq(accommodations.id, accId))
      .returning();

    revalidatePath(`/admin/accommodations/edit/${accId}`);

    return {
      success: true,
      message: "Image Deleted.",
      data: updatedRes[0],
    };
  } catch (error) {
    // console.error("Delete error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
