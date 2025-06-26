"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Badge,
  Image,
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
import { IconLocation, IconStar, IconHeart } from "../icons";
import IconSwitch from "@/utils/IconSwitch";

const AccommodationCard = (props) => {
  const [isActive, setIsActive] = useState(false);

  const { title, location, badges, price, ratings, slug, featured_image } =
    props;

  const linkProps = {
    href: `/accommodation/${slug}`,
    // target: "_blank",
    rel: "noopener noreferrer",
  };

  const features = badges.map((badge) => (
    <Badge
      variant="light"
      radius="sm"
      size="sm"
      key={badge.type}
      leftSection={IconSwitch(badge.slug)}
      classNames={{
        root: "card-badge__root",
        label: "card-badge__label",
      }}
    >
      {badge.quantity} {badge.type}
    </Badge>
  ));

  return (
    <Card className="card" shadow="sm">
      <CardSection component={Link} {...linkProps}>
        <Image alt="housing" src={featured_image} />
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
      <Group mt="sm" justify="space-between">
        <Title order={3}>{title}</Title>
        <Flex className="card__rating" align="center">
          <Flex>
            <IconStar />
            <Text fw={500} size="sm" ml="4px">
              {ratings.total_rating}
            </Text>
          </Flex>
          <Text
            className="card__rating--text"
            component={Link}
            href="#"
            c="#363637"
            size="sm"
            ml={rem("4px")}
          >
            ({ratings.total_reviews})
          </Text>
        </Flex>
      </Group>
      <Group mt={"xs"}>
        <Flex align={"center"}>
          <IconLocation />
          <Text ml={rem("4px")} size="xs">
            {location}
          </Text>
        </Flex>
      </Group>
      <Group mt="xs" mb="xs">
        {features}
      </Group>
      <Flex justify="space-between" align="center">
        <Flex align="baseline">
          <Title order={5} size="h4" mr={rem("2px")}>
            ${price}{" "}
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
