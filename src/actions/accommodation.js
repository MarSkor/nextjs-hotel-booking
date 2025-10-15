"use server";
import { db } from "@/database/drizzle";
import { accommodations } from "@/database/schema/accommodations";

export const createAccommodation = async (params) => {
  try {
    const newAccommodation = await db
      .insert(accommodations)
      .values({
        ...params,
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
