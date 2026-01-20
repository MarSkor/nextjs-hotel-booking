import {
  varchar,
  uuid,
  pgTable,
  text,
  timestamp,
  pgEnum,
  integer,
  boolean,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { bookings } from "./bookings.js";
import { reviews } from "./reviews.js";

export const enumPropertyType = pgEnum("enumPropertyType", [
  "guesthouse",
  "bed_and_breakfast",
  "hotel",
]);

export const accommodations = pgTable("accommodations", {
  slug: varchar("slug", { length: 255 })
    .notNull()
    .default("temp-slug")
    .unique(),
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  propertyType: enumPropertyType("property_type").notNull(),
  excerpt: varchar("excerpt", { length: 255 }).notNull(),
  bodyText: text("body_text").notNull(),
  pricePerNight: integer("price_per_night").notNull().default(1),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  guests: integer("guests").notNull().default(1),
  queenBeds: integer("queen_beds").default(0).notNull(),
  fullBeds: integer("full_beds").default(0).notNull(),
  twinBeds: integer("twin_beds").default(0).notNull(),
  amenities: varchar("amenities").array().notNull(),
  street: varchar("street", { length: 255 }).notNull(),
  buildingNumber: integer("building_number").notNull(),
  featuredImage: jsonb("featured_image").default(),
  images: jsonb("images").default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  isAvailable: boolean("is_available").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  averageRating: numeric("average_rating", { precision: 4, scale: 2 })
    .default("0.00")
    .notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
});

export const accommodationsRelations = relations(
  accommodations,
  ({ many }) => ({
    bookings: many(bookings),
    reviews: many(reviews),
  }),
);
