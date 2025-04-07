import React from "react";
import { Container, Flex, Box, Text } from "@mantine/core";

const StatItem = (props) => {
  return (
    <Box className="stats__item">
      <Flex
        className="stats__item--wrapper"
        gap="md"
        justify="center"
        direction={{ base: "column", sm: "row" }}
        align="center"
        wrap="wrap"
      >
        <span className="stats__item--number">{props.number}</span>
        <Text className="stats__item--description">{props.text}</Text>
      </Flex>
    </Box>
  );
};

const Stats = () => {
  return (
    <section className="container-color_stats stats">
      <Container fluid>
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={{ base: "sm", sm: "lg", md: 96 }}
          justify={{ sm: "center" }}
        >
          <StatItem number="10" text="Years of trusted service" />
          <StatItem number="95%" text="Customer Satisfaction Rate" />
          <StatItem number="4.9" text="Customer rating on Google reviews" />
        </Flex>
      </Container>
    </section>
  );
};

export default Stats;
