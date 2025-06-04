import { Container, Flex, Title, Text } from "@mantine/core";

const StatsItem = ({ number, text }) => (
  <Flex
    className="home-stats__item--wrapper"
    gap="md"
    justify="center"
    direction={{ base: "column", sm: "row" }}
    align="center"
    wrap="wrap"
  >
    <Title order={5} size={"h1"} className="home-stats__item--number">
      {number}
    </Title>
    <Text className="home-stats__item--description">{text}</Text>
  </Flex>
);

const Stats = () => {
  return (
    <Container component="section" fluid className="home-stats" mt="lg" mb="lg">
      <Container size="xl" className="home-stats__inner">
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={{ base: "sm", sm: "lg", md: 96 }}
          justify={{ sm: "center" }}
        >
          <StatsItem number="10" text="Years of trusted service" />
          <StatsItem number="95%" text="Customer Satisfaction Rate" />
          <StatsItem number="4.9" text="Customer rating on Google reviews" />
        </Flex>
      </Container>
    </Container>
  );
};

export default Stats;
