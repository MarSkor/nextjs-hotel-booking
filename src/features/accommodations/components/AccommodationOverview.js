"use client";
import {
  Container,
  Flex,
  Box,
  Title,
  Text,
  Rating,
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
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";
import { IconArrowLeft } from "@/components/icons";
import Link from "next/link";

const AccommodationOverview = ({
  title,
  excerpt,
  pricePerNight,
  featuredImage,
  images,
  isAvailable,
  averageRating,
}) => {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const allImages = Array.from(new Set([featuredImage, ...(images || [])]));
  const slides = allImages.map((image, i) => (
    <CarouselSlide key={i}>
      <Box
        className="carousel__slide"
        style={{
          position: "relative",
          width: "100%",
          height: mobile ? 220 : 440,
          overflow: "hidden",
        }}
      >
        <IKImage
          alt="accommodation cover"
          path={image}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          fill
          loading="lazy"
          lqip={{ active: true }}
          radius=""
          style={{
            objectFit: "cover",
            objectPosition: "bottom",
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
          transformation={[
            { width: "1200", height: "800", crop: "maintain_ratio" },
          ]}
        />
      </Box>
    </CarouselSlide>
  ));

  return (
    <Container
      size="lg"
      className="accommodations-details-container"
      mt="xl"
      mb="xl"
    >
      <Anchor
        mb={"lg"}
        size="sm"
        component={Link}
        href={"/accommodation"}
        style={{ display: "flex", alignItems: "center" }}
      >
        <IconArrowLeft color="var(--mantine-color-anchor)" /> Back to
        accommodations
      </Anchor>
      <Box className="details__container">
        <Flex direction={"column"}>
          <Flex align={"center"}>
            <Rating value={averageRating} fractions={2} readOnly />
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
          <Title order={1}>{title}</Title>
          <Text size="xs" mt={"xs"}>
            {excerpt}
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
          {/* --------- booking details ---------  */}
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
                      $ {pricePerNight}
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
                {/* booking dates  */}
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
                      description="A maxium of 5 guests allowed."
                      min={1}
                      max={5}
                      classNames={{
                        input: "booking-section__form--input",
                        label: "booking-section__form--label",
                      }}
                    />
                  </Flex>
                  <Flex>
                    <Button size="md" fullWidth>
                      Book Now
                    </Button>
                  </Flex>
                </Flex>
              </Paper>
            </Flex>
          </GridCol>
        </Grid>
      </Box>
    </Container>
  );
};

export default AccommodationOverview;
