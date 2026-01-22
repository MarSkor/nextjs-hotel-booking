import {
  uuid,
  pgTable,
  text,
  timestamp,
  pgEnum,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { accommodations } from "./accommodations.js";
import { bookings } from "./bookings.js";
import { reviewReplies } from "./review_replies.js";

export const reviewStatusEnum = pgEnum("review_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const reviews = pgTable("reviews", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  accommodationId: uuid("accommodation_id")
    .notNull()
    .references(() => accommodations.id, { onDelete: "cascade" }),
  bookingId: uuid("booking_id")
    .references(() => bookings.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  title: text("title"),
  comment: varchar("comment", { length: 1000 }),
  status: reviewStatusEnum("status").default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  accommodation: one(accommodations, {
    fields: [reviews.accommodationId],
    references: [accommodations.id],
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  reply: one(reviewReplies, {
    fields: [reviews.id],
    references: [reviewReplies.reviewId],
  }),
}));
