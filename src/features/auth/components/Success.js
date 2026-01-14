import { IconCheckmark } from "@/components/icons";
import {
  Button,
  Center,
  Container,
  Paper,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import Link from "next/link";

const Success = ({ isChangeMode }) => {
  return (
    <Container maw="400px" mt="xl">
      <Paper p="md" withBorder>
        <Center mb="md">
          <ThemeIcon size={50} radius={50} color="green" variant="light">
            <IconCheckmark height={30} width={30} stroke={3} />
          </ThemeIcon>
        </Center>
        <Title order={3} ta={"center"} mb={"lg"}>
          Success!
        </Title>
        <Text ta="center" mb="md">
          {isChangeMode
            ? "Your password has been updated."
            : "Your password has been successfully reset."}
        </Text>
        {isChangeMode ? (
          <Text ta="center" my="md" c="dimmed" size="sm">
            For security reasons, you’ll be signed out shortly.
          </Text>
        ) : (
          <Text ta="center" my="md" c="dimmed" size="sm">
            You can now use your new password to log in to your account.
          </Text>
        )}
        <Button
          component={Link}
          href="/login"
          fullWidth
          variant={isChangeMode ? "light" : "filled"}
        >
          {isChangeMode ? "Back to Login" : "Go to Login Now"}
        </Button>
      </Paper>
    </Container>
  );
};

export default Success;
