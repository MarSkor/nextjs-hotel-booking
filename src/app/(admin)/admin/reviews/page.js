import { db } from "@/database/drizzle";
import { sql, desc } from "drizzle-orm";
import { reviews } from "@/database/schema";
import { Box, Container, Flex, Title } from "@mantine/core";
import { PER_PAGE_LIST } from "@/utils/constants";
import ReviewOverview from "@/features/admin/components/ReviewOverview";

const ReviewsPage = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * PER_PAGE_LIST;

  const [{ count }] = await db.select({ count: sql`count(*)` }).from(reviews);

  const allReviews = await db.query.reviews.findMany({
    with: {
      accommodation: true,
      user: true,
      reply: true,
    },
    limit: PER_PAGE_LIST,
    offset,
    orderBy: [desc(reviews.createdAt)],
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
          All Reviews
        </Title>
      </Flex>
      <Box mt={"lg"}>
        <ReviewOverview
          reviews={allReviews}
          totalPages={totalPages}
          currentPage={page}
        />
      </Box>
    </Container>
  );
};

export default ReviewsPage;
