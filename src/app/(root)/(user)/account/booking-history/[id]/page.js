import { auth } from "../../../../../../../auth";
import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import {
  Container,
  Flex,
  Text,
  Title,
  Paper,
  Grid,
  GridCol,
  Divider,
} from "@mantine/core";

const UserBookingDetailPage = async ({ params }) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  const id = (await params).id;

  const bookingDetails = await db.query.bookings.findFirst({
    where: and(eq(bookings.id, id), eq(bookings.userId, session.user.id)),
    with: { accommodation: true },
  });

  const {
    checkIn,
    checkOut,
    guests,
    isPaid,
    message,
    name,
    email,
    nights,
    totalPrice,
  } = bookingDetails;

  if (!bookingDetails) redirect("/404");

  return (
    <Container px={0} size={"xs"}>
      <Paper withBorder p={"sm"} mt={"lg"}>
        <Title ta={"center"} order={1}>
          {bookingDetails.accommodation.title}
        </Title>
        <Grid mt={"md"}>
          <GridCol span={{ base: 12, sm: 6 }}>
            <Text>Name: {name}</Text>
          </GridCol>
          <GridCol span={{ base: 12, sm: 6 }}>
            <Text>Email: {email}</Text>
          </GridCol>
        </Grid>
        <Grid mt={"md"}>
          <GridCol span={{ base: 6, sm: 6 }}>
            <Text>Check-in: {dayjs(checkIn).format("DD/MM/YY")}</Text>
          </GridCol>
          <GridCol span={{ base: 6, sm: 6 }}>
            <Text>Check-out: {dayjs(checkOut).format("DD/MM/YY")}</Text>
          </GridCol>
        </Grid>
        <Grid mt={"md"}>
          <GridCol span={{ base: 6 }}>
            <Text>Price: ${totalPrice}</Text>
          </GridCol>
          <GridCol span={{ base: 6 }}>
            <Text>Paid: {isPaid ? "Yes" : "No"}</Text>
          </GridCol>
        </Grid>
        <Grid mt={"md"}>
          <GridCol span={{ base: 6 }}>
            <Text>Guests: {guests}</Text>
          </GridCol>
          <GridCol span={{ base: 6 }}>
            <Text>Nights: {nights}</Text>
          </GridCol>
        </Grid>
        <Divider my={"md"} />
        <Flex direction={"column"}>
          <Text mb={"sm"}>Message:</Text>
          <Text>{message}</Text>
        </Flex>
      </Paper>
    </Container>
  );
};

export default UserBookingDetailPage;
