"use client";
import {
  Container,
  Flex,
  Rating,
  Text,
  Title,
  Anchor,
  NavLink,
  Box,
  useMantineTheme,
  Group,
} from "@mantine/core";
import { IconLocation } from "@/components/icons";
import { BreadCrumb } from "@/components/ui";
import { useMediaQuery } from "@mantine/hooks";
import { ImageViewDesktop, ImageViewMobile } from "./imageview";

const DetailsHeader = ({ data }) => {
  console.log("mock data-", data);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Container className="container" mt="lg">
      <Box className="ac-details__header" mb="lg">
        <BreadCrumb
          firstLevelHref="/accommodation"
          firstLevelHrefText="Accommodations"
          secondLevelHrefText={`${data.title}`}
        />
        <Flex
          justify="space-between"
          direction={{ base: "column", sm: "row" }}
          mt="lg"
        >
          <Flex className="ac-details__title" direction="column">
            <Title order={1}>{data.title}</Title>
            <Flex align="center" mt="xs" mb="xs">
              <IconLocation />
              <Text>{data.location}</Text>
            </Flex>
            <Flex>
              <Flex align="center">
                <Rating
                  value={data.ratings.total_rating}
                  fractions={2}
                  readOnly
                />
                <Anchor href="#reviews" ml="xs">
                  <Text size="xs">{data.ratings.total_reviews} reviews</Text>
                </Anchor>
              </Flex>
            </Flex>
          </Flex>
          <Box mt={{ base: "sm", sm: "" }}>
            <NavLink
              className="btn btn-primary"
              href="#book-now"
              label="Book Now"
            />
          </Box>
        </Flex>
      </Box>
      <Box mt="xl" mb="xl">
        {mobile ? (
          <ImageViewMobile images={data.images} />
        ) : (
          <ImageViewDesktop
            images={data.images}
            featured_image={data.featured_image}
          />
        )}
      </Box>
    </Container>
  );
};

export default DetailsHeader;
