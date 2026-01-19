import { getAdminStats } from "@/actions/admin";
import {
  IconAlert,
  IconReceipt,
  IconSingleBed,
  IconUser,
} from "@/components/icons";
import { Container, Box, Grid, GridCol, Text } from "@mantine/core";
import StatsCard from "@/features/admin/components/StatsCard";

const AdminPage = async () => {
  const stats = await getAdminStats();

  if (!stats) {
    return (
      <Container fluid>
        <Text>Error loading stats.</Text>
      </Container>
    );
  }

  const statsCardData = [
    {
      title: "Revenue (MTD)",
      count: {
        total: `$${stats.revenue.total.toLocaleString()}`,
        subtext: "Compared to previous month.",
        growth: stats.revenue.growth,
      },
      icon: <IconReceipt height={20} width={20} />,
      color: "var(--mantine-color-green-1)",
      href: "/admin/bookings",
    },
    {
      title: "Occupancy Rate",
      count: {
        total: `${stats.occupancy}%`,
        subtext: "Capacity usage",
        progress: parseFloat(stats.occupancy),
      },
      icon: <IconSingleBed height={20} width={20} />,
      color: "var(--mantine-color-blue-1)",
      href: "/admin/accommodations",
    },
    {
      title: "Pending Actions",
      count: {
        total: stats.pendingActions,
        subtext: "New messages & requests",
      },
      icon: <IconAlert height={20} width={20} />,
      color:
        stats.pendingActions > 0
          ? "var(--mantine-color-red-1)"
          : "var(--mantine-color-gray-1)",
      href: "/admin/messages",
    },
    {
      title: "Active Guests",
      count: {
        total: stats.activeInHouse,
        subtext: "Currently in-house",
      },
      icon: <IconUser height={20} width={20} />,
      color: "var(--mantine-color-teal-1)",
      href: "/admin/bookings",
    },
  ];

  return (
    <Container fluid>
      <Box mt={"lg"}>
        <Grid>
          {statsCardData.map((data) => (
            <GridCol key={data.title} span={{ base: 12, sm: 8, lg: 3 }}>
              <StatsCard {...data} />
            </GridCol>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPage;
