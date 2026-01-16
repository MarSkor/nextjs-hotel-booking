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
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { IconInfoCircle } from "@/components/icons";
import FieldError from "./FieldError";
import { mantineNotify } from "@/lib/mantineNotify";
import Link from "next/link";

const AuthForm = ({ type, schema, defaultValues, handleFormOnSubmit }) => {
  const isLogin = type === "LOGIN";
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next")?.startsWith("/")
    ? searchParams.get("next")
    : "/account";

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
    criteriaMode: "all",
  });

  const onSubmit = async (data) => {
    const res = await handleFormOnSubmit(data);

    if (res.success) {
      mantineNotify.success(
        isLogin
          ? "You're signed in"
          : "You have successfully registered with Holidaze."
      );

      window.location.href = nextUrl;
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.nested;
          for (const key in nestedErrors) {
            setError(key, { message: nestedErrors[key]?.[0] });
          }
          break;

        case 401:
        case 409:
        case 500:
        default:
          const error =
            res.error ||
            "An error occurred. Please try again or contact support.";
          setError("root", { message: error });
      }
    }
  };

  useEffect(() => {
    if (nextUrl?.includes("verify-email")) {
      mantineNotify.info("You must be logged in to confirm your email.");
    }
  }, []);

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
                          error={!!errors.password}
                        />
                        {FieldError(errors[field.name])}
                        <Flex justify={"end"}>
                          <Anchor
                            mt={"sm"}
                            component={Link}
                            href={"/forgot-password"}
                            size="sm"
                          >
                            Forgot password?
                          </Anchor>
                        </Flex>
                      </>
                    ) : (
                      <>
                        <TextInput
                          {...field}
                          size="sm"
                          required
                          label={FIELD_NAMES[field.name]}
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
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isLogin ? "Log in" : "Create Account"}
          </Button>
        </form>
      </Box>

      {errors.root && (
        <Box className="auth-pages__form-error" mt={"lg"}>
          <Flex align={"center"}>
            <IconInfoCircle color="var(--clr-semantic-error)" />
            <Text size={"xs"} ml={"xs"}>
              {errors.root.message}
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
