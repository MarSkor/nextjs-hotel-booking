import { Container, Flex, Title, Text, Button } from "@mantine/core";
import Link from "next/link";

const TooFastPage = () => {
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
          <Title order={1}>Whoa there, slow down!</Title>
          <Text c="dimmed" size="lg" ta="center" mt={"lg"} mb={"lg"}>
            You’ve made too many requests in a short period of time. To keep
            things running smoothly, we’ve temporarily limited your access.
          </Text>
          <Flex justify="center" direction={"column"}>
            <Text c="dimmed" size="lg" ta="center" mb={"lg"}>
              Try again in a few minutes.
            </Text>
            <Button component={Link} href="/" variant="light" size="md">
              Take me back to home page
            </Button>
          </Flex>
        </Flex>
      </Container>
    </main>
  );
};

export default TooFastPage;
