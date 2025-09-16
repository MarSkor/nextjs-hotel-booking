import {
  Container,
  Box,
  Title,
  Text,
  Grid,
  GridCol,
  Anchor,
} from "@mantine/core";
import { Card } from "@/components/ui";
import { mockData } from "@/features/accommodations/components/mockdata";
import Link from "next/link";

const Featured = () => {
  //add featured YES/NO to the mockdata later
  const mockDataArray = mockData.slice(0, 3);

  return (
    <Container
      component="section"
      size="xl"
      className="home-featured"
      mt="lg"
      mb="lg"
    >
      <Box className="home-featured__heading">
        <Text size="sm">Top rated accommodations</Text>
        <Title order={2} mb={"md"}>
          Featured Housing
        </Title>
        <Anchor component={Link} href={"/accommodation"}>
          View All
        </Anchor>
      </Box>
      <Container className="no-side-padding" size="xl" mt="xl">
        <Grid>
          {mockDataArray.map((item) => (
            <GridCol
              key={item.id}
              align="center"
              span={{ base: 12, xs: 6, md: 4 }}
            >
              <Card {...item} />
            </GridCol>
          ))}
        </Grid>
      </Container>
    </Container>
  );
};

export default Featured;
