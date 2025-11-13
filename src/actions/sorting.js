import { db } from "@/database/drizzle";
import { accommodations } from "@/database/schema";
import { asc, desc, eq, sql } from "drizzle-orm";

const ITEMS_PER_PAGE = 6;

const getAccommodations = async ({
  type = "all",
  guests = "all",
  sort = "price_asc",
  page = 1,
}) => {
  const offset = (page - 1) * ITEMS_PER_PAGE;

  let orderBy;
  const [sortBy, sortOrder] = sort.split("_");

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

  const filterArray = [];
  if (type !== "all") {
    filterArray.push(eq(accommodations.propertyType, type));
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

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(accommodations)
    .where(filterArray.length ? sql.join(filterArray, sql` AND `) : undefined);

  const totalCount = Number(countResult[0].count);

  const accList = await db
    .select()
    .from(accommodations)
    .where(filterArray.length ? sql.join(filterArray, sql` AND `) : undefined)
    .orderBy(orderBy)
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  return {
    accList,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    totalCount,
  };
};

export default getAccommodations;
