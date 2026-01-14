"use server";
import { eq } from "drizzle-orm";
import { db } from "./drizzle";
import { lower, users } from "./schema";

export const findUserByEmail = async (email) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase().toString()))
    .then((res) => res[0] ?? null);

  return user;
};

export const findUserById = async (id) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));

  return user;
};
