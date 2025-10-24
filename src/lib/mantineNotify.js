import { IconAlert, IconCheckmark } from "@/components/icons";
import { notifications } from "@mantine/notifications";

export const mantineNotify = {
  success: (message, title = "Success") =>
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
  error: (message, title = "Error") =>
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
  info: (message, title = "Info") =>
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
