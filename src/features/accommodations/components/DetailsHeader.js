"use client";
import {
  Container,
  Flex,
  Box,
  Title,
  Text,
  Rating,
  Image,
  Grid,
  GridCol,
  useMantineTheme,
  Paper,
  Button,
  Anchor,
  rem,
  NumberInput,
} from "@mantine/core";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { DatePickerInput } from "@mantine/dates";

const images = [
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
];

const DetailsHeader = () => {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  //add fullscreen view to images?
  const slides = images.map((image, i) => (
    <CarouselSlide key={i}>
      <Image radius={"sm"} src={image} height={mobile ? 220 : 440} alt="" />
    </CarouselSlide>
  ));

  return (
    <Container
      component="section"
      size="lg"
      className="accommodations-details-container"
      mt="xl"
      mb="xl"
    >
      <Flex direction={"column"} className="details__container">
        <Flex direction={"column"}>
          <Flex align={"center"}>
            <Rating value={3.5} fractions={2} readOnly />
            <Text
              className="card__rating--text"
              component={Anchor}
              href="#details__reviews"
              c="#363637"
              size="sm"
              ml={rem("4px")}
            >
              (1234 reviews)
            </Text>
          </Flex>
          <Title order={1}>Lorem Ipsum Hotel</Title>
          <Text size="xs" mt={"xs"}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </Text>
        </Flex>
        <Grid mt={"lg"} gutter={{ base: 5, xs: "md", md: "xl" }}>
          <GridCol span={{ base: 12, md: 8 }}>
            <Carousel
              radius="md"
              withIndicators
              emblaOptions={{ loop: true }}
              classNames={{
                root: "details__carousel-root",
                controls: "details__carousel-controls",
                control: "details__carousel-control",
                indicator: "details__carousel-indicator",
              }}
            >
              {slides}
            </Carousel>
          </GridCol>
          <GridCol span={{ base: 12, md: 4 }}>
            <Flex direction={"column"} h={"100%"}>
              <Flex mb={"sm"}>
                <Paper
                  radius={"sm"}
                  className="details__booking-top"
                  w={"100%"}
                  p={"md"}
                >
                  <Flex align={"baseline"}>
                    <Title order={2} size={"h1"} mr={"6px"}>
                      $ 100
                    </Title>{" "}
                    <Text size="sm">{""}/night</Text>
                  </Flex>
                </Paper>
              </Flex>
              <Paper
                radius={"sm"}
                className="details__booking-body"
                w={"100%"}
                p={"md"}
                height={"100%"}
              >
                <Flex direction={"column"} justify={"space-between"} h={"100%"}>
                  <Flex mb={"sm"}>
                    <DatePickerInput
                      w={"100%"}
                      size="md"
                      label="Check in"
                      clearable
                      valueFormat="dddd, MM/DD/YY"
                      placeholder="--/--/--"
                      classNames={{
                        input: "booking-section__form--input",
                        label: "booking-section__form--label",
                      }}
                    />
                  </Flex>
                  <Flex mb={"sm"}>
                    <DatePickerInput
                      w={"100%"}
                      size="md"
                      label="Check out"
                      clearable
                      valueFormat="dddd, MM/DD/YY"
                      placeholder="--/--/--"
                      classNames={{
                        input: "booking-section__form--input",
                        label: "booking-section__form--label",
                      }}
                    />
                  </Flex>
                  <Flex mb={"sm"}>
                    <NumberInput
                      w={"100%"}
                      size="md"
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
                  <Flex mt={"xl"}>
                    <Button size="md" fullWidth>
                      Book Now
                    </Button>
                  </Flex>
                </Flex>
              </Paper>
            </Flex>
          </GridCol>
        </Grid>
      </Flex>
    </Container>
  );
};

export default DetailsHeader;
