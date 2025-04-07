import { Container, Flex, Box } from "@mantine/core";
import { AccountNavbar } from "@/features/account/components";

export default async function ProtectedLayout({ children }) {
  return (
    <section className="accountLayout">
      <Container size="md" className="p-0 accountLayout__container">
        <Flex
          direction={{ base: "column", xs: "row" }}
          className="accountLayout__inner-wrap"
        >
          <Box className="accountLayout__accountNav">
            <AccountNavbar />
          </Box>
          <Container fluid className="accountLayout__content">
            {children}
          </Container>
        </Flex>
      </Container>
    </section>
  );
}
