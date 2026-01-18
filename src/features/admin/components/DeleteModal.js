"use client";

import { useTransition } from "react";
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
  role,
  title,
  message,
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
  const router = useRouter();

  const isProtected = role === "ADMIN";

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await deleteAction(resourceName, id);

        if (res?.success) {
          mantineNotify.success(`${resourceName} successfully deleted.`);
          if (redirectAfter) {
            router.push(redirectAfter);
          } else {
            router.refresh();
          }
        } else {
          mantineNotify.error(
            res?.message || `Failed to delete ${resourceName}`,
          );
        }
      } catch (error) {
        // console.error(`Error deleting ${resourceName}: `, error);
        mantineNotify.error(
          `An unexpected error occurred deleting ${resourceName}`,
        );
      } finally {
        modals.closeAll();
      }
    });
  };

  const openDeleteModal = () => {
    if (isProtected) {
      modals.open({
        title: "Action not allowed.",
        centered: true,
        children: (
          <Text size="sm" c={"red"}>
            You don't have permission for this action.
          </Text>
        ),
      });
      return;
    }
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
      disabled={isProtected || isPending}
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
      disabled={isProtected || isPending}
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
