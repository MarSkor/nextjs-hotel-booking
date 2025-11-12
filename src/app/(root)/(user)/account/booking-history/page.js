import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import RecentBooking from "@/features/account/components/RecentBookings";
import { eq, desc, and, sql } from "drizzle-orm";
import { Box, Pagination, Title, Group } from "@mantine/core";
import { auth } from "../../../../../../auth";

const BookingHistoryPage = async ({ searchParams }) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const ITEMS_PER_PAGE = 10;
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const [{ count }] = await db
    .select({ count: sql`count(*)` })
    .from(bookings)
    .where(eq(bookings.userId, session?.user.id));

  const allBookings = await db.query.bookings.findMany({
    where: and(
      eq(bookings.userId, session?.user.id),
      eq(bookings.status, "confirmed")
    ),
    with: { accommodation: true },
    orderBy: [desc(bookings.createdAt)],
    limit: ITEMS_PER_PAGE,
    offset: offset,
  });

  const totalCount = Number(count ?? 0);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <Box component="section">
      <Box component="header" mb={"lg"}>
        <Title>Booking History</Title>
      </Box>
      <Box component="ul">
        {allBookings.map((booking, i) => (
          <RecentBooking key={booking.id} {...booking} />
        ))}
      </Box>
      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={handlePageChange}
            size="sm"
          />
        </Group>
      )}
    </Box>
  );
};

export default BookingHistoryPage;
