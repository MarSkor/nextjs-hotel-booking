import { Container } from "@mantine/core";
import { Heading } from "@/components/ui";
import { BookingSearchField } from "@/features/accommodations/forms";

const Header = () => {
  return (
    <section className="container-color_accommodation accommodation-header section-spacing">
      <Container className="container">
        <Heading title="Accommodations" />
        <BookingSearchField position="relative" />
      </Container>
    </section>
  );
};

export default Header;
