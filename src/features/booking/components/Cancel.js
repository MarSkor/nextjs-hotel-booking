"use client";
import React, { useEffect } from "react";
import { cancelBooking } from "@/actions/booking";
import { Container, Flex, Box, Title, Text, Anchor } from "@mantine/core";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Cancel = () => {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");

  useEffect(() => {
    if (!bookingId) return;

    const pendingBooking = JSON.parse(
      localStorage.getItem("pendingBooking" || "{}")
    );

    if (bookingId && pendingBooking?.accommodationId) {
      fetch(`/api/booking/cancel?bookingId=${bookingId}`, {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      });
    }

    localStorage.removeItem("pendingBooking");
  }, []);

  return (
    <Container component={"section"} size={"sm"}>
      <Flex direction={"column"} justify={"center"} align={"center"} h={"80vh"}>
        <Title>Booking Cancelled</Title>
        <Text mt={"md"} ta="center">
          Your booking session was not finalized and have been cancelled.
        </Text>
        <Box mt={"sm"} mb={"md"}>
          <Anchor component={Link} href={"/"} underline="always">
            Go back home
          </Anchor>
        </Box>
      </Flex>
    </Container>
  );
};

export default Cancel;
