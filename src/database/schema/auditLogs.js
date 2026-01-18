import {
  uuid,
  pgTable,
  text,
  pgEnum,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const eventTypeEnum = pgEnum("enumEventType", [
  "EMAIL_CHANGED",
  "EMAIL_CHANGE_REQUESTED",
  "EMAIL_VERIFICATION_RESENT",
  "PASSWORD_RESET_REQUESTED",
  "PASSWORD_CHANGED",
  "PASSWORD_RESET",
  "ACCOUNT_DELETED",
  "REVIEW_SUBMITTED",
  "BOOKING_CREATED",
  "BOOKING_CONFIRMED",
  "BOOKING_CANCELLED",

  // Admin Actions
  "ADMIN_BOOKING_CANCELLED",
  "ADMIN_PRICE_OVERRIDE",
  "ADMIN_USER_BANNED",
  "ADMIN_USER_DELETED",
  "ADMIN_LISTING_APPROVED",
  "ADMIN_REVIEW_APPROVED",
  "ADMIN_REVIEW_REJECTED",
  "ADMIN_REVIEW_REPLIED",
  "ADMIN_RESOURCE_DELETE",
  "SYSTEM_SETTING_CHANGED",
]);

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id").references(() => users.id, {
    onDelete: "set null",
  }),
  targetId: uuid("target_id"),
  type: eventTypeEnum("type").notNull(),
  metadata: jsonb("metadata"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});
