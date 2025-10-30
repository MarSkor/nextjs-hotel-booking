import { formatText } from "@/utils/Helpers";
import { bedTypes } from "@/utils/constants";
import {
  Container,
  Flex,
  Box,
  Title,
  Text,
  Grid,
  GridCol,
  SimpleGrid,
  Paper,
  Divider,
  Badge,
  Group,
} from "@mantine/core";
import { IconLocation } from "@/components/icons";

const AccommodationDetails = (accdetails) => {
  const { title, bodyText, amenities, guests, street, buildingNumber } =
    accdetails;

  const beds = bedTypes
    .filter((bed) => (accdetails?.[bed.key] ?? 0) > 0)
    .map((bed) => {
      const count = accdetails[bed.key];
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
    <Container
      component="section"
      size="lg"
      className="accommodations-details-container"
      mt="xl"
      mb="xl"
    >
      <Box mb={"xl"}>
        <Grid gutter={{ base: "xl" }}>
          <GridCol span={{ base: 12, md: 8 }}>
            <Flex direction={"column"}>
              <Title order={2} mb="lg">
                About {title}
              </Title>
              <Text size="sm" mb={"xs"}>
                {bodyText}
              </Text>
            </Flex>
          </GridCol>
          <GridCol span={{ base: 12, md: 4 }}>
            <Paper mt={"sm"} radius={"sm"} w={"100%"} p={"md"} mb={"sm"}>
              <Flex direction={"column"} align={"baseline"}>
                <Flex align={"center"} mb={"xs"}>
                  <IconLocation />
                  <Title ml={"4px"} order={4}>
                    Address
                  </Title>
                </Flex>
                <Flex component="address" align={"center"}>
                  <Text size="sm" mr={"xs"}>
                    {street}{" "}
                  </Text>
                  <Text size="sm">{buildingNumber}</Text>
                </Flex>
              </Flex>
            </Paper>
            <Paper component="article" w={"100%"} p={"md"} mb={"sm"}>
              <Flex component="section" direction={"column"}>
                <Title order={4} mb={"xs"}>
                  Beds
                </Title>
                <Group>{beds}</Group>
              </Flex>
            </Paper>
          </GridCol>
        </Grid>
      </Box>
      <Divider mt={"xl"} mb={"xl"} />
      {/* -------------------------------------- */}
      {/* FACILITIES   */}
      <Box>
        <Title order={2} mb="lg">
          Amenities
        </Title>
        <SimpleGrid
          cols={{ base: 1, xs: 2, sm: 3, lg: 4 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "md" }}
        >
          {amenities.map((item, i) => (
            <Paper p={"md"} key={i} radius={"sm"} className="facilities-card">
              <Flex align={"center"}>
                <Text fw={700} size="sm">
                  {formatText(item)}
                </Text>
              </Flex>
            </Paper>
          ))}
        </SimpleGrid>
      </Box>
      <Divider mt={"xl"} mb={"xl"} />
    </Container>
  );
};

export default AccommodationDetails;
