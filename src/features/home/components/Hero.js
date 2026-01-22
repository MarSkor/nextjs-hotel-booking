"use client";
import { guestAmount, propertyType } from "@/utils/constants";
import { buildSearchParams } from "@/utils/Helpers";
import {
  Container,
  Text,
  Title,
  Overlay,
  Flex,
  Button,
  Box,
  Select,
  Grid,
  GridCol,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";

const Hero = () => {
  const router = useRouter();
  const [type, setType] = useState(null);
  const [guests, setGuests] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [hasAttemptedSearch, setHasAttemptedSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!type) {
      setHasAttemptedSearch(true);
      return;
    }

    const query = buildSearchParams({
      type: type !== "all" ? type : null,
      guests: guests !== "all" ? guests : null,
      checkIn: checkIn,
      checkOut: checkOut,
    });
    router.push(`/accommodation?${query}`);
  };

  return (
    <section className="home-hero__wrapper">
      <Overlay color="#000" opacity={0.95} zIndex={1} />

      <div className="home-hero__inner">
        <Container size={840} mb={"lg"}>
          <Text size="lg" className="home-hero__description">
            Explore, Book, and
            <span className="home-hero__description--highlight"> Relax </span>
            in Bergen, Norway.
          </Text>
          <Title order={1} className="home-hero__inner--title">
            Elevate your holidays with Holidaze.
          </Title>
        </Container>

        <Container
          component={"section"}
          className={`bsf-section bsf-section-home`}
          size="md"
        >
          <form onSubmit={handleSearch}>
            <Grid align="center">
              <GridCol span={{ base: 12, md: 3 }}>
                <Flex
                  classNames={`booking-section-home__form--field`}
                  align={"center"}
                  w={"100%"}
                >
                  <Select
                    clearable
                    w={"100%"}
                    label="Property Type"
                    placeholder="Select Property"
                    data={propertyType}
                    value={type}
                    onChange={(val) => {
                      setType(val);
                      setHasAttemptedSearch(false);
                    }}
                    error={
                      hasAttemptedSearch && !type
                        ? "Please select a property type"
                        : null
                    }
                    classNames={{
                      input: "booking-section__form--input",
                      label: "booking-section__form--label",
                    }}
                  />
                </Flex>
              </GridCol>
              <GridCol span={{ base: 12, md: 5 }}>
                <Flex
                  classNames={`booking-section-home__form--field`}
                  align={"center"}
                  w={"100%"}
                >
                  <Flex direction={{ base: "column", xs: "row" }} w={"100%"}>
                    <Box mr={"sm"} w={"100%"}>
                      <DatePickerInput
                        label="Check in"
                        clearable
                        value={checkIn}
                        onChange={setCheckIn}
                        minDate={dayjs().startOf("day").toDate()}
                        valueFormat="ddd, MM/DD/YY"
                        placeholder="--/--/--"
                        getDayProps={(date) => {
                          if (dayjs(date).isSame(dayjs(), "day")) {
                            return {
                              style: {
                                backgroundColor:
                                  "var(--mantine-color-blue-light)",
                                color: "var(--mantine-color-blue-filled)",
                                fontWeight: 700,
                                border:
                                  "1px solid var(--mantine-color-blue-filled)",
                              },
                            };
                          }
                          return {};
                        }}
                        classNames={{
                          input: "booking-section__form--input",
                          label: "booking-section__form--label",
                        }}
                      />
                    </Box>
                    <Box w={"100%"}>
                      <DatePickerInput
                        label="Check out"
                        clearable
                        value={checkOut}
                        onChange={setCheckOut}
                        minDate={
                          checkIn
                            ? dayjs(checkIn).add(1, "day").toDate()
                            : dayjs().toDate()
                        }
                        valueFormat="ddd, MM/DD/YY"
                        placeholder="--/--/--"
                        getDayProps={(date) => {
                          if (dayjs(date).isSame(dayjs(), "day")) {
                            return {
                              style: {
                                backgroundColor:
                                  "var(--mantine-color-blue-light)",
                                color: "var(--mantine-color-blue-filled)",
                                fontWeight: 700,
                                border:
                                  "1px solid var(--mantine-color-blue-filled)",
                              },
                            };
                          }
                          return {};
                        }}
                        classNames={{
                          input: "booking-section__form--input",
                          label: "booking-section__form--label",
                        }}
                      />
                    </Box>
                  </Flex>
                </Flex>
              </GridCol>

              <GridCol span={{ base: 12, md: "auto" }}>
                <Flex
                  classNames={`booking-section-home__form--field`}
                  align={"center"}
                  justify={"center"}
                  w={"100%"}
                >
                  <Select
                    w={"100%"}
                    label="Guests"
                    placeholder="Guests"
                    data={guestAmount}
                    value={guests}
                    onChange={setGuests}
                    classNames={{
                      input: "booking-section__form--input",
                      label: "booking-section__form--label",
                    }}
                  />
                </Flex>
              </GridCol>
              <GridCol span={{ base: 12, md: "content" }}>
                <Button type="submit">Search</Button>
              </GridCol>
            </Grid>
          </form>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
