import { sql, desc } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { accommodations } from "@/database/schema";
import { Box, Button, Container, Flex, Title } from "@mantine/core";
import Link from "next/link";
import AccommodationsOverview from "@/features/admin/components/AccommodationsOverview";
import { PER_PAGE_LIST } from "@/utils/constants";

const Page = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * PER_PAGE_LIST;

  const [{ count }] = await db
    .select({ count: sql`count(*)` })
    .from(accommodations);

  const allAccommodations = await db.query.accommodations.findMany({
    limit: PER_PAGE_LIST,
    offset,
    orderBy: [desc(accommodations.createdAt)],
  });

  const totalCount = Number(count ?? 0);
  const totalPages = Math.ceil(totalCount / PER_PAGE_LIST);

  return (
    <Container size={"xl"} component="section" pb={"88px"}>
      <Flex
        direction={"column"}
        wrap="wrap"
        align={""}
        justify={"space-between"}
        mt={"sm"}
      >
        <Title mb={"xs"} order={2}>
          All Accommodations
        </Title>
        <Button
          style={{ width: "max-content" }}
          component={Link}
          href={"/admin/accommodations/new"}
        >
          + New accommodation
        </Button>
      </Flex>
      <Box mt={"lg"}>
        <AccommodationsOverview
          data={allAccommodations}
          totalPages={totalPages}
          currentPage={page}
        />
      </Box>
    </Container>
  );
};

export default Page;
