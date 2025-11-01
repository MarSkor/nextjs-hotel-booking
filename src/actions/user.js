"use server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
