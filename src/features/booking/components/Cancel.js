"use client";
import React, { useEffect, useState } from "react";
import { Container, Flex, Box, Title, Text, Anchor } from "@mantine/core";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Cancel = () => {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");
  const [status, setStatus] = useState("Processing cancellation...");

  useEffect(() => {
    if (!bookingId) {
      setStatus("Missing Booking ID");
      return;
    }

    fetch(`/api/booking/cancel?bookingId=${bookingId}`, {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    })
      .then(() =>
        setStatus(
          " Your booking session was not finalized and have been cancelled."
        )
      )
      .catch(() => setStatus("Failed to cancel booking."));

    localStorage.removeItem("pendingBooking");
  }, [bookingId]);

  return (
    <Container component={"section"} size={"sm"}>
      <Flex direction={"column"} justify={"center"} align={"center"} h={"80vh"}>
        <Title>Booking Cancelled</Title>
        <Text mt={"md"} ta="center">
          {status}
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
