"use client";
import { useRouter } from "next/navigation";
import { Alert, Text, Stack } from "@mantine/core";
import { IconInfoCircle } from "../icons";

const ErrorMessage = ({
  title,
  message,
  showRetry = false,
  onRetry,
  showBack = false,
}) => {
  const router = useRouter();

  return (
    <Alert
      title={title}
      color="red"
      variant="light"
      radius="sm"
      icon={
        <IconInfoCircle
          height={24}
          width={24}
          color="var(--mantine-color-red-light-color)"
        />
      }
    >
      <Stack gap="xs">
        <Text size="sm">{message}</Text>
      </Stack>
      {showRetry && (
        <Stack gap="xs" mt="xs">
          <Button
            size="xs"
            color="red"
            variant="light"
            onClick={onRetry}
            w="fit-content"
          >
            Retry
          </Button>
        </Stack>
      )}
      {showBack && (
        <Button
          size="xs"
          variant="outline"
          onClick={() => router.back()}
          w="fit-content"
        >
          Go Back
        </Button>
      )}
    </Alert>
  );
};

export default ErrorMessage;
