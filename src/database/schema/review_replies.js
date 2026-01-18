import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { reviews } from "./reviews.js";
import { accommodations } from "./accommodations.js";

export const reviewReplies = pgTable("review_replies", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  reviewId: uuid("review_id")
    .notNull()
    .references(() => reviews.id, { onDelete: "cascade" })
    .unique(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reply: text("reply"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const reviewsRepliesRelations = relations(reviewReplies, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewReplies.reviewId],
    references: [reviews.id],
  }),
  owner: one(users, {
    fields: [reviewReplies.ownerId],
    references: [users.id],
  }),
}));
