import { Text, Title, Flex, Group, Box, Paper } from "@mantine/core";

const StatsCard = (data) => {
  return (
    <Paper shadow="xs" withBorder p="md">
      <Group justify="space-between">
        <Text size="md" c={"dimmed"} fw={500}>
          Total {data.title}
        </Text>
        <Box
          p={"6px"}
          style={{ backgroundColor: data.color, borderRadius: "100px" }}
        >
          {data.icon}
        </Box>
      </Group>
      <Flex direction={"column"}>
        <Title fw={700} order={1} mb={"xs"}>
          {data.count.total}
        </Title>
        <Text size="sm" c={"dimmed"}>
          New this week {data.count.newThisWeek}
        </Text>
      </Flex>
    </Paper>
  );
};

export default StatsCard;
