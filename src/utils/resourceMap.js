import { accommodations, bookings, reviews, users } from "@/database/schema";

export const RESOURCE_MAP = {
  accommodations: {
    table: accommodations,
    path: "/admin/accommodations",
    label: "Accommodation",
    hasFiles: true,
  },
  bookings: {
    table: bookings,
    path: "/admin/bookings",
    label: "Booking",
    hasFiles: false,
  },
  reviews: {
    table: reviews,
    path: "/admin/reviews",
    label: "Review",
    hasFiles: false,
  },
  users: {
    table: users,
    path: "/admin/users",
    label: "User",
    hasFiles: false,
  },
};
