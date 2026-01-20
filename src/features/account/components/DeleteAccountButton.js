"use client";
import { Button, Text, Box, Flex } from "@mantine/core";
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
      mantineNotify.success("Deleting Account. We're sorry to see you go.");

      await signOut({ callbackUrl: "/" });
    } else {
      mantineNotify.error(res.error || "Failed to delete account.");
    }
  };

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: "Delete your account",
      centered: true,
      size: "md",
      children: (
        <Flex direction={"column"}>
          <Text>Are you sure you want to delete your account?</Text>
          <Text my={"md"}>
            This action is
            <Text span fw={"bold"}>
              {" "}
              permanent
            </Text>{" "}
            and all your personal data will be erased.
          </Text>
          <Text size="sm">
            Please note that any reviews you have posted will remain on our site
            to help other travelers, but they have been made anonymous and
            cannot be linked back to you.
          </Text>
        </Flex>
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
