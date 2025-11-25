import { getAdminStats } from "@/actions/admin";
import { IconAppointment, IconHouse, IconUser } from "@/components/icons";
import { Container, Box, Grid, GridCol, Text } from "@mantine/core";
import StatsCard from "@/features/admin/components/StatsCard";

const AdminPage = async () => {
  const stats = await getAdminStats();
  // console.log("admin stats: ", stats);

  if (!stats) {
    return <Text>Error loading stats.</Text>;
  }

  const statsCardData = [
    {
      title: "Users",
      count: stats?.users ?? 0,
      subtext: stats?.users.newThisWeek ?? 0,
      icon: <IconUser height={20} width={20} />,
      href: "/admin/users",
      color: "lightblue",
    },
    {
      title: "Accommodations",
      count: stats?.accommodations ?? 0,
      subtext: stats?.accommodations.newThisWeek ?? 0,
      icon: <IconHouse height={20} width={20} />,
      href: "/admin/accommodations",
      color: "lightpink",
    },
    {
      title: "Bookings",
      count: stats?.bookings ?? 0,
      subtext: stats?.bookings.newThisWeek ?? 0,
      icon: <IconAppointment height={20} width={20} />,
      href: "/admin/bookings",
      color: "lightgreen",
    },
  ];

  return (
    <Container fluid>
      <Box mt={"lg"}>
        <Grid>
          {statsCardData.map((data) => (
            <GridCol key={data.title} span={{ base: 12, sm: 8, lg: 4 }}>
              <StatsCard {...data} />
            </GridCol>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPage;
