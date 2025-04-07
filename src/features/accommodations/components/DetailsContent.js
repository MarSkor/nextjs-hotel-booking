import {
  Container,
  Flex,
  Box,
  Badge,
  Text,
  Group,
  Button,
  NumberInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconArrowDown } from "@/components/icons";
import IconSwitch from "@/utils/IconSwitch";
import DetailsReviews from "./DetailsReviews";

const DetailsContent = ({ data }) => {
  const {
    badges,
    featured_image,
    images,
    location,
    price,
    ratings,
    title,
    description,
    slug,
  } = data;

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
    <Container className="container ac-details__container-content" mt="xl">
      <Box className="ac-details__content">
        <Flex
          justify="space-between"
          direction={{ base: "column", sm: "column", md: "row" }}
        >
          <Box className="ac-details__misc" w={{ base: "100%", md: "50%" }}>
            <Box className="ac-details__amenities" mb="xl">
              <Title order={2} mb="md">
                Amenities
              </Title>
              <Group className="ac-details__amenities--group">{features}</Group>
            </Box>
            <Box mt="lg" className="ac-details__about">
              <Title order={2} mb="md">
                Description
              </Title>
              {description.map((p, i) => (
                <Text key={i} mb="lg" size="sm">
                  {p}
                </Text>
              ))}
            </Box>
          </Box>
          <Box className="ac-details__booking" w="auto" id="book-now">
            <Flex className="ac-details__booking-box" direction="column">
              <Flex direction="column">
                <Title order={2} mb="md">
                  ${price} /night
                </Title>{" "}
                <Text size="sm" mt="xs">
                  <Text span fw={700} inherit>
                    Check-in
                  </Text>{" "}
                  from 15:00 to 00:00
                </Text>
                <Text size="sm" mt="xs">
                  <Text span fw={700} inherit>
                    Check-out
                  </Text>{" "}
                  from 06:30 to 11:00
                </Text>
              </Flex>
              <Box>
                <Flex direction="row" mt="lg" mb="lg" justify="space-between">
                  <Box className="ac-details__input-wrapper" mr="sm">
                    <Text fw={500} size="xs">
                      Check in
                    </Text>
                    <DatePickerInput
                      rightSection={<IconArrowDown />}
                      rightSectionPointerEvents="none"
                      valueFormat="ddd, MM/DD/YY"
                      placeholder="--/--/--"
                      classNames={{
                        input: "ac-details__date-input",
                      }}
                    />
                  </Box>
                  <Box className="ac-details__input-wrapper">
                    <Text fw={500} size="xs">
                      Check in
                    </Text>
                    <DatePickerInput
                      rightSection={<IconArrowDown />}
                      rightSectionPointerEvents="none"
                      valueFormat="ddd, MM/DD/YY"
                      placeholder="--/--/--"
                      classNames={{
                        input: "ac-details__date-input",
                      }}
                    />
                  </Box>
                </Flex>
                <Flex direction="row">
                  <Box className="ac-details__input-wrapper" mr="sm">
                    <Text fw={500} size="xs">
                      Adults
                    </Text>
                    <NumberInput min={1} max={8} defaultValue={1} />
                  </Box>
                  <Box className="ac-details__input-wrapper">
                    <Text fw={500} size="xs">
                      Children
                    </Text>
                    <NumberInput min={0} max={8} defaultValue={0} />
                  </Box>
                </Flex>
              </Box>
              <Box mt="md" className="ac-details__booking-total-price">
                <Text>Total Price: $123</Text>
              </Box>
              <Button className="btn btn-primary" mt={24} fullWidth>
                Book Now
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <DetailsReviews />
    </Container>
  );
};

export default DetailsContent;
