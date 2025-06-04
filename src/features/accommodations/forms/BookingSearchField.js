"use client";
import { DatePickerInput } from "@mantine/dates";
import {
  Flex,
  Button,
  Container,
  Box,
  Select,
  NumberInput,
  Grid,
  GridCol,
} from "@mantine/core";
import { IconCalendar, IconHouse, IconMultipleUsers } from "@/components/icons";

const BookingSearchField = (props) => {
  return (
    <Container
      size="md"
      component="section"
      className={`booking-section b-s-${props.position}`}
    >
      <form>
        <Grid className="booking-section__grid">
          <GridCol span={{ base: 12, md: 3 }}>
            <Flex
              className="booking-section__form--field"
              align={"center"}
              w={"100%"}
            >
              <Box mr="sm">
                <IconHouse color="var(--clr-brown-3)" />
              </Box>
              <Flex w={"100%"}>
                <Select
                  w={"100%"}
                  classNames={{
                    input: "booking-section__form--input",
                    label: "booking-section__form--label",
                  }}
                  label="Property Type"
                  placeholder="Select property"
                  data={["Hotel", "Guesthouse", "Bed & Breakfast"]}
                />
              </Flex>
            </Flex>
          </GridCol>
          <GridCol span={{ base: 12, md: 5 }}>
            <Flex
              className="booking-section__form--field"
              align={"center"}
              w={"100%"}
            >
              <Box mr="sm">
                <IconCalendar color="var(--clr-brown-3)" />
              </Box>
              <Flex
                direction={{ base: "column", xs: "column", sm: "row" }}
                w={"100%"}
              >
                <Box mr={"sm"} w={"100%"}>
                  <DatePickerInput
                    label="Check in"
                    clearable
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
              className="booking-section__form--field"
              align={"center"}
              w={"100%"}
            >
              <Box mr="sm">
                <IconMultipleUsers color="var(--clr-brown-3)" />
              </Box>
              <Flex w={"100%"}>
                <NumberInput
                  w={"100%"}
                  label="Guests"
                  placeholder="idk"
                  min={1}
                  max={6}
                  classNames={{
                    input: "booking-section__form--input",
                    label: "booking-section__form--label",
                  }}
                />
              </Flex>
            </Flex>
          </GridCol>
          <GridCol span={{ base: 12, md: "content" }}>
            <Flex
              className="booking-section__form--field"
              align={"center"}
              h={"100%"}
            >
              <Button className="booking-section__search-button" fullWidth>
                Search
              </Button>
            </Flex>
          </GridCol>
        </Grid>
      </form>
    </Container>
  );
};

export default BookingSearchField;
