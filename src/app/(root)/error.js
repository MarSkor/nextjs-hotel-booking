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
          Oops! Something went wrong
        </Title>
        <Text c="dimmed" size="lg" ta="center" mt={"lg"} mb={"lg"}>
          We ran into an unexpected error. Please try refreshing the page, or
          head back to the homepage.
        </Text>
        <Flex direction={"column"} justify="center">
          <Button component={Link} href={"/"} variant="light" size="sm">
            Take me back to home page
          </Button>
          <Button
            mt={"lg"}
            variant="subtle"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Refresh page
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Error;
