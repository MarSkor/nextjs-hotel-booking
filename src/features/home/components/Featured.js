import { AccommodationCard, Heading } from "@/components/ui";
import { Container, Group, Button, Grid, GridCol } from "@mantine/core";
import { IconArrowRight2 } from "@/components/icons";
import Link from "next/link";

const Featured = () => {
  return (
    <section className="container-color_featured featured">
      <Container fluid className="container featured__wrapper">
        <Heading
          variant="center"
          label="Top rated accommodations"
          title="Featured"
        />
        <Grid justify="center">
          <GridCol align="center" span={{ base: 12, sm: 6, md: 4 }}>
            <AccommodationCard />
          </GridCol>
          <GridCol align="center" span={{ base: 12, sm: 6, md: 4 }}>
            <AccommodationCard />
          </GridCol>
          <GridCol align="center" span={{ base: 12, sm: 6, md: 4 }}>
            <AccommodationCard />
          </GridCol>
        </Grid>
        <Group justify="center" mt={32}>
          <Button
            className="btn-link align-content"
            component={Link}
            href="/accommodation"
            variant="transparent"
            rightSection={<IconArrowRight2 />}
          >
            View all
          </Button>
        </Group>
      </Container>
    </section>
  );
};

export default Featured;
