import {
  Paper,
  Flex,
  Title,
  Text,
  Avatar,
  Rating,
  Box,
  SimpleGrid,
  Container,
} from "@mantine/core";

const Review = () => {
  return (
    <Container
      component="section"
      size="lg"
      className="accommodations-details-container"
      mt="xl"
      mb="xl"
    >
      <Box id="details__reviews">
        <Title order={2} mb="lg">
          Reviews
        </Title>
        <SimpleGrid
          spacing={{ base: 10, sm: "lg" }}
          verticalSpacing={{ base: "lg", sm: "lg" }}
          cols={{ base: 1, sm: 2, md: 3 }}
        >
          <Paper radius={"sm"} p={"md"}>
            <Flex direction={"column"} mb={"sm"}>
              <Flex justify={"space-between"}>
                <Rating value={3.5} fractions={2} readOnly mb={"xs"} />
                <Text c={"dimmed"} size="xs">
                  Published 12.12.12
                </Text>
              </Flex>
              <Flex align={"center"}>
                <Avatar src={null} alt="no image here" />
                <Title order={6} ml="sm">
                  Placeholder Name
                </Title>
              </Flex>
            </Flex>
            <Flex direction={"column"}>
              <Title order={5} mb={"xs"}>
                Placeholder Title
              </Title>
              <Text size="sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
                autem dicta culpa quos neque qui delectus eius cumque iste. Quae
                beatae harum ut obcaecati laboriosam adipisci? Esse earum
                dolorem aut.
              </Text>
            </Flex>
          </Paper>
          <Paper radius={"sm"} p={"md"}>
            <Flex direction={"column"} mb={"sm"}>
              <Flex justify={"space-between"}>
                <Rating value={3.5} fractions={2} readOnly mb={"xs"} />
                <Text c={"dimmed"} size="xs">
                  Published 12.12.12
                </Text>
              </Flex>
              <Flex align={"center"}>
                <Avatar src={null} alt="no image here" />
                <Title order={6} ml="sm">
                  Placeholder Name
                </Title>
              </Flex>
            </Flex>
            <Flex direction={"column"}>
              <Title order={5} mb={"xs"}>
                Placeholder Title
              </Title>
              <Text size="sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
                autem dicta culpa quos neque qui delectus eius cumque iste. Quae
                beatae harum ut obcaecati laboriosam adipisci? Esse earum
                dolorem aut.
              </Text>
            </Flex>
          </Paper>
          <Paper radius={"sm"} p={"md"}>
            <Flex direction={"column"} mb={"sm"}>
              <Flex justify={"space-between"}>
                <Rating value={3.5} fractions={2} readOnly mb={"xs"} />
                <Text c={"dimmed"} size="xs">
                  Published 12.12.12
                </Text>
              </Flex>
              <Flex align={"center"}>
                <Avatar src={null} alt="no image here" />
                <Title order={6} ml="sm">
                  Placeholder Name
                </Title>
              </Flex>
            </Flex>
            <Flex direction={"column"}>
              <Title order={5} mb={"xs"}>
                Placeholder Title
              </Title>
              <Text size="sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
                autem dicta culpa quos neque qui delectus eius cumque iste. Quae
                beatae harum ut obcaecati laboriosam adipisci? Esse earum
                dolorem aut.
              </Text>
            </Flex>
          </Paper>
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default Review;
