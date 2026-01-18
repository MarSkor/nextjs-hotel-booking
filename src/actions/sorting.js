import { db } from "@/database/drizzle";
import { accommodations, bookings, reviews } from "@/database/schema";
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gt,
  lt,
  notExists,
  sql,
} from "drizzle-orm";

const ITEMS_PER_PAGE = 6;

const getAccommodations = async ({
  type = "all",
  guests = "all",
  sort = "price_asc",
  page = 1,
  checkIn,
  checkOut,
}) => {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const filterArray = [];
  const [sortBy, sortOrder] = sort.split("_");
  let orderBy;

  if (checkIn && checkOut) {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    filterArray.push(
      notExists(
        db
          .select()
          .from(bookings)
          .where(
            and(
              eq(bookings.status, "CONFIRMED"),
              eq(bookings.accommodationId, accommodations.id),
              lt(bookings.checkIn, endDate),
              gt(bookings.checkOut, startDate),
            ),
          ),
      ),
    );
  }

  if (type !== "all") {
    filterArray.push(eq(accommodations.propertyType, type));
  }

  switch (sortBy) {
    case "price":
      orderBy =
        sortOrder === "asc"
          ? asc(accommodations.pricePerNight)
          : desc(accommodations.pricePerNight);
      break;
    case "type":
      orderBy =
        sortOrder === "asc"
          ? asc(accommodations.propertyType)
          : desc(accommodations.propertyType);
      break;
    case "guests":
      orderBy =
        sortOrder === "asc"
          ? sql`${accommodations.guests} ASC`
          : sql`${accommodations.guests} DESC`;
      break;
    default:
      orderBy = asc(accommodations.pricePerNight);
  }

  // leaving this as a if statement since 5 is the current max amount of guests pr. booking.
  if (guests !== "all") {
    if (guests === "1-2") {
      filterArray.push(sql`${accommodations.guests} <= 2`);
    } else if (guests === "3-4") {
      filterArray.push(sql`${accommodations.guests} BETWEEN 3 AND 4`);
    } else if (guests === "5") {
      filterArray.push(sql`${accommodations.guests} >= 5`);
    }
  }

  const whereClause = filterArray.length ? and(...filterArray) : undefined;

  const [countResult, accList] = await Promise.all([
    db
      .select({ count: sql`count(*)` })
      .from(accommodations)
      .where(whereClause),

    db
      .select({
        ...getTableColumns(accommodations),
        reviewCount: sql`count(${reviews.id})`.mapWith(Number),
        averageRating: sql`avg(${reviews.rating})`.mapWith(Number),
      })
      .from(accommodations)
      .leftJoin(
        reviews,
        and(
          eq(reviews.accommodationId, accommodations.id),
          eq(reviews.status, "APPROVED"),
        ),
      )
      .where(whereClause)
      .groupBy(accommodations.id)
      .orderBy(orderBy)
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
  ]);

  const totalCount = Number(countResult[0].count);

  return {
    accList,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    totalCount,
  };
};

export default getAccommodations;
