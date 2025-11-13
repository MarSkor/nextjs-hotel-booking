"use client";
import React, { useEffect } from "react";
import { cancelBooking } from "@/actions/booking";
import { Container, Flex, Box, Title, Text, Anchor } from "@mantine/core";
import Link from "next/link";

const Cancel = () => {
  useEffect(() => {
    const pendingBooking = JSON.parse(
      localStorage.getItem("pendingBooking" || "{}")
    );

    if (pendingBooking?.accommodationId) {
      cancelBooking(pendingBooking.accommodationId);
      localStorage.removeItem("pendingBooking");
    }
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
