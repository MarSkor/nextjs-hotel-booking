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
  Anchor,
  Spoiler,
  Badge,
} from "@mantine/core";
import ReviewForm from "@/features/account/forms/ReviewForm";
import Link from "next/link";
import BookingStatusBadge from "@/components/ui/BookingStatusBadge";

const ExpandableMessage = ({ message }) => {
  if (!message) {
    return (
      <Text c="dimmed" size="sm" italic>
        No message provided
      </Text>
    );
  }
  return (
    <Spoiler
      maxHeight={100}
      showLabel="Show more"
      hideLabel="Hide"
      transitionDuration={200}
      styles={{
        control: {
          fontSize: "12px",
          fontWeight: 600,
          marginTop: "6px",
        },
      }}
    >
      <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
    </Spoiler>
  );
};

const UserBookingDetailPage = async ({ params }) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  const id = (await params).id;

  const bookingDetails = await db.query.bookings.findFirst({
    where: and(eq(bookings.id, id), eq(bookings.userId, session.user.id)),
    with: { accommodation: true, review: true },
  });

  const {
    checkIn,
    checkOut,
    guests,
    message,
    name,
    email,
    nights,
    totalPrice,
    review,
    status,
  } = bookingDetails;

  if (!bookingDetails) redirect("/404");

  return (
    <Container px={0} size={"sm"}>
      <Paper p={"md"} mt={"xl"} shadow="xs">
        <Flex direction={"column"}>
          <Title order={1} size={"h3"} mb={"4px"}>
            Booking Receipt #{id.slice(0, 8).toUpperCase()}
          </Title>
          <Text mt={"4px"} size="sm" c={"dimmed"}>
            {id}
          </Text>
          <Text mt={"xs"}>Holidaze Private Residences - Bergen</Text>
        </Flex>
        <BookingStatusBadge status={status} />
        <Divider my={"lg"} />
        <Grid align="center">
          <GridCol span={{ base: 6 }}>
            <Text>Review:</Text>
          </GridCol>
          <GridCol span={{ base: 6 }}>
            {review ? (
              <ReviewForm
                bookingId={id}
                accommodationId={bookingDetails.accommodation.id}
                accommodationTitle={bookingDetails.accommodation.title}
                initialData={review}
              />
            ) : (
              <ReviewForm
                initialData={review}
                bookingId={id}
                accommodationId={bookingDetails.accommodation.id}
                accommodationTitle={bookingDetails.accommodation.title}
              />
            )}
          </GridCol>
        </Grid>
        <Divider my={"lg"} />
        {/* ---- */}
        <Flex direction={"column"}>
          <Text fw={"bold"} size="xs" tt="uppercase">
            Personal Details
          </Text>
          <Grid mt={"xs"}>
            <GridCol span={{ base: 12, sm: 6 }}>
              <Flex direction={"column"}>
                <Text mb={"4px"}>Name:</Text>
                <Text>{name}</Text>
              </Flex>
            </GridCol>
            <GridCol span={{ base: 12, sm: 6 }}>
              <Flex direction={"column"}>
                <Text mb={"4px"}>Email Address:</Text>
                <Text>{email}</Text>
              </Flex>
            </GridCol>
          </Grid>
        </Flex>
        {/* ---- */}
        <Flex direction={"column"} mt={"lg"}>
          <Text fw={"bold"} size="xs" tt="uppercase">
            Accommodation Details
          </Text>
          <Grid mt={"xs"}>
            {/* ---- */}
            <GridCol span={{ base: 12, sm: 6 }}>
              <Text>Name</Text>
            </GridCol>
            <GridCol span={{ base: 12, sm: 6 }}>
              <Anchor
                component={Link}
                href={`/accommodation/${bookingDetails.accommodation.slug}`}
              >
                {bookingDetails.accommodation.title}
              </Anchor>
            </GridCol>
            {/* ---- */}
            <GridCol span={{ base: 6, sm: 6 }}>
              <Text>Check-in:</Text>
            </GridCol>
            <GridCol span={{ base: 6, sm: 6 }}>
              <Text> {dayjs(checkIn).format("DD/MM/YY")}</Text>
            </GridCol>
            {/* ---- */}
            <GridCol span={{ base: 6, sm: 6 }}>
              <Text>Check-out:</Text>
            </GridCol>
            <GridCol span={{ base: 6, sm: 6 }}>
              <Text>{dayjs(checkOut).format("DD/MM/YY")}</Text>
            </GridCol>
            {/* ---- */}
            <GridCol span={{ base: 6, sm: 6 }}>
              <Text>Nights</Text>
            </GridCol>
            <GridCol span={{ base: 6, sm: 6 }}>
              <Text>{nights}</Text>
            </GridCol>
            {/* ---- */}
            <GridCol span={{ base: 6, sm: 6 }}>
              <Text>Guests</Text>
            </GridCol>
            <GridCol span={{ base: 6, sm: 6 }}>
              <Text>{guests}</Text>
            </GridCol>

            {/* ---- */}
            <GridCol span={{ base: 6, sm: 6 }}>
              <Text>Price Total:</Text>
            </GridCol>
            <GridCol span={{ base: 6, sm: 6 }}>
              <Text>${totalPrice}</Text>
            </GridCol>
          </Grid>
          <Flex direction={"column"} mt={"lg"}>
            <Text mb={"sm"} fw={"bold"} tt={"uppercase"} size="xs">
              Message:
            </Text>
            {/* <Text>{message}</Text> */}
            <ExpandableMessage message={message} />
          </Flex>
        </Flex>
      </Paper>
    </Container>
  );
};

export default UserBookingDetailPage;
