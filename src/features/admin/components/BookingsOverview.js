"use client";
// import { deleteBooking } from "@/actions/booking";
import DataTable from "./DataTable";
import { Badge } from "@mantine/core";
import { parseDate } from "@/utils/date";

const BookingsOverview = ({ bookings, totalPages, currentPage }) => {
  const formattedBookingsData = bookings.map((b) => ({
    ...b,
    totalPrice: `$$${Number(b.totalPrice).toFixed(2)}`,
  }));

  return (
    <DataTable
      data={formattedBookingsData}
      title="Bookings"
      enableEdit={false}
      totalPages={totalPages}
      currentPage={currentPage}
      columns={[
        { key: "id", label: "ID" },
        {
          key: "checkIn",
          label: "Check In",
          visibleFrom: "sm",
          format: (v) => parseDate(v).format("DD/MM/YY"),
        },
        {
          key: "checkOut",
          label: "Check Out",
          visibleFrom: "sm",
          format: (v) => parseDate(v).format("DD/MM/YY"),
        },
        ,
        {
          key: "nights",
          label: "Nights",
          visibleFrom: "sm",
        },
        {
          key: "status",
          label: "Booking Status",
          visibleFrom: "sm",
          format: (value) => {
            const color =
              value === "confirmed"
                ? "green"
                : value === "cancelled"
                ? "red"
                : "yellow";
            return <Badge color={color}>{value}</Badge>;
          },
        },
      ]}
      // deleteAction={deleteBooking} // to add
      resourceName={"bookings"}
    />
  );
};

export default BookingsOverview;
