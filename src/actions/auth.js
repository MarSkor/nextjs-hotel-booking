"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema/users";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { signIn } from "../../auth";
import ratelimit from "@/lib/rateLimit";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

export const loginWithCredentials = async (params) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return { success: false, error: result.error.flattenError() };
    }
    return { success: true };
  } catch (error) {
    // console.log(error, "Login error");
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    };
  }
};

export const register = async (params) => {
  const { fullName, email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  //check for existing user
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      success: false,
      error: "Unable to register at the moment. Please try again later.",
    };
  }
  const hashedPassword = await hash(password, 10);
  try {
    await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
    });

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email,
        fullName,
      },
    });

    await loginWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log("register error", error);
    return {
      success: false,
      error: "Unable to register at the moment. Please try again later.",
    };
  }
};
