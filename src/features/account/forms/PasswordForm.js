"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { mantineNotify } from "@/lib/mantineNotify";
import {
  Paper,
  Flex,
  Button,
  PasswordInput,
  Container,
  Anchor,
  Title,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/validations";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Success from "@/features/auth/components/Success";
import { useRouter, useSearchParams } from "next/navigation";

const PasswordForm = ({ mode, handleFormOnSubmit }) => {
  const [success, setSuccess] = useState(false);
  const [{ toggle }] = useDisclosure(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const isChangeMode = mode === "CHANGE_PASSWORD";

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...payload } = data;
      const res = await handleFormOnSubmit({ ...payload, token, email });

      switch (res.status) {
        case "SUCCESS":
          reset();
          setSuccess(true);
          if (isChangeMode) {
            mantineNotify.success(
              "Your password has been updated. Logging out..."
            );
            setTimeout(async () => {
              await signOut({
                callbackUrl: "/login?password_changed=true",
              });
            }, 2500);
          } else {
            mantineNotify.success("Password reset successful!");
            setTimeout(() => {
              router.replace("/login");
            }, 3000);
          }
          break;

        case "FORBIDDEN":
          mantineNotify.error("Your current password is incorrect");
          setError("oldPassword", {
            type: "manual",
            message: "The current password you entered is incorrect.",
          });
          break;

        case "EXPIRED":
          mantineNotify.error("This reset link has expired.");
          break;

        default:
          setError("root.serverError", {
            message: "Something went wrong. Please try again later.",
          });
      }
    } catch (error) {
      setError("root.serverError", {
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  if (success) return <Success isChangeMode={isChangeMode} />;

  return (
    <Container size={420}>
      <Paper p="md">
        <Title order={2} ta={"center"} mb={"lg"}>
          {isChangeMode ? "Change Password" : "Reset Password"}
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <PasswordInput
              mb={"sm"}
              flex={1}
              label="Old Password"
              placeholder="Your current password"
              onVisibilityChange={toggle}
              {...register("oldPassword", { required: true })}
              error={errors.oldPassword?.message}
            />

            <PasswordInput
              mb={"sm"}
              flex={1}
              label="New Password"
              placeholder="Min. 8 characters"
              onVisibilityChange={toggle}
              {...register("newPassword", { required: true })}
              error={errors.newPassword?.message}
              onPaste={(e) => e.preventDefault()}
            />

            <PasswordInput
              mb="md"
              label="Confirm New Password"
              placeholder="Repeat new password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              onVisibilityChange={toggle}
              onPaste={(e) => e.preventDefault()}
            />
          </Stack>
          {errors.root?.serverError && (
            <Text fw={500} c="red" size="sm">
              {errors.root.serverError.message}
            </Text>
          )}

          <Flex justify={"center"} mt={"xl"} direction={"column"}>
            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth={!isChangeMode}
            >
              {isChangeMode ? "Update Password" : "Set New Password"}
            </Button>
            {!isChangeMode && (
              <Anchor
                mt={"lg"}
                ta={"center"}
                component={Link}
                href={"/login"}
                size="sm"
              >
                Return to login
              </Anchor>
            )}
            {isChangeMode && (
              <Anchor
                mt={"lg"}
                ta={"center"}
                component={Link}
                href={"/account/account-details"}
                size="sm"
              >
                Return to Account Details
              </Anchor>
            )}
          </Flex>
        </form>
      </Paper>
    </Container>
  );
};

export default PasswordForm;
