import { db } from "@/database/drizzle";
import { sql, desc } from "drizzle-orm";
import { contactMessages } from "@/database/schema";
import { Box, Container, Flex, Title } from "@mantine/core";
import { PER_PAGE_LIST } from "@/utils/constants";
import MessagesOverview from "@/features/admin/components/MessagesOverview";

const MessagesPage = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * PER_PAGE_LIST;

  const [{ count }] = await db
    .select({ count: sql`count(*)` })
    .from(contactMessages);

  const allMessages = await db.query.contactMessages.findMany({
    limit: PER_PAGE_LIST,
    offset,
    orderBy: [desc(contactMessages.createdAt)],
  });

  const totalCount = Number(count ?? 0);
  const totalPages = Math.ceil(totalCount / PER_PAGE_LIST);

  return (
    <Container size="xl" component="section" pb={"88px"}>
      <Flex
        direction={"column"}
        wrap="wrap"
        justify={"space-between"}
        mt={"sm"}
      >
        <Title mb={"xs"} order={2}>
          All Messages
        </Title>
      </Flex>
      <Box mt={"lg"}>
        <MessagesOverview
          data={allMessages}
          totalPages={totalPages}
          currentPage={page}
        />
      </Box>
    </Container>
  );
};

export default MessagesPage;
