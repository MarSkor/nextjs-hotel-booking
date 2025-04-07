"use client";
import { DatePickerInput } from "@mantine/dates";
import { Flex, Button, Container, Text, Box, Select } from "@mantine/core";
import {
  IconArrowDown,
  IconCalendar,
  IconHouse,
  IconMultipleUsers,
} from "../../../components/icons";
import BookingGuests from "./BookingGuests";

const BookingSearchField = (props) => {
  return (
    <section className={`booking-sf-section ${props.position}`}>
      <Box className={`booking-sf ${props.position}`}>
        <Container className="container-full">
          <form action="" className="booking-sf__form">
            <div className="booking-sf__form--wrapper">
              <div className="booking-sf__form--field">
                <Flex
                  direction="row"
                  align="center"
                  className="booking-sf__form--field-input-wrapper"
                >
                  <Box mr="xs">
                    <IconHouse color="#3f3d41" />
                  </Box>
                  <Flex direction="column" w="100%">
                    <div>
                      <Text size="xs">Property Type</Text>
                    </div>
                    <div className="booking-sf__form--field-input-wrapper">
                      <Select
                        data={["Hotel", "Guesthouse", "Bed & Breakfast"]}
                        rightSectionPointerEvents="none"
                        rightSection={<IconArrowDown />}
                        placeholder="Select property type"
                        classNames={{
                          input: "booking-sf__form--input",
                        }}
                      />
                    </div>
                  </Flex>
                </Flex>
              </div>
              {/* <Divider orientation="vertical" /> */}
              <div className="booking-sf__form--field">
                <Flex
                  direction="row"
                  align="center"
                  className="booking-sf__form--field-row"
                >
                  <Box mr="xs">
                    <IconCalendar color="#3f3d41" />
                  </Box>
                  <Flex w="100%">
                    <Flex
                      w="100%"
                      mr="xs"
                      direction="column"
                      className="booking-sf__form--field-col"
                    >
                      <div>
                        <Text size="xs">Check in</Text>
                      </div>
                      <div className="booking-sf__form--field-input-wrapper">
                        <DatePickerInput
                          rightSection={<IconArrowDown />}
                          clearable
                          valueFormat="ddd, MM/DD/YY"
                          placeholder="--/--/--"
                          classNames={{
                            input: "booking-sf__form--input",
                          }}
                        />
                      </div>
                    </Flex>
                    {/* <Divider orientation="vertical" m="lg" /> */}
                    <Flex
                      w="100%"
                      ml="xs"
                      direction="column"
                      className="booking-sf__form--field-col"
                    >
                      <div>
                        <Text size="xs">Check out</Text>
                      </div>
                      <div className="booking-sf__form--field-input-wrapper">
                        <DatePickerInput
                          rightSection={<IconArrowDown />}
                          clearable
                          valueFormat="ddd, MM/DD/YY"
                          placeholder="--/--/--"
                          classNames={{
                            input: "booking-sf__form--input",
                          }}
                        />
                      </div>
                    </Flex>
                  </Flex>
                </Flex>
              </div>
              {/* <Divider orientation="vertical" /> */}
              <div className="booking-sf__form--field">
                <Flex direction="row" align="center" w="100%">
                  <Box mr="xs">
                    <IconMultipleUsers color="#3f3d41" />
                  </Box>
                  <Flex direction="column" w="100%">
                    <div>
                      <Text size="xs">Guests</Text>
                    </div>
                    <div>
                      <BookingGuests />
                    </div>
                  </Flex>
                </Flex>
              </div>
              <div className="booking-sf__form--field">
                <Button className="btn btn-primary" fullWidth>
                  Search
                </Button>
              </div>
            </div>
          </form>
        </Container>
      </Box>
    </section>
  );
};

export default BookingSearchField;
