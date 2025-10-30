"use client";

import { useTransition, useState } from "react";
import { ActionIcon, Text, Button } from "@mantine/core";
import { IconDelete } from "@/components/icons";
import { modals } from "@mantine/modals";
import { useRouter } from "next/navigation";
import { mantineNotify } from "@/lib/mantineNotify";

const DeleteModal = ({
  id,
  resourceName = "item",
  deleteAction,
  redirectAfter = null,
  title,
  message,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  triggerType = "icon" | "button",
  buttonLabel = "Delete",
  color = "red",
  icon,
  fullWidth = false,
  size,
}) => {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      setIsDeleting(true);
      try {
        const res = await deleteAction(id);

        if (res?.success) {
          mantineNotify.success(`${resourceName} successfully deleted.`);
          if (redirectAfter) {
            router.push(redirectAfter);
          } else {
            router.refresh();
          }
        } else {
          mantineNotify.error(
            res?.message || `Failed to delete ${resourceName}`
          );
        }
      } catch (error) {
        console.error(`Error deleting ${resourceName}: `, error);
        mantineNotify.error(
          `An unexpected error occured deleting ${resourceName}`
        );
      } finally {
        setIsDeleting(false);
        modals.closeAll();
      }
    });
  };

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: title || resourceName,
      centered: true,
      children: (
        <Text size="sm">
          {message ||
            `Are you sure you want to permanently delete ${resourceName}? This action cannot be undone.`}
        </Text>
      ),
      labels: { confirm: confirmText, cancel: cancelText },
      confirmProps: { color, loading: isPending, loaderProps: "oval" },
      onConfirm: handleDelete,
    });
  };

  return triggerType === "button" ? (
    <Button
      color={color}
      leftSection={
        icon || (
          <IconDelete
            color="var(--mantine-color-white)"
            height={18}
            width={18}
          />
        )
      }
      onClick={openDeleteModal}
      disabled={isPending}
      fullWidth={fullWidth}
      size={size}
    >
      {buttonLabel}
    </Button>
  ) : (
    <ActionIcon
      variant="filled"
      color={color}
      aria-label={`Delete ${resourceName}`}
      onClick={openDeleteModal}
      disabled={isPending}
    >
      {icon || (
        <IconDelete
          height={18}
          width={18}
          color={"var(--mantine-color-white)"}
        />
      )}
    </ActionIcon>
  );
};

export default DeleteModal;
