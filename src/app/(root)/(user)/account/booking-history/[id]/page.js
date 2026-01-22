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
  Group,
  Box,
  Rating,
  Stack,
} from "@mantine/core";
import ReviewForm from "@/features/account/forms/ReviewForm";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

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
        <Group mt={"sm"}>
          <Text>Booking: </Text>
          <StatusBadge status={status} />
        </Group>

        <Divider my={"lg"} label="Your Experience" labelPosition="center" />
        {review ? (
          <Box mb="md">
            <Paper withBorder p="sm" radius="md" bg="gray.0">
              <Flex justify="space-between" align="center" mb="xs">
                <Rating value={parseFloat(review.rating)} readOnly size="sm" />
                <Badge>{review.status} </Badge>
              </Flex>

              <Text fw={600} size="sm" mb={4}>
                {review.title}
              </Text>
              <Text size="xs" c="dimmed" lineClamp={2} mb="md">
                "{review.comment}"
              </Text>

              <ReviewForm
                bookingId={id}
                accommodationId={bookingDetails.accommodation.id}
                accommodationTitle={bookingDetails.accommodation.title}
                initialData={review}
              />
            </Paper>
            <Text size="xs" c="dimmed" mt={5} ta="center">
              Reviews are moderated before appearing publicly.
            </Text>
          </Box>
        ) : (
          <Stack align="center" py="sm">
            <Text size="sm" c="dimmed">
              You haven't reviewed this stay yet.
            </Text>
            <ReviewForm
              bookingId={id}
              accommodationId={bookingDetails.accommodation.id}
              accommodationTitle={bookingDetails.accommodation.title}
              initialData={null}
            />
          </Stack>
        )}
        <Divider my={"lg"} label="Booking Details" labelPosition="center" />

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
