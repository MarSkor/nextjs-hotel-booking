import { Container, Flex, Title, Text, Button } from "@mantine/core";
import Link from "next/link";

const NotFound = () => {
  return (
    <main>
      <Container
        component="section"
        size="sm"
        className="accommodations-container"
        h={"100svh"}
      >
        <Flex
          justify={"center"}
          direction={"column"}
          align={"center"}
          h={"100%"}
        >
          <Title order={2} size={"h1"} mb={"md"}>
            404
          </Title>
          <Title order={1}>Oops! We couldn’t find that page.</Title>
          <Text c="dimmed" size="lg" ta="center" mt={"lg"} mb={"lg"}>
            Looks like the link is broken or the page moved.
          </Text>
          <Flex justify="center" direction={"column"}>
            <Button component={Link} href="/" variant="light" size="md">
              Go back home
            </Button>
          </Flex>
        </Flex>
      </Container>
    </main>
  );
};

export default NotFound;
