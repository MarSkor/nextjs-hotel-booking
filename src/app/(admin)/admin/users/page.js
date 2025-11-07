import { db } from "@/database/drizzle";
import { sql, desc } from "drizzle-orm";
import { users } from "@/database/schema";
import { Box, Text, Container, Flex, Title } from "@mantine/core";
import UsersOverview from "@/features/admin/components/UsersOverview";

const USERS_PER_PAGE = 15;

const Page = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * USERS_PER_PAGE;

  const [{ count }] = await db.select({ count: sql`count(*)` }).from(users);

  const allAccommodations = await db.query.users.findMany({
    limit: USERS_PER_PAGE,
    offset,
    orderBy: [desc(users.createdAt)],
  });

  const totalCount = Number(count ?? 0);
  const totalPages = Math.ceil(totalCount / USERS_PER_PAGE);

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
          All Users
        </Title>
        <Text size="sm" c="dimmed"></Text>
      </Flex>
      <Box mt={"lg"}>
        <UsersOverview
          users={allAccommodations}
          totalPages={totalPages}
          currentPage={page}
        />
      </Box>
    </Container>
  );
};

export default Page;
