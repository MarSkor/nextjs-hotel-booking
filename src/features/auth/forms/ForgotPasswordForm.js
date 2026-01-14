"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { codeSchema, emailSchema } from "@/lib/validations";
import { mantineNotify } from "@/lib/mantineNotify";
import { useRouter } from "next/navigation";
import { Activity, useEffect, useState } from "react";
import Link from "next/link";
import {
  Anchor,
  Box,
  Button,
  Flex,
  Paper,
  PinInput,
  Text,
  TextInput,
  Title,
  Transition,
} from "@mantine/core";
import { IconArrowLeft02 } from "@/components/icons";
import { sendPasswordResetPin, verifyPin } from "@/actions/password";

const ForgotPasswordForm = () => {
  const [step, setStep] = useState("EMAIL");
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(step === "EMAIL" ? emailSchema : codeSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (step === "EMAIL") {
        const res = await sendPasswordResetPin(data.email);

        if (res.success || res.status === "SUCCESS") {
          setEmail(data.email);

          reset(
            { email: data.email, code: "" },
            { keepValues: false, keepIsSubmitted: false, keepDirty: false }
          );
          setStep("CODE");
        } else {
          mantineNotify.error(res.error || "Email not found.");
        }
      } else if (step === "CODE") {
        const res = await verifyPin({ email, pin: data.code });
        if (res.success || res.status === "SUCCESS") {
          router.replace(`/reset-password?email=${email}&token=${res.token}`);
        } else {
          setError("code", { message: "Invalid or expired code." });
        }
      }
    } catch (error) {
      mantineNotify.error("An error occurred.");
    }
  };

  return (
    <Flex className="auth-pages__form" direction={"column"}>
      <Box className="auth-pages__auth-heading" mb={"md"}>
        <Title order={1} size={"h2"} className="auth-pages__title" mb={"sm"}>
          {step === "EMAIL" ? "Forgot Password?" : "Enter Verification Code"}
        </Title>
        <Text size="sm">
          {step === "EMAIL"
            ? "No worries, we'll send you reset instructions."
            : `We sent a 6-digit code to ${email}`}
        </Text>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box style={{ position: "relative", minHeight: "120px" }}>
          <Transition
            mounted={step === "EMAIL"}
            transition="pop"
            duration={300}
            timingFunction="ease"
          >
            {(styles) => (
              <Box style={styles}>
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  error={errors.email?.message}
                />
                <Button
                  mt={"lg"}
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                >
                  Reset Password
                </Button>
              </Box>
            )}
          </Transition>
          <Transition
            mounted={step === "CODE"}
            transition="pop"
            duration={300}
            timingFunction="ease"
          >
            {(styles) => (
              <Box style={styles}>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <>
                      <PinInput
                        {...field}
                        size="xl"
                        length={6}
                        type="number"
                        disabled={isSubmitting}
                        error={!!errors.code && field.value.length > 0}
                        autoFocus
                      />
                      {errors.code && field.value.length > 0 && (
                        <Text c="red" size="xs" w="100%" mt={5}>
                          {errors.code.message}
                        </Text>
                      )}
                    </>
                  )}
                />
                <Button
                  mt={"lg"}
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                >
                  Continue
                </Button>
                <Button
                  variant="light"
                  mt={"lg"}
                  type="button"
                  fullWidth
                  mb={"lg"}
                  // onClick={handleResend}
                  // disabled={cooldown > 0}
                >
                  {/* Resend code {cooldown > 0 && `(${cooldown}s)`} */}
                  Resend Code
                </Button>
              </Box>
            )}
          </Transition>
        </Box>
      </form>
      <Box mt={"md"}>
        <Button
          fullWidth
          variant="subtle"
          component={Link}
          href={"/login"}
          leftSection={<IconArrowLeft02 />}
        >
          Back to login
        </Button>
      </Box>
    </Flex>
  );
};

export default ForgotPasswordForm;
