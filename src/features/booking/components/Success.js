"use client";
import React, { useState, useEffect } from "react";
import { Container, Flex, Text, Title, Anchor, Paper } from "@mantine/core";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Success = ({ customerEmail, sessionId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/booking/success?session_id=${sessionId}`);
        const data = await res.json();

        if (data.success && data.booking?.isPaid) {
          setBooking(data.booking);
          setLoading(false);
        }
        localStorage.removeItem("pendingBooking");
      } catch (error) {
        console.error("An error occured:", error);
      }
    })();
  }, [sessionId, router]);

  if (loading) {
    return (
      <Flex justify={"center"} align={"center"} h={"80vh"}>
        <Title order={2}>Payment still processing...</Title>
      </Flex>
    );
  }

  return (
    <Container component={"section"} size={"sm"}>
      <Flex direction={"column"} justify={"center"} align={"center"} h={"80vh"}>
        <Title mb={"md"}>Success</Title>
        <Text ta="center">
          A confirmation email will be sent to{" "}
          <Text span fw={500}>
            {customerEmail}
          </Text>
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
        <Paper withBorder maw={500} mt={"lg"}>
          <Title ta={"center"}>{booking.title}</Title>
        </Paper>
      </Flex>
    </Container>
  );
};

export default Success;
