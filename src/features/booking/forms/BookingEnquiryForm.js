"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingEnquirySchema } from "@/lib/validations";
import { PLACEHOLDER_IMAGE_PATH } from "@/utils/constants";
import LoginRegisterBanner from "../components/LoginRegisterBanner";
import BookingSummary from "../components/BookingSummary";
import { loadStripe } from "@stripe/stripe-js";
import config from "@/lib/config";
import { pendingBookingData } from "@/utils/Helpers";
import {
  Flex,
  Button,
  Box,
  Paper,
  Text,
  Stepper,
  StepperStep,
  Grid,
  GridCol,
  TextInput,
  Title,
  Loader,
  Textarea,
  Center,
} from "@mantine/core";

const stripePromise = loadStripe(config.env.stripe.publishableKey);

const BookingEnquiry = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bookingData, setBookingData] = useState(pendingBookingData());

  const imagePath = bookingData?.featuredImage || PLACEHOLDER_IMAGE_PATH;
  const totalNights = bookingData
    ? dayjs(bookingData.checkOut).diff(dayjs(bookingData.checkIn), "day")
    : 0;

  useEffect(() => {
    const saved = localStorage.getItem("pendingBooking");
    if (saved) {
      setBookingData(JSON.parse(saved));
    } else {
      router.replace("/");
    }
  }, [router]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      resolver: zodResolver(bookingEnquirySchema),
      name: "",
      email: "",
      message: "",
      phone: "",
    },
    mode: "onChange",
    criteriaMode: "all",
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      reset({
        name: session.user.name || "",
        email: session.user.email || "",
        message: "",
        phone: session.user.phone || "",
      });
    }
  }, [session, status, reset]);

  useEffect(() => {
    if (!bookingData) return;

    const subscription = watch((values) => {
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({ ...bookingData, ...values })
      );
    });
    return () => subscription.unsubscribe();
  }, [bookingData, watch]);

  const onSubmit = async (data) => {
    if (!bookingData) return;
    const stripe = await stripePromise;
    if (!stripe) {
      setError("root", {
        message: "Stripe failed to load. Refresh and try again.",
      });
      return;
    }
    try {
      const res = await fetch("/api/stripe/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingDetails: {
            userId: session?.user?.id || null,
            isGuest: !session?.user,
            ...bookingData,
            ...data,
            totalNights,
          },
        }),
      });

      const sessionData = await res.json();
      if (!res.ok) throw new Error(sessionData.message || "Checkout failed");

      localStorage.removeItem("pendingBooking");
      window.location.href = sessionData.url;
    } catch (error) {
      setError("root", { message: error.message || "Something went wrong." });
    }
  };

  if (status === "loading" || !bookingData) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Box component="article" className="enquiry__wrapper" my={"lg"} pb={"80px"}>
      {/* STEPPER  */}
      <Box className="enquiry__stepper" pb={"lg"}>
        <Stepper size="sm" active={1} breakpoint="sm" orientation="horizontal">
          <StepperStep label="Booking Selection" />
          <StepperStep label="Your Details" />
          <StepperStep label="Checkout" />
        </Stepper>
      </Box>
      <Grid mt={"lg"}>
        <BookingSummary
          imagePath={imagePath}
          bookingData={bookingData}
          totalNights={totalNights}
        />
        <GridCol span={{ base: 12, sm: 8 }}>
          {status === "unauthenticated" && <LoginRegisterBanner />}
          <Paper
            component="section"
            className="enquiry__header"
            p={"md"}
            withBorder
            mt={status === "unauthenticated" ? "md" : 0}
          >
            <Title mb={"lg"}>Enter Your Details</Title>
            {/* ENQUIRY FORM  */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {/* name + email  */}
              <Flex
                mb={"md"}
                gap={"sm"}
                align={"center"}
                direction={{ base: "column", sm: "row" }}
              >
                <Box w={"100%"}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        size="sm"
                        required
                        label={"Full Name"}
                        placeholder="Enter Full Name"
                        error={errors.name?.message}
                      />
                    )}
                  />
                </Box>
                <Box w={"100%"}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        size="sm"
                        required
                        label={"Email"}
                        placeholder="Enter Email"
                        error={errors.email?.message}
                      />
                    )}
                  />
                </Box>
              </Flex>
              {/* phone  */}
              <Flex
                mb={"md"}
                gap={"sm"}
                align={"center"}
                direction={{ base: "column", sm: "row" }}
              >
                <Box w={"100%"}>
                  <Controller
                    name="phone"
                    control={control}
                    required
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        size="sm"
                        required
                        label={"Phone Number"}
                        placeholder="Enter Phone Number"
                        error={errors.phone?.message}
                      />
                    )}
                  />
                </Box>
              </Flex>
              {/* message  */}
              <Box w={"100%"}>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      size="sm"
                      label={"Message"}
                      placeholder="Your message"
                      error={errors.message?.message}
                      autosize
                      minRows={4}
                      maxRows={6}
                    />
                  )}
                />
              </Box>
              {errors.root && (
                <Box>
                  <Text c="red" fz="sm">
                    {errors.root.message}
                  </Text>
                </Box>
              )}
              {/* button group  */}
              <Flex justify="space-between" mt={"lg"}>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/accommodation/${bookingData.slug}`)
                  }
                >
                  Go Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Next: Checkout
                </Button>
              </Flex>
            </Box>
          </Paper>
        </GridCol>
      </Grid>
    </Box>
  );
};

export default BookingEnquiry;
