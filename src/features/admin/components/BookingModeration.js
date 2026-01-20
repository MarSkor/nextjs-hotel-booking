"use client";
import { Group, Button, Text } from "@mantine/core";
import { bookingModeration } from "@/actions/admin";
import { modals } from "@mantine/modals";
import { useTransition } from "react";
import { notifications } from "@mantine/notifications";

const BookingModeration = ({ booking }) => {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    modals.openConfirmModal({
      title: "Cancel Booking",
      centered: true,
      children: (
        <Group>
          <Text>
            Are you sure you want to cancel the booking for{" "}
            <Text span fw={"bold"}>
              {booking.name}
            </Text>
            ?
          </Text>
          <Text>
            This action will set the status to{" "}
            <Text span fw={"bold"}>
              CANCELLED
            </Text>
            .
          </Text>
        </Group>
      ),
      labels: { confirm: "Confirm Cancellation", cancel: "Keep Booking" },
      confirmProps: { color: "red", loading: isPending },
      onConfirm: () => {
        startTransition(async () => {
          const res = await bookingModeration(booking.id);
          if (res.success) {
            notifications.show({
              color: "green",
              message: "Booking cancelled successfully",
            });
          } else {
            notifications.show({ color: "red", message: res.error });
          }
        });
      },
    });
  };

  if (booking.status === "CANCELLED") return null;

  return (
    <Group justify="flex-start">
      <Button
        variant="light"
        color="red"
        size="compact-xs"
        onClick={handleCancel}
        loading={isPending}
      >
        Cancel Booking
      </Button>
    </Group>
  );
};

export default BookingModeration;
