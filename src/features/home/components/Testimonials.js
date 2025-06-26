"use client";
import {
  Container,
  Paper,
  Flex,
  Avatar,
  rem,
  Rating,
  Box,
  Title,
  Text,
} from "@mantine/core";
import { mockData } from "./mockdata";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const TestimonialCard = ({ image, name, review, rating }) => (
  <Paper shadow="md" p="lg" radius="md" className="testimonial-card">
    <Flex className="testimonial-card__heading">
      <Avatar mr={"sm"} size={"lg"} src={image} />
      <Flex direction={"column"}>
        <Title order={5} mb={"4px"}>
          {name}
        </Title>
        <Rating
          defaultValue={0}
          fractions={2}
          size="sm"
          readOnly
          value={rating}
        />
      </Flex>
    </Flex>
    <Box className="testimonial-card__paragraph" mt={"md"}>
      <Text size="sm">{review}</Text>
    </Box>
  </Paper>
);

const Testimonials = () => {
  //fixing a "view more" option here?

  return (
    <Container
      component="section"
      size="xl"
      className="home-testimonials"
      mt="lg"
      mb="lg"
    >
      <Flex direction={"column"} justify={"center"} align={"center"} mb={40}>
        <Text size="sm">Testimonials</Text>
        <Title order={2}>Real Stories from Real Stays</Title>
      </Flex>
      <Container fluid>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          gutterBreakpoints={{ 350: "12px", 750: "16px", 900: "24px" }}
        >
          <Masonry>
            {mockData?.map((data) => (
              <TestimonialCard key={mockData.id} {...data} />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </Container>
    </Container>
  );
};

export default Testimonials;
