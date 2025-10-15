import { uuid, pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { accommodations } from "./accommodations.js";

export const reviews = pgTable("reviews", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accommodationId: uuid("accommodation_id")
    .notNull()
    .references(() => accommodations.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1–5
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
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
}));
