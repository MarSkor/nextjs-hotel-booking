"use client";
import Link from "next/link";
import { IconLocation, IconUser } from "../icons";
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
  Rating,
} from "@mantine/core";

const AccommodationCard = (item) => {
  const {
    title,
    street,
    buildingNumber,
    pricePerNight,
    averageRating,
    slug,
    featuredImage,
    guests,
    reviewCount,
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
            <Flex align="center" gap={4}>
              <Rating
                value={averageRating || 0}
                fractions={2}
                readOnly
                size="xs"
              />
              <Text size="xs" c="dimmed" fw={500}>
                ({reviewCount || 0})
              </Text>
            </Flex>
          </Flex>
        </Group>
      </Flex>
      <Group mt="xs" mb="xs">
        <Badge
          variant="light"
          radius="sm"
          size="sm"
          leftSection={
            <IconUser
              heigth={15}
              width={15}
              color={"var(--mantine-color-licorice-light-color)"}
            />
          }
          classNames={{
            root: "card-badge__root",
            label: "card-badge__label",
          }}
        >
          {guests}
        </Badge>
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
