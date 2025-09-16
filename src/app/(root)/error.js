"use client";
import { Container, Title, Text, Group, Button, Flex } from "@mantine/core";
import Link from "next/link";

const Error = () => {
  return (
    <Container
      component="section"
      size="sm"
      className="error-container"
      mt="xl"
      mb="xl"
    >
      <Flex
        direction={"column"}
        justify={"center"}
        align={"center"}
        mt={"100px"}
        mb={"100px"}
      >
        <Title ta={"center"} order={1}>
          Oops, something went wrong!
        </Title>
        <Text c="dimmed" size="lg" ta="center" mt={"lg"} mb={"lg"}>
          Unfortunately, this is only a 404 page. You may have mistyped the
          address, or the page has been moved to another URL.
        </Text>
        <Group justify="center">
          <Button component={Link} href={"/"} variant="subtle" size="md">
            Take me back to home page
          </Button>
        </Group>
      </Flex>
    </Container>
  );
};

export default Error;
