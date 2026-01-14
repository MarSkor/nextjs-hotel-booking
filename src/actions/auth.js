"use server";

import { db } from "@/database/drizzle";
import { lower, users } from "@/database/schema/users";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { signIn } from "../../auth";
import ratelimit from "@/lib/rateLimit";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { workflowClient } from "@/lib/email";
import config from "@/lib/config";
import { flattenError, safeParse } from "zod";
import { registerSchema } from "@/lib/validations";
import { AuthError } from "next-auth";

export const loginWithCredentials = async (data) => {
  const { email, password } = data;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      return {
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      };
    }
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return {
            success: false,
            error: "Invalid credentials.",
            statusCode: 401,
          };
        default:
          return {
            success: false,
            error: "Oops. Something went wrong.",
            statusCode: 500,
          };
      }
    }
    return {
      success: false,
      error: "Internal Server Error",
      statusCode: 500,
    };
  }
};

export const register = async (data) => {
  const parsedValues = safeParse(registerSchema, data);

  if (!parsedValues.success) {
    const flatErrors = flattenError(parsedValues.error);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const { fullName, email, password } = parsedValues.data;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(lower(users.email), email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        error: "Unable to register at the moment. Please try again later.",
        statusCode: 409,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error",
      statusCode: 500,
    };
  }

  const hashedPassword = await hash(password, 10);
  try {
    await db
      .insert(users)
      .values({
        fullName,
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id })
      .then((res) => res[0]);

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
    return {
      success: false,
      error: "Internal Server Error",
      statusCode: 500,
    };
  }
};
