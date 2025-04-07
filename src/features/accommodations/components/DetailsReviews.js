import {
  Container,
  Box,
  Flex,
  Group,
  Rating,
  Title,
  Avatar,
  Text,
} from "@mantine/core";

const DetailsReviews = () => {
  return (
    <Box
      className="ac-details__reviews"
      mt={40}
      id="reviews"
      w={{ base: "100%", sm: "800px" }}
    >
      <Flex direction="column" className="ac-details__reviews--top">
        <Title order={2} mb="md">
          Reviews
        </Title>
        <Box className="ac-details__review-card">
          <Flex direction="column">
            <Flex direction="column">
              <Flex direction="row" align="center" mb="xs">
                <Avatar name={"John Doe"} color="initials" mr="sm" />
                <Title order={4}>John Doe</Title>
              </Flex>
              <Flex align="center">
                <Rating value={3.5} fractions={2} readOnly />
                <Text size="xs" c="dimmed" ml="sm">
                  12/12/24
                </Text>
              </Flex>
            </Flex>
            <Box mt="sm">
              <Title order={5} mb="xs">
                Some title here
              </Title>
              <Text size="sm">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Explicabo architecto officia nemo enim corporis porro aliquam
                iure sit ut asperiores ratione blanditiis veritatis deserunt
                deleniti, nulla doloribus dolor repudiandae? Nam.
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default DetailsReviews;
