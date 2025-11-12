"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingEnquirySchema } from "@/lib/validations";
import { createBooking } from "@/actions/booking";
import LoginPromptModal from "@/features/auth/components/LoginPromptModal";
import { PLACEHOLDER_IMAGE_PATH } from "@/utils/constants";
import {
  Flex,
  Button,
  Box,
  Paper,
  Text,
  Stepper,
  StepperStep,
  Container,
  Grid,
  GridCol,
  TextInput,
  Title,
  Divider,
  Loader,
  Textarea,
} from "@mantine/core";

const BookingEnquiry = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bookingData, setBookingData] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [authMode, setAuthMode] = useState("login");

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

  const watchForm = watch();

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

  useEffect(() => {
    if (initialized && !bookingData?.accommodationId) {
      router.push("/");
    }
  }, [initialized, bookingData, router]);

  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name || "");
      setValue("email", session.user.email || "");
      if (session.user.phone) setValue("phone", session.user.phone);
    }
  }, [session, setValue]);

  useEffect(() => {
    const subscription = watch((values) => {
      if (bookingData) {
        const updatedData = { ...bookingData, ...values };
        localStorage.setItem("pendingBooking", JSON.stringify(updatedData));
      }
    });
    return () => subscription.unsubscribe();
  }, [watchForm, bookingData]);

  const handleGoBack = () => {
    if (!bookingData?.accommodationId) return router.push("/");
    router.push(`/accommodation/${bookingData.slug}`);
  };

  const onSubmit = async (data) => {
    if (!bookingData) return;

    try {
      const res = await createBooking({
        userId: session?.user?.id || null,
        isGuest: !session?.user,
        name: session?.user?.name || data.name,
        email: session?.user?.email || data.email,
        title: bookingData.title,
        accommodationId: bookingData.accommodationId,
        checkIn: new Date(bookingData.checkIn),
        checkOut: new Date(bookingData.checkOut),
        guests: bookingData.guests,
        message: data.message,
        phone: data.phone,
        totalPrice: bookingData.totalPrice,
        totalNights,
      });

      if (res?.url) {
        localStorage.removeItem("pendingBooking");
        router.push(res.url);
      }
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
    <Container size={"md"}>
      <Box
        component="article"
        className="enquiry__wrapper"
        my={"lg"}
        pb={"80px"}
      >
        {/* STEPPER  */}
        <Box className="enquiry__stepper" pb={"lg"}>
          <Stepper
            size="sm"
            active={1}
            breakpoint="sm"
            orientation="horizontal"
          >
            <StepperStep label="Booking Selection" />
            <StepperStep label="Your Details" />
            <StepperStep label="Checkout" />
          </Stepper>
        </Box>
        <Grid mt={"lg"}>
          {/* BOOKING SUMMARY  */}
          <GridCol span={{ base: 12, sm: 4 }}>
            <Paper withBorder>
              {/* image  */}
              <Box
                style={{
                  width: "100%",
                  position: "relative",
                  height: 150,
                  overflow: "hidden",
                }}
              >
                <IKImage
                  alt="Accommodation Booking Cover"
                  path={imagePath}
                  urlEndpoint={config.env.imagekit.urlEndpoint}
                  fill
                  loading="lazy"
                  lqip={{ active: true }}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  transformation={[
                    { width: "1200", height: "400", crop: "maintain_ratio" },
                  ]}
                />
              </Box>
              {/* details  */}
              <Box p={"md"}>
                <Title tt="capitalize" order={3} mb={"sm"}>
                  {bookingData?.title}
                </Title>
                <Flex align={"center"} justify={"space-between"}>
                  <Text fw={500}>Check In:</Text>{" "}
                  <Text>{dayjs(bookingData.checkIn).format("DD/MM/YYYY")}</Text>
                </Flex>
                <Flex my={"xs"} align={"center"} justify={"space-between"}>
                  <Text fw={500}>Check Out:</Text>{" "}
                  <Text>
                    {dayjs(bookingData.checkOut).format("DD/MM/YYYY")}
                  </Text>
                </Flex>
                <Flex my={"xs"} align={"center"} justify={"space-between"}>
                  <Text fw={500}>Total Nights:</Text> <Text>{totalNights}</Text>
                </Flex>
                <Flex align={"center"} justify={"space-between"}>
                  <Text fw={500}>Number of guests:</Text>{" "}
                  <Text>{bookingData.guests}</Text>
                </Flex>
              </Box>
            </Paper>
            <Paper withBorder p={"md"} mt={"sm"}>
              <Flex align={"center"} justify={"space-between"}>
                <Text span fw={500}>
                  Total Price:
                </Text>{" "}
                <Text>${bookingData?.totalPrice}</Text>
              </Flex>
            </Paper>
          </GridCol>
          {/* ENQUIRY FORM  */}
          <GridCol span={{ base: 12, sm: 8 }}>
            <Paper
              component="section"
              className="enquiry__header"
              p={"md"}
              withBorder
            >
              {!session?.user && (
                <Flex>
                  <Text size="sm">
                    <Text
                      span
                      fw={500}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setAuthMode("login");
                        setShowLoginPrompt(true);
                      }}
                    >
                      Log in
                    </Text>{" "}
                    to book with your saved details or{" "}
                    <Text
                      span
                      fw={500}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setAuthMode("signup");
                        setShowLoginPrompt(true);
                      }}
                    >
                      register
                    </Text>{" "}
                    to manage your bookings.
                  </Text>
                  <Divider my={"md"} />
                </Flex>
              )}
              <Title mb={"lg"}>Enter Your Details</Title>
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
                  <Button variant="outline" onClick={handleGoBack}>
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

        <LoginPromptModal
          opened={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          initialMode={authMode}
        />
      </Box>
    </Container>
  );
};

export default BookingEnquiry;
