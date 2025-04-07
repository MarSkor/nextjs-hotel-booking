import RegisterForm from "@/features/login/forms/RegisterForm";
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

const SignUp = () => {
  return (
    <Container className="container-sm">
      <Box className="auth-public__wrapper">
        <Box className="auth-public__heading" mb="lg">
          <Title mt="lg" mb="lg" order={1}>
            Welcome to Holidaze
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Already have an account?{" "}
            <Anchor
              size="sm"
              href={"/login"}
              component={Link}
              className="auth_link underline-link "
            >
              Log in
            </Anchor>
          </Text>
        </Box>
        <RegisterForm />
        <Box>
          <Flex direction="column">
            <Divider my="xs" label="Or" labelPosition="center" />
          </Flex>
          <Box className="auth-public__button-group" mt="lg">
            <GoogleSigninButton text="Sign up with Google" />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
