"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheckmark } from "@/components/icons";
import {
  Container,
  Text,
  Loader,
  Flex,
  Group,
  Transition,
  ThemeIcon,
  Button,
} from "@mantine/core";
import Link from "next/link";

const VerifyEmail = ({ status }) => {
  const router = useRouter();
  const [showVerified, setShowVerified] = useState(false);

  useEffect(() => {
    if (status === "success") {
      setShowVerified(true);
      const t = setTimeout(() => {
        router.replace("/account/account-details?email_verified=true");
      }, 1500);

      return () => clearTimeout(t);
    }
  }, [status, router]);

  const statusContent = {
    loading: <Loader />,
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
    error: (
      <Flex direction={"column"} justify={"center"} align={"center"}>
        <Text mb={"sm"} c="red">
          This verification link is invalid or expired.
        </Text>
        <Button variant="light" component={Link} href={"/account"}>
          Return to account
        </Button>
      </Flex>
    ),
  };

  return (
    <Container size={"sm"}>
      <Flex direction={"column"} justify={"center"} align={"center"} h={"80vh"}>
        {statusContent[status]}
      </Flex>
    </Container>
  );
};

export default VerifyEmail;
