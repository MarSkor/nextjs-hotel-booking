"use client";
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
} from "@mantine/core";
import { IconLocation, IconStar, IconHeart } from "../icons";
import Link from "next/link";
import { mockData } from "./data";
import IconSwitch from "@/utils/IconSwitch";

const AccommodationCard = () => {
  const [isActive, setIsActive] = useState(false);

  const {
    title,
    location,
    badges,
    price,
    ratings,
    slug,
    description,
    featured_image,
  } = mockData;

  const linkProps = { href: "#", target: "_blank", rel: "noopener noreferrer" };

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
      <div align="center" className="card__favorite">
        <div onClick={() => setIsActive(!isActive)}>
          {isActive ? (
            <IconHeart color="red" fill="red" title="save" />
          ) : (
            <IconHeart color="#fbfbfb" title="save" />
          )}
        </div>
      </div>
      <Group mt="sm" justify="space-between">
        <Title order={4}>{title}</Title>
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
      <Text className="card__description" size="sm" lineClamp={2}>
        {description}
      </Text>
      <Flex mt="md" justify="space-between" align="center">
        <Flex align="baseline">
          <Title order={5} mr={rem("2px")}>
            ${price}{" "}
          </Title>{" "}
          <Text> /night</Text>
        </Flex>

        <Button radius="md">View</Button>
      </Flex>
    </Card>
  );
};

export default AccommodationCard;
