"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { DatePickerInput } from "@mantine/dates";
import { Card } from "@/components/ui";
import { propertyType, guestAmount, sortByData } from "@/utils/constants";
import { buildSearchParams } from "@/utils/Helpers";
import {
  Box,
  Container,
  Flex,
  Text,
  Title,
  SimpleGrid,
  Select,
  Pagination,
  Grid,
  GridCol,
  Button,
} from "@mantine/core";
import { isDate } from "@/utils/date";
import dayjs from "dayjs";

const Accommodations = ({ accList, totalPages, totalCount }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [guests, setGuests] = useState(searchParams.get("guests") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "price_asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [checkIn, setCheckIn] = useState(
    isDate(searchParams.get("checkIn"), { asNative: true }),
  );
  const [checkOut, setCheckOut] = useState(
    isDate(searchParams.get("checkOut"), { asNative: true }),
  );

  useEffect(() => {
    const query = buildSearchParams({
      type: type !== "all" ? type : null,
      guests: guests !== "all" ? guests : null,
      sort: sort !== "price_asc" ? sort : null,
      page: page > 1 ? page : null,
      checkIn: checkIn ? dayjs(checkIn).format("YYYY-MM-DD") : null,
      checkOut: checkOut ? dayjs(checkOut).format("YYYY-MM-DD") : null,
    });
    const newUrl = `?${query}`;
    if (window.location.search !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [type, guests, sort, page, checkIn, checkOut, router]);

  return (
    <Container
      component="section"
      size="lg"
      className="accommodations-container"
      mt="lg"
      mb="lg"
    >
      <Flex
        direction={"column"}
        mt={"xl"}
        mb={"xl"}
        justify={"center"}
        className="accommodations-header__top-header"
      >
        <Title className="accommodations-header__top-header--title" order={1}>
          Find the right stay for you
        </Title>
        {/*----- search field -----*/}
        <Box mt={"xl"}>
          <Container
            component={"section"}
            className={`bsf-section bsf-section-acs`}
            fluid
          >
            <form>
              <Grid align="center">
                <GridCol span={{ base: 12, md: 3 }}>
                  <Flex
                    classNames={`booking-section-acs__form--field`}
                    align={"center"}
                    w={"100%"}
                  >
                    <Select
                      clearable
                      w={"100%"}
                      classNames={{
                        input: "booking-section__form--input",
                        label: "booking-section__form--label",
                      }}
                      label="Property Type"
                      placeholder="Select Property"
                      value={type}
                      onChange={(value) => {
                        setType(value);
                        setPage(1);
                      }}
                      data={propertyType}
                    />
                  </Flex>
                </GridCol>
                <GridCol span={{ base: 12, md: 5 }}>
                  <Flex
                    classNames={`booking-section-acs__form--field`}
                    align={"center"}
                    w={"100%"}
                  >
                    <Flex direction={{ base: "column", xs: "row" }} w={"100%"}>
                      <Box mr={"sm"} w={"100%"}>
                        <DatePickerInput
                          label="Check in"
                          clearable
                          value={checkIn}
                          minDate={dayjs().startOf("day").toDate()}
                          onChange={(val) => {
                            setCheckIn(val);
                            setPage(1);
                            if (
                              checkOut &&
                              val &&
                              !dayjs(val).isBefore(dayjs(checkOut), "day")
                            ) {
                              setCheckOut(null);
                            }
                          }}
                          valueFormat="ddd, MM/DD/YY"
                          placeholder="--/--/--"
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
                          onChange={(val) => {
                            setCheckOut(val);
                            setPage(1);
                          }}
                          minDate={
                            checkIn
                              ? dayjs(checkIn).add(1, "day").toDate()
                              : new Date()
                          }
                          valueFormat="ddd, MM/DD/YY"
                          placeholder="--/--/--"
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
                    classNames={`booking-section-acs__form--field`}
                    align={"center"}
                    justify={"center"}
                    w={"100%"}
                  >
                    <Select
                      w={"100%"}
                      label="Guests"
                      placeholder="Guests"
                      value={guests}
                      min={1}
                      max={5}
                      onChange={(v) => {
                        setGuests(v);
                        setPage(1);
                      }}
                      data={guestAmount}
                      classNames={{
                        input: "booking-section__form--input",
                        label: "booking-section__form--label",
                      }}
                    />
                  </Flex>
                </GridCol>
                <GridCol span={{ base: 12, md: "content" }}>
                  <Button
                    onClick={() => {
                      setType("all");
                      setGuests("all");
                      setSort("price_asc");
                      setPage(1);
                      setCheckIn(null);
                      setCheckOut(null);
                    }}
                  >
                    Reset
                  </Button>
                </GridCol>
              </Grid>
            </form>
          </Container>
        </Box>
      </Flex>
      {/*----- sorting and results  -----*/}
      <Flex justify={"space-between"} align={"center"} mt={"lg"} mb={"lg"}>
        <Box className="sortby__wrapper">
          <Select
            w={"100%"}
            classNames={{
              input: "booking-section__form--input",
              label: "booking-section__form--label",
            }}
            placeholder="Sort By"
            data={sortByData}
            value={sort}
            onChange={(value) => {
              setSort(value);
              setPage(1);
            }}
          />
        </Box>

        <Flex className="accommodations-header__acs-number">
          <Text size="xs" c="dimmed">
            {totalCount} Accommodations
          </Text>
        </Flex>
      </Flex>
      {/*----- accommodations result -----*/}
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {accList.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </SimpleGrid>

      {/*----- pagination  -----*/}
      <Flex justify={"center"} mt={"48px"} mb={"48px"} align={"center"}>
        <Pagination
          value={page}
          onChange={setPage}
          total={totalPages}
          position="center"
        />
      </Flex>
    </Container>
  );
};

export default Accommodations;
