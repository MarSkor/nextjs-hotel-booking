import { pgTable, uuid, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { accommodations } from "./accommodations.js";

export const enumStatus = pgEnum("enumStatus", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const bookings = pgTable("bookings", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accommodationId: uuid("accommodation_id")
    .notNull()
    .references(() => accommodations.id, { onDelete: "cascade" }),
  checkIn: timestamp("check_in", { withTimezone: true }).notNull(),
  checkOut: timestamp("check_out", { withTimezone: true }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: enumStatus("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  accommodation: one(accommodations, {
    fields: [bookings.accommodationId],
    references: [accommodations.id],
  }),
  //   payments: many(payments),
}));
