import { sql } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { accommodations } from "@/database/schema";
import { Box, Button, Container, Flex, Title } from "@mantine/core";
import Link from "next/link";
import AccommodationsOverview from "@/features/admin/components/AccommodationsOverview";

const ACCS_PER_PAGE = 15;

const Page = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * ACCS_PER_PAGE;

  const accRows = await db
    .select()
    .from(accommodations)
    .orderBy(accommodations.createdAt, "desc")
    .limit(ACCS_PER_PAGE)
    .offset(offset)
    .execute();

  const totalAccs = await db
    .select({ count: sql`count(*)`.as("count") })
    .from(accommodations)
    .execute();

  const totalCount = Number(totalAccs?.[0]?.count ?? 0);
  const totalPages = Math.ceil(totalCount / ACCS_PER_PAGE);

  // console.log("totalAccs", totalAccs);

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
          data={accRows}
          totalPages={totalPages}
          currentPage={page}
        />
      </Box>
    </Container>
  );
};

export default Page;
