"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema/users";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { signIn } from "../../auth";

export const loginWithCredentials = async (params) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return { success: false, error: result.error };
    }
    return { success: true };
  } catch (error) {
    // console.log(error, "Login error");
    return {
      success: false,
      error: "Something went wrong. Try logging in again.",
    };
  }
};

export const register = async (params) => {
  const { fullName, email, password } = params;

  //check for existing user
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }
  const hashedPassword = await hash(password, 10);
  try {
    await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
    });

    await loginWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log(error, "register error");
    return {
      success: false,
      error: "Unable to register at the moment. Please try again later.",
    };
  }
};
