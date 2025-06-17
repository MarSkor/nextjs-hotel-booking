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

const BookingSearchField = (props) => {
  return (
    <Container
      component={"section"}
      className={`bsf-section bsf-section-${props.page}`}
      size={props.size}
    >
      <form>
        <Grid align="center">
          <GridCol span={{ base: 12, md: 3 }}>
            <Flex
              classNames={`booking-section-${props.page}__form--field`}
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
                data={["Hotel", "Guesthouse", "Bed & Breakfast"]}
              />
            </Flex>
          </GridCol>
          <GridCol span={{ base: 12, md: 5 }}>
            <Flex
              classNames={`booking-section-${props.page}__form--field`}
              align={"center"}
              w={"100%"}
            >
              <Flex direction={{ base: "column", xs: "row" }} w={"100%"}>
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
              classNames={`booking-section-${props.page}__form--field`}
              align={"center"}
              justify={"center"}
              w={"100%"}
            >
              <NumberInput
                w={"100%"}
                label="Guests"
                placeholder="Guests"
                min={1}
                max={6}
                classNames={{
                  input: "booking-section__form--input",
                  label: "booking-section__form--label",
                }}
              />
            </Flex>
          </GridCol>
          <GridCol span={{ base: 12, md: "content" }}>
            <Button>Search</Button>
          </GridCol>
        </Grid>
      </form>
    </Container>
  );
};

export default BookingSearchField;
