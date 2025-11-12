"use client";
import { useState, useEffect } from "react";
import { DatePickerInput } from "@mantine/dates";
import { Flex, Button, Box, Paper, Text, Badge } from "@mantine/core";
import { IconCheckIn, IconCheckOut, IconUser } from "@/components/icons";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { bookingSchema } from "@/lib/validations";
import { calculateBookingPrice } from "@/utils/Helpers";
import { getBookingDates } from "@/actions/booking";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const Booking = ({ accommodation }) => {
  const [blockedDates, setBlockedDates] = useState([]);
  const router = useRouter();
  const today = dayjs().startOf("day");

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: null,
      checkOut: null,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const totalPrice = calculateBookingPrice(
    checkIn,
    checkOut,
    accommodation.pricePerNight
  );

  useEffect(() => {
    (async () => {
      const dates = await getBookingDates(accommodation.id);
      setBlockedDates(dates);
    })();
  }, [accommodation.id]);

  const formattedBookedDates = (date) => {
    return blockedDates.some(({ from, to }) => {
      const startDate = dayjs(from).startOf("day");
      const endDate = dayjs(to).startOf("day");
      return dayjs(date).isBetween(startDate, endDate, "day", "[]");
    });
  };

  const onSubmit = (data) => {
    try {
      if (!data.checkIn || !data.checkOut) {
        return setError("root", {
          type: "manual",
          message: "Select both check-in and check-out dates to continue.",
        });
      }
      const dateOverlap = blockedDates.some(
        ({ from, to }) =>
          dayjs(checkIn).isBefore(to, "day") &&
          dayjs(checkOut).isAfter(from, "day")
      );
      if (dateOverlap) {
        return setError("checkIn", {
          type: "manual",
          message:
            "The selected dates overlap with existing booking. Please choose different dates.",
        });
      }
      const bookingData = {
        accommodationId: accommodation.id,
        slug: accommodation.slug,
        title: accommodation.title,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        totalPrice,
        guests: accommodation.guests,
        featuredImage:
          accommodation.featuredImage?.filePath ||
          accommodation.featuredImage ||
          null,
        averageRating: accommodation.averageRating,
        street: accommodation.street,
      };

      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      router.push(`/booking/enquiry?accommodation_id=${accommodation.id}`);
    } catch (error) {
      return setError("root", {
        type: "manual",
        message:
          "Could not reserve booking at this time. Please try again later.",
      });
    }
  };

  return (
    <Paper radius={"sm"} className="details__booking-body" w={"100%"} p={"md"}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Flex direction={"column"} justify={"space-between"}>
          {/* CHECK IN  */}
          <Box mb={"sm"}>
            <Controller
              control={control}
              name="checkIn"
              rules={{ required: "Check-in date is required" }}
              render={({ field }) => (
                <DatePickerInput
                  {...field}
                  w={"100%"}
                  size="md"
                  label="Check-in"
                  clearable
                  placeholder="Select Check In Date"
                  value={field.value}
                  valueFormat="dddd, DD/MM/YY"
                  minDate={dayjs().startOf("day").toDate()}
                  onChange={(date) => {
                    field.onChange(date);
                    if (checkOut && dayjs(date).isAfter(checkOut)) {
                      field.onChange(date);
                    }
                  }}
                  excludeDate={(date) =>
                    formattedBookedDates(date) ||
                    dayjs(date).isBefore(today, "day")
                  }
                  leftSection={
                    <IconCheckIn
                      color="var(--clr-gray-6)"
                      height={20}
                      width={20}
                      stroke={1.5}
                    />
                  }
                  leftSectionPointerEvents="none"
                  error={errors.checkIn?.message}
                  classNames={{
                    input: "booking-section__form--input",
                    label: "booking-section__form--label",
                  }}
                />
              )}
            />
          </Box>
          {/* CHECK OUT  */}
          <Box mb={"sm"}>
            <Controller
              control={control}
              name="checkOut"
              rules={{ required: "Check-out date is required" }}
              render={({ field }) => (
                <DatePickerInput
                  {...field}
                  w={"100%"}
                  size="md"
                  label="Check out"
                  clearable
                  placeholder="Select Check Out Date"
                  value={field.value}
                  valueFormat="dddd, DD/MM/YY"
                  onChange={(date) => field.onChange(date)}
                  minDate={
                    checkIn
                      ? dayjs(checkIn).add(1, "day").toDate()
                      : dayjs().toDate()
                  }
                  excludeDate={(date) =>
                    dayjs(date).isBefore(dayjs(checkIn), "day") ||
                    formattedBookedDates(date)
                  }
                  leftSection={
                    <IconCheckOut
                      color="var(--clr-gray-6)"
                      height={20}
                      width={20}
                      stroke={1.5}
                    />
                  }
                  error={errors.checkOut?.message}
                  classNames={{
                    input: "booking-section__form--input",
                    label: "booking-section__form--label",
                  }}
                />
              )}
            />
          </Box>
          {errors.root && (
            <Text c="red" mt="sm">
              {errors.root.message}
            </Text>
          )}
          <Box mb={"sm"}>
            <Text size="xs" fw={600} c={"var(--clr-brown-2)"} mb={"xs"}>
              Number of Guests
            </Text>
            <Flex align={"center"}>
              <IconUser color={"var(--clr-brown-2)"} />
              <Badge size="lg" ml="xs" variant="light">
                {accommodation.guests}
              </Badge>
            </Flex>
          </Box>

          <Flex mt="sm">
            <Button
              size="md"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              fullWidth
              type="submit"
            >
              Reserve Now
            </Button>
          </Flex>
        </Flex>
      </Box>
      {totalPrice > 0 && (
        <Box mt={"md"}>
          <Flex align={"center"} justify={"space-between"}>
            <Text fw={500} size="md">
              Total Price
            </Text>
            <Text fw={500} size="md">
              $ {totalPrice}
            </Text>
          </Flex>
        </Box>
      )}
    </Paper>
  );
};

export default Booking;
