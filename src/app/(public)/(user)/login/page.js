import LogInForm from "@/features/login/forms/LogInForm";
import {
  Container,
  Box,
  Text,
  Title,
  Flex,
  Divider,
  Anchor,
} from "@mantine/core";
import { GoogleSigninButton } from "@/components/ui";
import Link from "next/link";

const LogIn = () => {
  return (
    <Container className="container-sm">
      <Box className="auth-public__wrapper">
        <Box className="auth-public__heading" mb="lg">
          <Title mt="lg" mb="lg" order={1}>
            Welcome back
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Do not have an account yet?{" "}
            <Anchor
              size="sm"
              href={"/signup"}
              component={Link}
              className="auth_link underline-link"
            >
              Create account
            </Anchor>
          </Text>
        </Box>
        <LogInForm />
        <Box>
          <Flex direction="column">
            <Divider my="xs" label="Or" labelPosition="center" />
          </Flex>
          <Box className="auth-public__button-group" mt="lg">
            <GoogleSigninButton text="Log in with Google" />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LogIn;
