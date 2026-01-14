import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const passwordResets = pgTable("password_resets", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  pin: text("pin").notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});
