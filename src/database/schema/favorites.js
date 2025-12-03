import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { accommodations } from "./accommodations.js";
import { relations } from "drizzle-orm";

export const favorites = pgTable("favorites", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  accommodationId: uuid("accommodation_id")
    .notNull()
    .references(() => accommodations.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  accommodation: one(accommodations, {
    fields: [favorites.accommodationId],
    references: [accommodations.id],
  }),
}));
