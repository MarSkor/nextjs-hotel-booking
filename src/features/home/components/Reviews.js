import dayjs from "dayjs";
import {
  Box,
  Container,
  Flex,
  Paper,
  Rating,
  Stack,
  Text,
  Title,
} from "@mantine/core";

const ReviewCard = (review) => {
  const displayName = review.user?.fullName || "Anonymous Guest";

  return (
    <Paper withBorder p="md" radius="md" mb="md">
      <Stack gap="xs">
        <Rating value={parseFloat(review.rating)} readOnly size="sm" />
        <Box>
          <Text fw={700} size="sm" lineClamp={1}>
            {review.title}
          </Text>
          <Text size="xs" c="dimmed">
            Stayed at: {review.accommodation?.title}
          </Text>
        </Box>

        <Text size="md" c="gray.7">
          {review.comment}
        </Text>

        <Box mt="xs">
          <Text size="xs" fw={600}>
            {displayName}
          </Text>
          <Text size="xs" c="dimmed">
            {dayjs(review.createdAt).format("MMM YYYY")}
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
};

const Reviews = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Container component="section" size="lg" mt="xl" mb="82px">
        <Box align="center" mb="xl">
          <Text size="sm">Recent Reviews</Text>
          <Title order={2} ta={"center"}>
            What Our Guests Say
          </Title>
          <Text mt={"xs"} c="gray.7" fw={500}>
            No reviews to display.
          </Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      component="section"
      size={"xl"}
      className="home-reviews"
      mt="lg"
      mb="lg"
      pl={0}
      pr={0}
    >
      <Box py="xl" px="md">
        <Box align="center" mb="xl">
          <Text size="sm">Recent Reviews</Text>
          <Title order={2} ta={"center"}>
            What Our Guests Say
          </Title>
        </Box>

        <Box component="section" py="xl">
          <Flex gap="md" justify="center" wrap="wrap">
            {data.map((review) => (
              <Box
                key={review.id}
                w={{
                  base: "100%",
                  sm: "calc(50% - 16px)",
                  lg: "calc(33.333% - 16px)",
                }}
              >
                <ReviewCard {...review} />
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
    </Container>
  );
};

export default Reviews;
