import { uuid, pgTable, text, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const eventTypeEnum = pgEnum("enumEventType", [
  "EMAIL_CHANGED",
  "EMAIL_CHANGE_REQUESTED",
  "EMAIL_VERIFICATION_RESENT",
  "PASSWORD_RESET_REQUESTED",
  "PASSWORD_CHANGED",
  "PASSWORD_RESET",
  "ACCOUNT_DELETED",
]);

export const userEvents = pgTable("user_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .defaultRandom()
    .references(() => users.id, { onDelete: "cascade" }),
  type: eventTypeEnum("type").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});
