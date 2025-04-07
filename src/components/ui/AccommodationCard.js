"use client";
import { useState } from "react";
import {
  Card,
  Badge,
  Image,
  Group,
  Text,
  Button,
  CardSection,
  Flex,
} from "@mantine/core";
import { IconLocation, IconStar, IconHeart } from "../icons";
import IconSwitch from "@/utils/IconSwitch";
import Link from "next/link";
import { mockData } from "./data";

const AccommodationCard = () => {
  const { images, title, location, badges, price, ratings, slug, description } =
    mockData;
  const [isActive, setIsActive] = useState(false);

  const features = badges.map((badge) => (
    <Badge
      variant="light"
      radius="sm"
      key={badge.type}
      leftSection={IconSwitch(badge.slug)}
      size="lg"
      classNames={{
        root: "badge__root",
        label: "badge__label",
      }}
    >
      {badge.quantity} {badge.type}
    </Badge>
  ));

  return (
    <div className="card">
      <Card withBorder padding="lg" radius="md" className="card__outer">
        <div align="center" className="card__favorite">
          <div onClick={() => setIsActive(!isActive)}>
            {isActive ? (
              <IconHeart color="red" fill="red" title="save" />
            ) : (
              <IconHeart color="#fbfbfb" title="save" />
            )}
          </div>
        </div>
        <Link href={`/accommodation/${slug}`} className="card__inner card-link">
          <CardSection className="card__image-section">
            <Image
              className="card-image"
              src={images[0]}
              alt={title}
              height={180}
            />
          </CardSection>
          <Group justify="space-between" mt="md" mb="md">
            <h3 className="card__inner--title">{title}</h3>
            <Flex align="center" className="card__inner--rating-badge">
              <Flex className="card__inner--rating-badge-inner">
                <IconStar />
                <Text fw={500} size="sm">
                  {ratings.total_rating}
                </Text>
              </Flex>
              <Text c="#363637" size="sm">
                ({ratings.total_reviews} reviews)
              </Text>
            </Flex>
          </Group>

          <Flex mb="md">
            <IconLocation color="#363637" />
            <Text ml={4} size="sm" c="#363637" fw={500}>
              {location}
            </Text>
          </Flex>

          <Text className="card__inner--description" size="sm" lineClamp={3}>
            {description}
          </Text>

          <Group mt={16}>{features}</Group>

          <Flex justify="space-between" align="center" mt="lg">
            <Flex align="center">
              <Text mr="4" size="sm" c="#515052">
                from
              </Text>
              <Text size="lg" fw={500} c="#151217">
                ${price}
              </Text>
              <Text ml="4" size="sm" c="#515052">
                per night
              </Text>
            </Flex>
            <Button className="btn btn-primary" radius="sm">
              Book Now
            </Button>
          </Flex>
        </Link>
      </Card>
    </div>
  );
};
export default AccommodationCard;
