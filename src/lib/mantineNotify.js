import { IconAlert, IconCheckmark } from "@/components/icons";
import { notifications } from "@mantine/notifications";

export const mantineNotify = {
  success: (title = "Success", message) =>
    notifications.show({
      withBorder: true,
      title,
      message,
      color: "green",
      icon: (
        <IconCheckmark
          height={20}
          width={20}
          color={"var(--mantine-color-white)"}
        />
      ),
    }),
  error: (title = "Error", message) =>
    notifications.show({
      withBorder: true,
      title,
      message,
      color: "red",
      icon: (
        <IconAlert
          height={20}
          width={20}
          color={"var(--mantine-color-white)"}
        />
      ),
    }),
  info: (title = "Info", message) =>
    notifications.show({
      withBorder: true,
      title,
      message,
      color: "blue",
      icon: (
        <IconAlert
          height={20}
          width={20}
          color={"var(--mantine-color-white)"}
        />
      ),
    }),
};
