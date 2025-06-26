import { Paper, Flex, Title, Text, Avatar, Rating } from "@mantine/core";

const Review = () => {
  return (
    <Paper radius={"sm"} p={"sm"}>
      <Flex direction={"column"} mb={"sm"}>
        <Flex justify={"space-between"}>
          <Rating value={3.5} fractions={2} readOnly mb={"xs"} />
          <Text c={"dimmed"} size="xs">
            Published 12.12.12
          </Text>
        </Flex>
        <Flex align={"center"}>
          <Avatar src={null} alt="no image here" />
          <Title order={6} mr="sm">
            Placeholder Name
          </Title>
        </Flex>
      </Flex>
      <Flex direction={"column"}>
        <Title order={5} mb={"xs"}>
          Placeholder Title
        </Title>
        <Text size="sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde autem
          dicta culpa quos neque qui delectus eius cumque iste. Quae beatae
          harum ut obcaecati laboriosam adipisci? Esse earum dolorem aut.
        </Text>
      </Flex>
    </Paper>
  );
};

export default Review;
