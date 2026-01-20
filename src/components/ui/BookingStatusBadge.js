import { Badge } from "@mantine/core";

const statusConfig = {
  PENDING: { color: "yellow", label: "Pending" },
  CONFIRMED: { color: "green", label: "Confirmed" },
  CANCELLED: { color: "red", label: "Cancelled" },
};

const BookingStatusBadge = ({ status }) => {
  const { color, label } = statusConfig[status] || {
    color: "gray",
    label: status,
  };

  return (
    <Badge color={color} variant="light" radius="sm">
      {label}
    </Badge>
  );
};

export default BookingStatusBadge;
