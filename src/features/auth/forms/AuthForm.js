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
  Paper,
} from "@mantine/core";
import { FIELD_NAMES } from "./data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { IconInfoCircle } from "@/components/icons";

const AuthForm = ({ type, schema, defaultValues, handleFormonSubmit }) => {
  const isLogin = type === "LOGIN";
  const router = useRouter();
  const [formError, setFormError] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
    criteriaMode: "all",
  });

  const onSubmit = async (data) => {
    const result = await handleFormonSubmit(data);

    if (result.success) {
      toast("Success", {
        label: "Success",
        description: isLogin
          ? "You have successfully logged in"
          : "You have successfully registered with Holidaze",
      });
      router.push("/");
    } else {
      // toast(`Error ${isLogin ? "logging in" : "creating account"}.`, {
      //   // description: result.error ?? "An error occured.",
      //   description: "An error occured.",
      //   variant: "destructive",
      // });
    }
    setFormError(result.error);
    console.log("result-", result);
  };

  console.log("errors", errors);

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
                      <PasswordInput
                        {...field}
                        size="sm"
                        required
                        label={FIELD_NAMES[field.name]}
                        // error={errors?.[field.name]?.message}
                        error={
                          errors?.[field.name]?.types
                            ? Object.values(errors[field.name].join("\n"))
                            : errors.password?.message || null
                        }
                        className=""

                        //       errors.password?.types
                        // ? Object.values(errors.password.types).join('\n')
                        // : errors.password?.message || null
                      />
                    ) : (
                      // {errors.password?.types &&
                      //   Object.values(errors.password.types).map((msg, idx) => (
                      //     <p key={idx} className="text-red-500 text-sm">
                      //       {msg}
                      //     </p>
                      // ))}
                      <TextInput
                        {...field}
                        size="sm"
                        required
                        label={FIELD_NAMES[field.name]}
                        error={errors?.[field.name]?.message}
                        className=""
                      />
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
          >
            {isLogin ? "Log in" : "Create Account"}
          </Button>
        </form>
      </Box>

      {formError && (
        <Box className="auth-pages__form-error" mt={"lg"}>
          <Flex align={"center"}>
            <IconInfoCircle />
            <Text size={"xs"} ml={"xs"}>
              {formError}
            </Text>
          </Flex>
        </Box>
      )}

      {errors?.password?.types &&
        Object.values(errors.password.types).map((msg, idx) => (
          <p key={idx} className="text-red-500 text-sm">
            {msg}
          </p>
        ))}

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
