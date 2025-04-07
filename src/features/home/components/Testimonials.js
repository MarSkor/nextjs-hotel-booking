"use client";
import {
  Container,
  Paper,
  Flex,
  Avatar,
  rem,
  useMantineTheme,
  Rating,
  Group,
  Box,
  Title,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { mockData } from "./data";

const Card = (props) => {
  return (
    <Paper shadow="md" p="xl" radius="md" className="testimonial-card">
      <Flex className="testimonial-card__header">
        <Box className="testimonial-card__img-wrap">
          <Avatar mr="8" size="lg" src={props.image} alt={props.name} />
        </Box>
        <Box className="testimonial-card__heading">
          <Title order={5} className="testimonial-card__heading--title">
            {props.name}
          </Title>
          <Box className="testimonial-card__heading--rating">
            <Rating
              defaultValue={0}
              fractions={2}
              size="sm"
              readOnly
              value={4.5}
            />
          </Box>
        </Box>
      </Flex>
      <Text size="sm">{props.text}</Text>
    </Paper>
  );
};

const Testimonials = () => {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = mockData.map((item) => (
    <CarouselSlide key={item.title}>
      <Card {...item} />
    </CarouselSlide>
  ));

  return (
    <section className="testimonials__wrapper">
      <Container className="container testimonials__carousel">
        <Group mb={40} justify="center">
          <Title order={2}>Testimonials</Title>
        </Group>
        <Carousel
          controlSize={24}
          withIndicators
          loop
          slideSize={{ base: "100%", sm: "50%", md: "33.333333%" }}
          slideGap={{ base: "sm", sm: "xl" }}
          align="start"
          slidesToScroll={mobile ? 1 : 3}
          classNames={{
            indicator: "carousel__indicator",
            indicators: "carousel__indicators",
            controls: "carousel__controls",
            control: "carousel__control",
          }}
        >
          {slides}
        </Carousel>
      </Container>
    </section>
  );
};

export default Testimonials;
