import { Text, Box, Flex, Container } from "@mantine/core";

export default async function ConfirmSignup({ searchParams }) {
  const confirmParams = await searchParams;
  console.log("searchParams :", confirmParams);

  return (
    <section>
      <Container className="container">
        <Flex justify="center" align="center">
          <Box>
            <Text>{confirmParams.message}</Text>
          </Box>
        </Flex>
      </Container>
    </section>
  );
}
