import {
  AppShellHeader,
  Burger,
  Group,
  Box,
  Title,
  Text,
  Flex,
  Container,
} from "@mantine/core";

const Header = ({ opened, onClick, session }) => {
  return (
    <AppShellHeader>
      <Group h="100%" px="md">
        <Burger opened={opened} onClick={onClick} hiddenFrom="sm" size="sm" />

        <Flex
          align={{ base: "flex-start", sm: "center" }}
          direction={{ base: "column", sm: "row" }}
        >
          <Box>
            <Title order={2} size="h3">
              {session?.user?.name}
            </Title>
            <Text size="sm" c="dimmed">
              All accommodations and users.
            </Text>
          </Box>
        </Flex>
      </Group>
      {/* <Container>
        <Box>search</Box>
      </Container> */}
    </AppShellHeader>
  );
};

export default Header;
