import { Container, Box, Title, Text, Grid, GridCol } from "@mantine/core";
import { Card } from "@/components/ui";

const Featured = () => {
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
        <Title order={2}>Featured Housing</Title>
      </Box>
      <Container className="no-side-padding" size="xl" mt="xl">
        <Grid>
          <GridCol align="center" span={{ base: 12, xs: 6, md: 4 }}>
            <Card />
          </GridCol>
          <GridCol align="center" span={{ base: 12, xs: 6, md: 4 }}>
            <Card />
          </GridCol>
          <GridCol align="center" span={{ base: 12, xs: 6, md: 4 }}>
            <Card />
          </GridCol>
        </Grid>
      </Container>
    </Container>
  );
};

export default Featured;
