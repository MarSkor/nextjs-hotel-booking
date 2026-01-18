"use client";
import { Button, Text, Box } from "@mantine/core";
import { deleteAccount } from "@/actions/user";
import { modals } from "@mantine/modals";
import { useTransition } from "react";
import { mantineNotify } from "@/lib/mantineNotify";
import { signOut } from "next-auth/react";

const DeleteAccountButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const res = await deleteAccount();

    if (res.success) {
      mantineNotify.success("Account deleted. We're sorry to see you go.");

      await signOut({ callbackUrl: "/" });
    } else {
      mantineNotify.error(res.error || "Failed to delete account.");
    }
  };

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: "Delete your account",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete your account? This action is
          <b> permanent</b> and all your data (profile, settings, bookings and
          reviews will be anonymized since all personal data will be deleted.)
          will be removed immediately.
        </Text>
      ),
      labels: {
        confirm: "Delete permanently",
        cancel: "Cancel",
      },
      confirmProps: {
        color: "red",
        loading: isPending,
      },
      onConfirm: () => startTransition(handleDelete),
    });
  };

  return (
    <Box mt={"lg"}>
      <Button
        variant="filled"
        color="red"
        onClick={openDeleteModal}
        loading={isPending}
      >
        Delete Account
      </Button>
    </Box>
  );
};

export default DeleteAccountButton;
