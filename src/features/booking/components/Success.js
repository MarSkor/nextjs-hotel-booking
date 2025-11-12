"use client";
import React, { useState, useEffect } from "react";
import { Container, Flex, Text, Title, Anchor } from "@mantine/core";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Success = ({ customerEmail, sessionId }) => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState("Verifying payment...");

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }
    (async () => {
      const res = await fetch(
        `/api/stripe/verify-checkout?session_id=${sessionId}`
      );
      const data = await res.json();
      if (data.success) {
        setPaymentStatus("Payment Confirmed!", data);
      } else {
        setPaymentStatus("Payment failed.");
      }
    })();
  }, [sessionId, router]);
  return (
    <Container component={"section"} size={"sm"}>
      <Flex direction={"column"} justify={"center"} align={"center"} h={"80vh"}>
        <Title>Success!</Title>
        <Text fw={500} mt={"md"} mb={"md"} ta="center">
          {paymentStatus}
        </Text>
        <Text ta="center">
          A confirmation email will be sent to{" "}
          <Text span fw={500}>
            {customerEmail}
          </Text>
          .
        </Text>
        <Flex
          align={"center"}
          mt={"sm"}
          mb={"md"}
          direction={{ base: "column", sm: "row" }}
        >
          <Text mr={"4px"}>If you have any questions, please email </Text>
          <Anchor component={Link} href="mailto:holidaze@example.com">
            holidaze@example.com
          </Anchor>
        </Flex>

        <Anchor component={Link} href={"/"} underline="always">
          Go back home
        </Anchor>
      </Flex>
    </Container>
  );
};

export default Success;
