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
import Link from "next/link";

const Featured = ({ data }) => {
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
          {data.map((item) => (
            <GridCol key={item.id} span={{ base: 12, xs: 6, md: 4 }}>
              <Card {...item} />
            </GridCol>
          ))}
        </Grid>
      </Container>
    </Container>
  );
};

export default Featured;
