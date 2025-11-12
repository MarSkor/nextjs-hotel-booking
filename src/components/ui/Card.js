"use client";
import Link from "next/link";
import { useState } from "react";
import { IconLocation, IconStar, IconHeart } from "../icons";
import { mathRound } from "@/utils/Helpers";
import { bedTypes } from "@/utils/constants";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";
import {
  Badge,
  Group,
  Text,
  Button,
  Card,
  CardSection,
  Flex,
  Title,
  rem,
  Tooltip,
  Box,
} from "@mantine/core";

const AccommodationCard = (item) => {
  const [isActive, setIsActive] = useState(false);
  const {
    title,
    street,
    buildingNumber,
    pricePerNight,
    averageRating,
    slug,
    featuredImage,
  } = item;

  const placeholderImagePath = "/defaults/600x400_DxM717i9q.svg";
  const hasFeaturedImage = featuredImage && featuredImage.filePath;

  const linkProps = {
    href: `/accommodation/${slug}`,
    rel: "noopener noreferrer",
  };

  const beds = bedTypes
    .filter((bed) => (item?.[bed.key] ?? 0) > 0)
    .slice(0, 2)
    .map((bed) => {
      const count = item[bed.key];
      return (
        <Badge
          variant="light"
          radius="sm"
          size="sm"
          key={bed.key}
          leftSection={bed.icon}
          classNames={{
            root: "card-badge__root",
            label: "card-badge__label",
          }}
        >
          {count} {bed.label}
          {count > 1 ? "s" : ""}
        </Badge>
      );
    });

  return (
    <Card shadow="sm">
      <CardSection
        component={Link}
        {...linkProps}
        style={{ position: "relative", aspectRatio: "16/9" }}
      >
        <IKImage
          alt={`${title} cover`}
          path={
            hasFeaturedImage ? featuredImage.filePath : placeholderImagePath
          }
          urlEndpoint={config.env.imagekit.urlEndpoint}
          fill
          lqip={{ active: true }}
          style={{
            objectFit: "cover",
          }}
        />
      </CardSection>
      <Tooltip label="Save to favorites">
        <Box align="center" className="card__favorite">
          <Box onClick={() => setIsActive(!isActive)}>
            {isActive ? (
              <IconHeart color="red" fill="red" title="save" />
            ) : (
              <IconHeart color="#fbfbfb" title="save" />
            )}
          </Box>
        </Box>
      </Tooltip>
      <Title mt={"sm"} order={3} lineClamp={1}>
        {title}
      </Title>
      <Flex mt={"sm"} justify={"space-between"} align={"center"}>
        <Group>
          <Flex align={"center"}>
            <IconLocation />
            <Flex>
              <Text ml={rem("4px")} size="xs">
                {street}
              </Text>
              <Text ml={rem("4px")} size="xs">
                {buildingNumber}
              </Text>
            </Flex>
          </Flex>
        </Group>
        <Group justify="space-between">
          <Flex className="card__rating" align="center">
            <Flex>
              <IconStar />
              <Text fw={500} size="sm" ml="4px">
                {mathRound(averageRating)}
              </Text>
            </Flex>
          </Flex>
        </Group>
      </Flex>
      <Group mt="xs" mb="xs">
        {beds}
      </Group>
      <Flex justify="space-between" align="center">
        <Flex align="baseline">
          <Title order={5} size="h4" mr={rem("2px")}>
            ${pricePerNight}{" "}
          </Title>{" "}
          <Text size="sm"> /night</Text>
        </Flex>
        <Button component={Link} {...linkProps} variant="outline" radius="md">
          View
        </Button>
      </Flex>
    </Card>
  );
};

export default AccommodationCard;
