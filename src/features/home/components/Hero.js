import { Container, Text, Title, Overlay } from "@mantine/core";
import { BookingSearchField } from "@/features/accommodations/forms";

const Hero = () => {
  return (
    <section className="home-hero__wrapper">
      <Overlay color="#000" opacity={0.75} zIndex={1} />

      <div className="home-hero__inner">
        <Container size={740}>
          <Text size="lg" className="home-hero__description">
            Explore, Book, and
            <span className="home-hero__description--highlight"> Relax </span>
            in Bergen, Norway.
          </Text>
          <Title className="home-hero__inner--title">
            Elevate your holidays with Holidaze.
          </Title>
        </Container>

        <BookingSearchField size="md" page="home" />
      </div>
    </section>
  );
};

export default Hero;
