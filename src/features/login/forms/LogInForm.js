"use client";
import { useActionState } from "react";
import {
  Box,
  Flex,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Group,
  Anchor,
} from "@mantine/core";
import { login } from "@/actions/user";
import { ErrorMessage } from "@/components/ui";
import Link from "next/link";

const LogInForm = () => {
  const [state, formAction] = useActionState(login, null);

  console.log("LOGIN STATE", state);

  return (
    <Box className="auth-public__form-wrapper" mb="lg">
      <form className="auth-public__form" action={formAction}>
        <Flex justify="center" direction="column">
          <Box mb="lg">
            <TextInput
              size="sm"
              label="Email"
              name="email"
              placeholder="Enter your email"
              required
              classNames={{
                input: state?.errors?.email ? "global__input border-red" : "",
                label: "global__inputLabel",
              }}
              defaultValue={state?.inputs?.email}
            />
            {state?.errors?.email && (
              <Text size="xs" className="text-red-500" mt="sm">
                {state.errors.email}
              </Text>
            )}
          </Box>
          <Box mb="lg">
            <PasswordInput
              size="sm"
              label="Password"
              name="password"
              placeholder="Enter your password"
              required
              classNames={{
                input: state?.errors?.password
                  ? "global__input border-red"
                  : "",
                label: "global__inputLabel",
              }}
              defaultValue={state?.inputs?.password}
            />
            {state?.errors?.password && (
              <Text size="xs" className="text-red-500" mt="sm">
                {state.errors.password}
              </Text>
            )}
          </Box>
          <Group mt="xs">
            <Anchor
              component={Link}
              href={"/forgot-password"}
              size="sm"
              className="auth_link underline-link "
            >
              Forgot password?
            </Anchor>
          </Group>
        </Flex>
        {state?.status?.message && (
          <ErrorMessage errorMessage={state.status.message} />
        )}

        {state?.error && (
          <ErrorMessage errorMessage={state.error.message.message} />
        )}

        <Box mt="xl">
          <Button type="submit" fullWidth className="btn btn-primary">
            Log in
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default LogInForm;
