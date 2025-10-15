import { Box, Button, Container, Flex, Title, Text } from "@mantine/core";
import Link from "next/link";

const Page = () => {
  return (
    <Container fluid component="section" className="">
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
        <Text>table</Text>
      </Box>
    </Container>
  );
};

export default Page;
