import RecentBooking from "@/features/account/components/RecentBookings";
import { auth } from "../../../../../../auth";
import { redirect } from "next/navigation";
import { fetchAllBookings, getBookingHistoryPages } from "@/actions/user";
import DataPagination from "@/components/ui/Pagination";
import { Box, Title, Text, Grid, GridCol } from "@mantine/core";
import { BOOKINGS_PER_PAGE } from "@/utils/constants";

const BookingHistoryPage = async ({ searchParams }) => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    redirect("/login");
  }

  const params = await searchParams;
  const currentPage = Number(params?.page) ?? 1;
  const offset = (currentPage - 1) * BOOKINGS_PER_PAGE;

  const totalPages = await getBookingHistoryPages(userId);
  const result = await fetchAllBookings(userId, offset);

  if (result.length === 0 && currentPage > 1) {
    redirect(`/account/favorites?page=${currentPage - 1}`);
  }

  return (
    <Box component="section">
      <Box component="header" mb={"lg"}>
        <Title>Booking History</Title>
      </Box>
      <Grid gutter={{ base: 5, xs: "sm", md: "md" }} mb={"md"}>
        <GridCol span={{ base: 5 }} visibleFrom="sm">
          <Text fw={500}>Booking ID</Text>
        </GridCol>
        <GridCol span={{ base: 4 }} visibleFrom="sm">
          <Text fw={500}>Accommodation</Text>
        </GridCol>
        <GridCol span={{ base: 3 }} visibleFrom="sm">
          <Text fw={500}>Date</Text>
        </GridCol>
      </Grid>
      <Box>{!result.length && <Text>You have no recent bookings.</Text>}</Box>
      {result.map((booking, i) => (
        <RecentBooking key={booking.id} {...booking} />
      ))}
      <DataPagination totalPages={totalPages} currentPage={currentPage} />
    </Box>
  );
};

export default BookingHistoryPage;
