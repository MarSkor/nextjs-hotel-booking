"use client";
import { IconArrowLeft } from "@/components/icons";
import Link from "next/link";
import Booking from "@/features/booking/components/Booking";
import AccommodationImages from "./AccommodationImages";
import FavoriteButton from "@/components/ui/FavoriteButton";
import {
  Container,
  Flex,
  Box,
  Title,
  Text,
  Rating,
  Grid,
  GridCol,
  Paper,
  Anchor,
  rem,
} from "@mantine/core";

const AccommodationOverview = ({
  accDetails,
  isFavorite,
  reviewCount,
  averageRating,
}) => {
  const { id, title, excerpt, pricePerNight, featuredImage, images, slug } =
    accDetails;

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
          <Flex align={"center"} justify={"space-between"}>
            <Flex align={"center"}>
              <Rating
                value={parseFloat(averageRating) || 0}
                fractions={2}
                readOnly
              />
              <Anchor
                className="card__rating--text"
                href={`#details__reviews`}
                c="dimmed"
                size="sm"
                ml={rem("8px")}
                fw={500}
              >
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                {reviewCount > 0 && ` • ${averageRating.toFixed(1)}`}
              </Anchor>
            </Flex>
            <FavoriteButton initialFav={isFavorite} accommodationId={id} />
          </Flex>
          <Title order={1}>{title}</Title>
          <Text size="xs" mt={"xs"}>
            {excerpt}
          </Text>
        </Flex>
        <Grid mt={"lg"} gutter={{ base: 5, xs: "md", md: "xl" }}>
          <GridCol span={{ base: 12, md: 8 }}>
            <AccommodationImages
              featuredImage={featuredImage}
              images={images}
            />
          </GridCol>
          {/* --------- booking details ---------  */}
          <GridCol span={{ base: 12, md: 4 }}>
            <Flex direction={"column"}>
              {/* price  */}
              <Paper
                radius={"sm"}
                className="details__booking-top"
                w={"100%"}
                p={"md"}
                mb={"sm"}
              >
                <Flex align={"baseline"}>
                  <Title order={2} size={"h1"} mr={"6px"}>
                    $ {pricePerNight}
                  </Title>{" "}
                  <Text size="sm">{""}/night</Text>
                </Flex>
              </Paper>
              {/* booking form  */}
              <Booking accommodation={accDetails} />
            </Flex>
          </GridCol>
        </Grid>
      </Box>
    </Container>
  );
};

export default AccommodationOverview;
