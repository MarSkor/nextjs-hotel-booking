"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheckmark } from "@/components/icons";
import {
  Container,
  Text,
  Flex,
  Group,
  Transition,
  ThemeIcon,
  Button,
  Paper,
  Loader,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { mantineNotify } from "@/lib/mantineNotify";
import { resendEmailVerification } from "@/actions/email";
import { useSession } from "next-auth/react";

const VerifyEmail = ({ status }) => {
  const router = useRouter();
  const { update } = useSession();
  const [internalStatus, setInternalStatus] = useState("verifying");
  const [showVerified, setShowVerified] = useState(false);

  console.log("verify-email STATUS: ", status);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInternalStatus(status);
    }, 1200);

    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status === "success") {
      setShowVerified(true);
      const t = setTimeout(async () => {
        await update();
        router.replace("/account/account-details?email_verified=true");
      }, 2500);

      return () => clearTimeout(t);
    }
  }, [internalStatus, router, update]);

  const statusContent = {
    unauthorized: <Text>You do not have access.</Text>,
    verifying: (
      <>
        <Title order={3}>Verifying your email</Title>
        <Text c="dimmed">This will only take a moment...</Text>
      </>
    ),
    alreadyVerified: <Text>This email has already been verified.</Text>,
    success: (
      <Group spacing="xs">
        <Transition
          mounted={showVerified}
          transition="scale"
          duration={300}
          timingFunction="ease-out"
        >
          {(styles) => (
            <ThemeIcon style={styles} color="green" variant="light">
              <IconCheckmark height={24} width={24} />
            </ThemeIcon>
          )}
        </Transition>
        <Text>Email successfully verified! Redirecting…</Text>
      </Group>
    ),
    expired: (
      <Flex direction={"column"} justify={"center"} align={"center"}>
        <Text mb={"sm"} c="red">
          This verification link is invalid or expired.
        </Text>
        <Group gap={"lg"}>
          <Button variant="light" component={Link} href={"/account"}>
            Return to account
          </Button>
          <Button
            variant="light"
            onClick={async () => {
              await resendEmailVerification();
              mantineNotify.success("Verification email resent");
            }}
          >
            Resend verification email
          </Button>
        </Group>
      </Flex>
    ),
    invalid: <Text c="red">This verification link is no longer valid.</Text>,
    error: (
      <Text mb={"sm"} c="red">
        An unexpected error occurred. Please try again later.
      </Text>
    ),
  };

  return (
    <Container size={"sm"}>
      <Flex direction={"column"} justify={"center"} align={"center"} h={"80vh"}>
        {statusContent[status] || "error"}
        <Flex>
          <Button
            mt={"xl"}
            fullWidth
            onClick={() => router.push("/account/account-details")}
          >
            Back to Account
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default VerifyEmail;
