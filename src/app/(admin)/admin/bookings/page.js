import { db } from "@/database/drizzle";
import { sql, desc } from "drizzle-orm";
import { bookings } from "@/database/schema";
import { Box, Container, Flex, Title } from "@mantine/core";
import BookingsOverview from "@/features/admin/components/BookingsOverview";
import { PER_PAGE_LIST } from "@/utils/constants";

const BookingsPage = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * PER_PAGE_LIST;

  const [{ count }] = await db.select({ count: sql`count(*)` }).from(bookings);

  const allBookings = await db.query.bookings.findMany({
    with: {
      accommodation: true,
      user: true,
    },
    limit: PER_PAGE_LIST,
    offset,
    orderBy: [desc(bookings.createdAt)],
  });

  const totalCount = Number(count ?? 0);
  const totalPages = Math.ceil(totalCount / PER_PAGE_LIST);

  return (
    <Container size="xl" component="section" pb={"88px"}>
      <Flex
        direction={"column"}
        wrap="wrap"
        align={""}
        justify={"space-between"}
        mt={"sm"}
      >
        <Title mb={"xs"} order={2}>
          All Bookings
        </Title>
      </Flex>
      <Box mt={"lg"}>
        <BookingsOverview
          bookings={allBookings}
          totalPages={totalPages}
          currentPage={page}
        />
      </Box>
    </Container>
  );
};

export default BookingsPage;
