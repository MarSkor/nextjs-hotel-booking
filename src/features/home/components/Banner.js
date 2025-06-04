import { Container, Flex, Text, Title } from "@mantine/core";

const Banner = () => {
  return (
    <Container
      component="section"
      fluid
      className="home-banner"
      mt="lg"
      mb="lg"
    >
      <Container size="xl">
        <Flex
          className="home-banner__inner"
          direction={{ base: "column", sm: "row" }}
          gap={{ base: "sm", sm: "lg" }}
          justify={{ sm: "space-between" }}
          align={{ base: "center" }}
        >
          <Title order={2} className="home-banner__inner--title">
            Book with confidence
          </Title>
          <hr className="home-banner__inner--line" />
          <Text className="home-banner__inner--paragraph">
            Our platform offers a vast array of accommodations, ensuring that
            every traveler finds a perfect match for their needs and
            preferences.
          </Text>
        </Flex>
      </Container>
    </Container>
  );
};

export default Banner;
