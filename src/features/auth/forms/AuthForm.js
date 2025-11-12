"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  TextInput,
  PasswordInput,
  Button,
  Flex,
  Text,
  Anchor,
  Box,
  Title,
  rem,
} from "@mantine/core";
import { FIELD_NAMES } from "./data";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconInfoCircle } from "@/components/icons";
import FieldError from "./FieldError";
import { mantineNotify } from "@/lib/mantineNotify";

const AuthForm = ({ type, schema, defaultValues, handleFormonSubmit }) => {
  const isLogin = type === "LOGIN";
  const router = useRouter();
  const [formError, setFormError] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
    criteriaMode: "all",
  });

  const onSubmit = async (data) => {
    const result = await handleFormonSubmit(data);

    if (result.success) {
      mantineNotify.success(
        isLogin
          ? "You have successfully logged in"
          : "You have successfully regisreted with Holidaze."
      );
      router.push("/");
    }

    setFormError(result.error);
  };

  // console.log("errors", z.flattenError(errors).fieldErrors);
  // console.log("errors", errors);

  return (
    <Flex className="auth-pages__form" direction={"column"}>
      <Box className="auth-pages__auth-heading" mb={"md"}>
        <Title order={1} size={"h2"} className="auth-pages__title" mb={"sm"}>
          {isLogin ? " Welcome back to Holidaze!" : "Create new account"}
        </Title>
        <Text size="sm" c="dimmed">
          {isLogin
            ? "Access your bookings, preferences, and favorite stays in seconds."
            : "Make booking simple—track trips, save favorites, and more"}
        </Text>
      </Box>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          {Object.keys(defaultValues).map((field) => {
            return (
              <Box
                className="auth-pages__form-field"
                key={field}
                mt="sm"
                mb="lg"
              >
                <Controller
                  name={field}
                  control={control}
                  render={({ field }) =>
                    field.name === "password" ? (
                      <>
                        <PasswordInput
                          {...field}
                          size="sm"
                          required
                          label={FIELD_NAMES[field.name]}
                          className=""
                          error={!!errors.password}
                        />
                        {FieldError(errors[field.name])}
                      </>
                    ) : (
                      <>
                        <TextInput
                          {...field}
                          size="sm"
                          required
                          label={FIELD_NAMES[field.name]}
                          className=""
                          error={!!errors[field.name]}
                        />
                        {FieldError(errors[field.name])}
                      </>
                    )
                  }
                />
              </Box>
            );
          })}

          <Button
            fullWidth
            mt={rem("32px")}
            size="md"
            radius="md"
            type="submit"
            disabled={isSubmitting}
          >
            {isLogin ? "Log in" : "Create Account"}
          </Button>
        </form>
      </Box>

      {formError && (
        <Box className="auth-pages__form-error" mt={"lg"}>
          <Flex align={"center"}>
            <IconInfoCircle color="var(--clr-semantic-error)" />
            <Text size={"xs"} ml={"xs"}>
              {formError}
            </Text>
          </Flex>
        </Box>
      )}

      <Text ta="center" mt="xl" size="sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Anchor href={isLogin ? "/register" : "/login"} fw={600}>
          {isLogin ? "Register" : "Log in"}
        </Anchor>
      </Text>
    </Flex>
  );
};

export default AuthForm;
