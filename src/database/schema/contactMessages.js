import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const contactStatusEnum = pgEnum("contact_status", [
  "UNREAD",
  "READ",
  "ARCHIVED",
]);

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: contactStatusEnum("status").default("UNREAD"),
  createdAt: timestamp("created_at").defaultNow(),
});
