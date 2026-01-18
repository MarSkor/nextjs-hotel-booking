import {
  pgTable,
  uuid,
  timestamp,
  decimal,
  pgEnum,
  boolean,
  varchar,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { accommodations } from "./accommodations.js";
import { reviews } from "./reviews.js";

export const enumStatus = pgEnum("enumStatus", [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
]);

export const bookings = pgTable("bookings", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  accommodationId: uuid("accommodation_id")
    .notNull()
    .references(() => accommodations.id, { onDelete: "cascade" }),
  isGuest: boolean("is_guest").default(false).notNull(),
  checkIn: timestamp("check_in", { withTimezone: true }).notNull(),
  checkOut: timestamp("check_out", { withTimezone: true }).notNull(),
  nights: integer("nights").notNull(),
  guests: integer("guests").notNull().default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  isPaid: boolean("is_paid").default(false).notNull(),
  status: enumStatus("status").default("PENDING").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 30 }),
  message: text("message"),
  paymentIntentId: varchar("payment_intent_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  checkoutSessionId: text("checkout_session_id"),
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  accommodation: one(accommodations, {
    fields: [bookings.accommodationId],
    references: [accommodations.id],
  }),
  review: one(reviews, {
    fields: [bookings.id],
    references: [reviews.bookingId],
  }),
}));
