"use client";
import {
  Container,
  Box,
  Flex,
  Paper,
  Title,
  Text,
  Grid,
  GridCol,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import Review from "./Review";

const DetailsContent = () => {
  const facilitiesData = Array(10)
    .fill(0)
    .map((_, index) => ({ id: index, name: randomId() }));

  return (
    <Container
      component="section"
      size="lg"
      className="accommodations-details-container"
      mt="xl"
      mb="xl"
    >
      {/* DESCRIPTION  */}
      <Box mb={"xl"}>
        <Grid gutter={{ base: "xl" }}>
          <GridCol span={{ base: 12, md: 8 }}>
            <Flex direction={"column"}>
              <Title order={3} mb="sm">
                About Lorem Ipsum Hotel
              </Title>
              <Text size="sm" mb={"xs"}>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe
                eos voluptatem ullam facere quod provident cumque odit commodi
                inventore? Debitis laboriosam ut ea tenetur earum nisi minima
                nemo, soluta placeat.
              </Text>
              <Text size="sm">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe
                eos voluptatem ullam facere quod provident cumque odit commodi
                inventore? Debitis laboriosam ut ea tenetur earum nisi minima
                nemo, soluta placeat.
              </Text>
            </Flex>
          </GridCol>
          <GridCol span={{ base: 12, md: 4 }}>
            <Paper w={"100%"} h={"100%"} p={"md"}>
              highlights?
            </Paper>
          </GridCol>
        </Grid>
      </Box>

      <Divider mt={"xl"} mb={"xl"} />

      {/* -------------------------------------- */}
      {/* FACILITIES   */}

      <Box>
        <Flex>
          <Title order={3} mb="sm">
            Popular Facilities
          </Title>
        </Flex>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          {facilitiesData.map((item) => (
            <Paper
              p={"md"}
              key={item.id}
              radius={"sm"}
              className="facilities-card"
            >
              <Flex align={"center"}>
                <Box mr={"xs"}>ICON</Box>
                <Text>{item.name}</Text>
              </Flex>
            </Paper>
          ))}
        </SimpleGrid>
      </Box>

      <Divider mt={"xl"} mb={"xl"} />

      {/* -------------------------------------- */}
      {/* REVIEWS  */}

      <Box id="details__reviews">
        <Flex>
          <Title order={3} mb="sm">
            Reviews of Lorem Ipsum Hotel
          </Title>
        </Flex>
        <SimpleGrid spacing={{ base: 10, sm: "xl" }} cols={{ base: 1, sm: 2 }}>
          {facilitiesData.map((item) => (
            <Review key={item.id} {...item} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default DetailsContent;
