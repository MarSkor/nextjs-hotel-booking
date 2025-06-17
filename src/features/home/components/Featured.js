import { Container, Box, Title, Text, Grid, GridCol } from "@mantine/core";
import { Card } from "@/components/ui";
import { mockData } from "@/features/accommodations/components/mockdata";

const Featured = () => {
  //add featured YES/NO to the mockdata later
  const mockDataArray = mockData.slice(0, 3);

  const accommodations = mockDataArray.map((item) => <Card key={item.id} />);

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
            {accommodations}
          </GridCol>
        </Grid>
      </Container>
    </Container>
  );
};

export default Featured;
