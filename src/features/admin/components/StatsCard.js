import { IconArrowDownRight, IconArrowUpRight } from "@/components/icons";
import { Text, Title, Group, Box, Paper, Progress, Flex } from "@mantine/core";

const StatsCard = (data) => {
  const diff = parseFloat(data.count.growth);
  const isPositive = diff >= 0;
  const DiffIcon = isPositive ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Paper shadow="xs" withBorder p="md" radius="md" h="100%">
      <Flex direction="column" h="100%">
        <Group justify="space-between">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">
            {data.title}
          </Text>
          <Box
            p="6px"
            style={{
              backgroundColor: data.color,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {data.icon}
          </Box>
        </Group>

        <Group align="flex-end" gap="xs" mt={16}>
          <Title order={2} fw={700} style={{ lineHeight: 1 }}>
            {data.count.total}
          </Title>

          {data.count.growth !== undefined && (
            <Text
              c={isPositive ? "teal" : "red"}
              fz="sm"
              fw={500}
              style={{ display: "flex", alignItems: "center", gap: "2px" }}
            >
              <span>{Math.abs(diff)}%</span>
              <DiffIcon height={16} width={16} color="teal" stroke={1.5} />
            </Text>
          )}
        </Group>

        {data.count.progress !== undefined && (
          <Progress
            value={data.count.progress}
            size="sm"
            mt="md"
            radius="xl"
            color="blue"
          />
        )}

        {/* Subtext: Pushed to the bottom to keep cards equal height */}
        <Text fz="xs" c="dimmed" mt="auto" pt={7}>
          {data.count.subtext}
        </Text>
      </Flex>
    </Paper>
    // <Paper shadow="xs" withBorder p="md" radius="md" h="100%">
    //   <Group justify="space-between" mb="xs">
    //     <Text size="xs" c="dimmed" fw={700} tt="uppercase">
    //       {data.title}
    //     </Text>
    //     <Box
    //       p="6px"
    //       style={{
    //         backgroundColor: data.color,
    //         borderRadius: "8px",
    //         display: "flex",
    //         alignItems: "center",
    //       }}
    //     >
    //       {data.icon}
    //     </Box>
    //   </Group>

    //   <Flex align="flex-end" gap="xs">
    //     <Title fw={700} order={2}>
    //       {data.value}
    //     </Title>

    //     {/* Show Growth Badge if growth property exists */}
    //     {data.growth !== undefined && (
    //       <Badge
    //         variant="light"
    //         color={isPositive ? "teal" : "red"}
    //         size="sm"
    //         leftSection={
    //           isPositive ? (
    //             <IconArrowUpRight size={12} />
    //           ) : (
    //             <IconArrowDownRight size={12} />
    //           )
    //         }
    //       >
    //         {Math.abs(data.growth)}%
    //       </Badge>
    //     )}
    //   </Flex>

    //   {/* Show Progress Bar if progress property exists (e.g., Occupancy) */}
    //   {data.progress !== undefined && (
    //     <Box mt="sm">
    //       <Progress value={data.progress} size="sm" radius="xl" color="blue" />
    //     </Box>
    //   )}

    //   <Text size="xs" c="dimmed" mt={data.progress !== undefined ? "xs" : "sm"}>
    //     {data.description}
    //   </Text>
    // </Paper>
    // <Paper
    //   shadow="xs"
    //   withBorder
    //   p="md"
    //   component="a"
    //   href={data.href}
    //   style={{ textDecoration: "none", color: "inherit" }}
    // >
    //   <Group justify="space-between" mb="xs">
    //     <Text size="sm" c="dimmed" fw={700} tt="uppercase">
    //       {data.title}
    //     </Text>
    //     <Box
    //       p="6px"
    //       style={{ backgroundColor: data.color, borderRadius: "8px" }}
    //     >
    //       {data.icon}
    //     </Box>
    //   </Group>

    //   <Title order={2} mt="md">
    //     {data.count.total}
    //   </Title>
    //   <Text size="xs" c="dimmed" mt={4}>
    //     {data.count.subtext}
    //   </Text>
    // </Paper>
  );
};

export default StatsCard;
