import { Box, Title, Text, Flex, Paper } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";

const RecentBooking = (data) => {
  return (
    <Paper
      withBorder
      p={"sm"}
      mb={"sm"}
      className="account-paperLink"
      role="link"
      tabIndex={"0"}
    >
      <Box component="article" className="account-paperLinkPaper">
        <Title order={4}>{data.accommodation.title}</Title>
        <Flex direction={"row"} justify={"space-between"} mt={"sm"}>
          <Flex
            gap={{ base: 0, sm: "md" }}
            direction={{ base: "column", sm: "row" }}
          >
            <Text>
              <Text span fw={500}>
                Check-in:
              </Text>{" "}
              {dayjs(data.checkIn).format("DD/MM/YY")}
            </Text>
            <Text>
              <Text span fw={500}>
                Check-out:
              </Text>{" "}
              {dayjs(data.checkOut).format("DD/MM/YY")}
            </Text>
          </Flex>
          <Flex
            gap={{ base: 0, sm: "md" }}
            direction={{ base: "column", sm: "row" }}
          >
            <Text>
              <Text span fw={500}>
                Guests:{" "}
              </Text>
              {data.guests}
            </Text>
            <Text>
              <Text span fw={500}>
                Price:{" "}
              </Text>{" "}
              ${data.totalPrice}
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Link
        className="card-link-account"
        href={`/account/booking-history/${data.id}`}
      >
        View Details
      </Link>
    </Paper>
  );
};

export default RecentBooking;
