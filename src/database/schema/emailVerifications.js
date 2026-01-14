import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const emailVerifications = pgTable("email_verifications", {
  token: text("token").primaryKey(),
  userId: uuid("user_id").notNull(),
  newEmail: text("new_email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
