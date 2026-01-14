import {
  varchar,
  uuid,
  pgTable,
  text,
  pgEnum,
  date,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { bookings } from "./bookings.js";
import { reviews } from "./reviews.js";
import { favorites } from "./favorites.js";

export const lower = (email) => {
  return sql`lower(${email})`;
};

export const roleEnum = pgEnum("enumRole", ["ADMIN", "USER"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: text("email").notNull().unique(),
    pendingEmail: text("pending_email"),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    password: text("password").notNull(),
    passwordChangedAt: timestamp("password_changed_at"),
    role: roleEnum("role").notNull().default("USER"),
    lastActivityDate: date("last_activity_date").defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [uniqueIndex("emailUniqueIndex").on(lower(table.email))]
);

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  reviews: many(reviews),
  favorites: many(favorites),
}));
