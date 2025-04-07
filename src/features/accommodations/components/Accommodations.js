import { Container, Grid, GridCol } from "@mantine/core";
import { AccommodationCard } from "@/components/ui";

const Accommodations = () => {
  return (
    <section className="container-color_accommodation accommodations pb-120">
      <Container fluid className="container">
        <Grid pt={32} pb="lg">
          <GridCol span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
            <AccommodationCard />
          </GridCol>
          <GridCol span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
            <AccommodationCard />
          </GridCol>
          <GridCol span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
            <AccommodationCard />
          </GridCol>
          <GridCol span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
            <AccommodationCard />
          </GridCol>
        </Grid>
      </Container>
    </section>
  );
};

export default Accommodations;
