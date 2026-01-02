import { Container, Flex, Loader, Text } from "@mantine/core";

const Loading = () => {
  return (
    <Container size="sm">
      <Flex
        h="80vh"
        align="center"
        justify="center"
        direction="column"
        gap="sm"
      >
        <Loader />
      </Flex>
    </Container>
  );
};

export default Loading;
