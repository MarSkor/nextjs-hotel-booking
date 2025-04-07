"use client";
import {
  Box,
  Flex,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Checkbox,
  List,
} from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { signup } from "@/actions/user";
import { ErrorMessage } from "@/components/ui";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const RegisterForm = () => {
  const [state, formAction] = useActionState(signup, null);
  const searchParams = useSearchParams();
  const paramsMessage = searchParams.get("message");

  // console.log("params message register", paramsMessage);
  // console.log("LOGIN STATE", state);

  return (
    <Box className="auth-public__form-wrapper" mb="lg">
      <form className="auth-public__form" action={formAction}>
        <Flex justify="center" direction="column">
          <Box mb="lg">
            <TextInput
              size="sm"
              label="Username"
              description="Username can be changed later."
              name="username"
              placeholder="Enter your username"
              required
              classNames={{
                input: state?.errors?.username
                  ? "global__input border-red"
                  : "",
                label: "global__inputLabel",
              }}
              defaultValue={state?.inputs?.username}
            />
            {state?.errors?.username && (
              <Text size="xs" className="text-red-500" mt="sm">
                {state.errors.email}
              </Text>
            )}
          </Box>
          <Box mb="lg">
            <TextInput
              size="sm"
              required
              withAsterisk
              label="Email"
              name="email"
              placeholder="Enter your email"
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
              required
              withAsterisk
              label="Password"
              name="password"
              placeholder="Enter your password"
              classNames={{
                input: state?.errors?.password
                  ? "global__input border-red"
                  : "",
                label: "global__inputLabel",
              }}
              defaultValue={state?.inputs?.password}
            />

            {state?.errors?.password?.length > 0 && (
              <Flex direction="column" mt="sm">
                <List size="xs" listStyleType="none">
                  {state.errors.password.map((error) => (
                    <List.Item
                      key={error}
                      mb="xs"
                      className="auth-error text-red-500"
                    >
                      {error}
                    </List.Item>
                  ))}
                </List>
              </Flex>
            )}
          </Box>
        </Flex>

        {paramsMessage && <ErrorMessage errorMessage={paramsMessage} />}

        <Box mt="xl">
          <SubmitButton />
        </Box>
      </form>
    </Box>
  );
};

export default RegisterForm;

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      fullWidth
      aria-disabled={pending}
      type="submit"
      className="btn btn-primary"
    >
      {pending ? "Submitting..." : "Sign up"}
    </Button>
  );
};
