import { Flex, Title, Text } from "@mantine/core";

const Banner = () => {
  return (
    <section className="banner">
      <Flex
        className="container banner__inner"
        direction={{ base: "column", sm: "row" }}
        gap={{ base: "sm", sm: "lg" }}
        justify={{ sm: "space-between" }}
        align={{ base: "center" }}
      >
        <Title order={2} size="h1" className="banner__inner--title">
          Book with confidence
        </Title>
        <hr className="banner__line" />
        <Text className="banner__paragraph">
          Our platform offers a vast array of accommodations, ensuring that
          every traveler finds a perfect match for their needs and preferences.
        </Text>
      </Flex>
    </section>
  );
};

export default Banner;
