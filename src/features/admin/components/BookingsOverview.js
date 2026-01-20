"use client";
import DataTable from "./DataTable";
import { Badge, Box, Text, Tooltip } from "@mantine/core";
import { parseDate } from "@/utils/date";
import { deleteResourceAction } from "@/actions/admin";
import BookingModeration from "./BookingModeration";

const BookingsOverview = ({ bookings, totalPages, currentPage }) => {
  const formattedBookingsData = bookings.map((b) => ({
    ...b,
    totalPrice: `$${Number(b.totalPrice).toFixed(2)}`,
  }));

  return (
    <DataTable
      data={formattedBookingsData}
      title="Bookings"
      enableEdit={false}
      totalPages={totalPages}
      currentPage={currentPage}
      columns={[
        {
          key: "id",
          label: "ID",
          format: (id) => (
            <Tooltip label={id} withArrow position="top-start">
              <Text
                span
                style={{ cursor: "help", fontFamily: "monospace" }}
                fz="sm"
              >
                #{id.slice(0, 8).toUpperCase()}
              </Text>
            </Tooltip>
          ),
        },
        {
          key: "createdAt",
          label: "Booked On",
          visibleFrom: "lg",
          format: (v) => (
            <Box>
              <Text size="sm">{parseDate(v).format("DD/MM/YYYY")}</Text>
              <Text size="xs" c="dimmed">
                {parseDate(v).format("HH:mm")}
              </Text>
            </Box>
          ),
        },
        {
          key: "checkIn",
          label: "Dates",
          format: (_, item) =>
            `${parseDate(item.checkIn).format("MMM D")} - ${parseDate(item.checkOut).format("MMM D")}`,
        },
        {
          key: "totalPrice",
          label: "Total",
          format: (v) => `${v}`,
        },
        {
          key: "status",
          label: "Status",
          visibleFrom: "sm",
          format: (v) => {
            const colors = {
              PENDING: "yellow",
              CONFIRMED: "green",
              CANCELLED: "red",
            };
            return <Badge color={colors[v]}>{v}</Badge>;
          },
        },
        {
          key: "decision",
          label: "Decision",
          format: (_, item) => <BookingModeration booking={item} />,
        },
      ]}
      deleteAction={deleteResourceAction}
      resourceName={"bookings"}
    />
  );
};

export default BookingsOverview;
