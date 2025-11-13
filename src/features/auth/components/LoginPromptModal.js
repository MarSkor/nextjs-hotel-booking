"use client";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "@/lib/validations";
import { loginWithCredentials, register } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Modal,
  Text,
  Button,
  Group,
  Stack,
  TextInput,
  Box,
  PasswordInput,
} from "@mantine/core";
import { mantineNotify } from "@/lib/mantineNotify";

const LoginPromptModal = ({ opened, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (opened) setMode(initialMode);
  }, [opened, initialMode]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
      fullName: "",
      password: "",
      email: "",
    },
    mode: "onChange",
    criteriaMode: "all",
  });

  const onSubmit = async (data) => {
    setError("");
    try {
      if (mode === "login") {
        const res = await loginWithCredentials(data);
        if (res?.success) {
          mantineNotify.success(
            mode === "login"
              ? "You have successfully logged in"
              : "You have successfully regisreted with Holidaze."
          );
        }
        if (res?.error) {
          setError("Invalid email or password");
          return;
        }
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.refresh();
        onClose();
        return;
      } else {
        const res = await register(data);
        if (res?.error) {
          setError(res?.error || "Could not register account at this time.");
          return;
        }
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.refresh();
        onClose();
      }
    } catch (error) {
      // console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="sm"
      title={mode === "login" ? "Sign in" : "Sign Up"}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack mb={"lg"}>
          {mode === "signup" && (
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  size="sm"
                  required
                  label="Full Name"
                  placeholder="Enter Full Name"
                  error={errors.fullName?.message}
                />
              )}
            />
          )}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                size="sm"
                required
                label="Email"
                placeholder="Enter Email Address"
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                {...field}
                size="sm"
                required
                label="Password"
                placeholder="Enter Password"
                error={errors.password?.message}
              />
            )}
          />
          {error && (
            <Text size="sm" fw={500} c={"red"}>
              {error}
            </Text>
          )}
        </Stack>

        <Button
          fullWidth
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {mode === "login" ? "Sign in" : "Create Account"}
        </Button>

        <Group mt={"md"}>
          <Text size="sm">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </Text>
          <Button
            type="button"
            variant="subtle"
            size="compact-sm"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};

export default LoginPromptModal;
