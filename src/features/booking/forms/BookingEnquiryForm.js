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
} from "@mantine/core";

const stripePromise = loadStripe(config.env.stripe.publishableKey);

const BookingEnquiry = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const imagePath = bookingData?.featuredImage || PLACEHOLDER_IMAGE_PATH;
  const parseCheckIn = dayjs(bookingData?.checkIn);
  const parseCheckOut = dayjs(bookingData?.checkOut);
  const totalNights = parseCheckOut.diff(parseCheckIn, "day");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      resolver: zodResolver(bookingEnquirySchema),
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      message: "",
      phone: session?.user?.phone || "",
    },
    mode: "onChange",
    criteriaMode: "all",
  });
  // console.log("form errors: ", errors);

  const watchForm = watch();

  // get booking data from local storage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedBookingData = JSON.parse(
      localStorage.getItem("pendingBooking") || "{}"
    );

    if (!savedBookingData?.accommodationId) {
      setInitialized(true);
      return;
    }

    if (savedBookingData.checkIn)
      savedBookingData.checkIn = new Date(savedBookingData.checkIn);
    if (savedBookingData.checkOut)
      savedBookingData.checkOut = new Date(savedBookingData.checkOut);

    setBookingData(savedBookingData);
    setInitialized(true);
  }, [router]);

  // if initialized and no accommodationId push to home
  useEffect(() => {
    if (initialized && !bookingData?.accommodationId) {
      router.push("/");
    }
  }, [initialized, bookingData, router]);

  // set form values if they exists
  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name || "");
      setValue("email", session.user.email || "");
      if (session.user.phone) setValue("phone", session.user.phone);
    }
  }, [session, setValue]);

  // persist data when signing in/signing up
  useEffect(() => {
    const subscription = watch((values) => {
      if (bookingData) {
        const updatedData = { ...bookingData, ...values };
        localStorage.setItem("pendingBooking", JSON.stringify(updatedData));
      }
    });
    return () => subscription.unsubscribe();
  }, [watchForm, bookingData]);

  const onSubmit = async (data) => {
    if (!bookingData) return;

    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe failed to load");
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingDetails: {
            userId: session?.user?.id || null,
            isGuest: !session?.user,
            name: session?.user?.name || data.name,
            email: data.email,
            title: bookingData.title,
            accommodationId: bookingData.accommodationId,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            guests: bookingData.guests,
            message: data.message,
            phone: data.phone,
            totalPrice: bookingData.totalPrice,
            totalNights,
          },
        }),
      });

      const sessionData = await res.json();
      if (!res.ok) {
        console.error("API Error:", sessionData);
        return;
      }

      if (!sessionData.sessionId) {
        console.error("Missing sessionId:", sessionData);
        return;
      }

      localStorage.removeItem("pendingBooking");
      window.location.href = sessionData.url;
    } catch (error) {
      setError("root", {
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  if (!initialized || status === "loading") {
    return (
      <Flex justify="center" align="center" h="80vh">
        <Loader size="lg" />
      </Flex>
    );
  }

  if (!bookingData) return null;

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
          {!session.user && <LoginRegisterBanner />}
          <Paper
            component="section"
            className="enquiry__header"
            p={"md"}
            withBorder
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
