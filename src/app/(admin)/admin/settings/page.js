import { Container, Flex, Text, Title } from "@mantine/core";

const SettingsPage = () => {
  return (
    <Container size="xl" component="section" pb={"88px"}>
      <Flex
        direction={"column"}
        wrap="wrap"
        justify={"space-between"}
        mt={"sm"}
      >
        <Title mb={"xs"} order={2}>
          Settings
        </Title>
        <Text>⏳ Thinking of what to fill this page with.</Text>
      </Flex>
    </Container>
  );
};

export default SettingsPage;
