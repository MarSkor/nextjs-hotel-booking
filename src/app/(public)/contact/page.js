import { Box, Container, SimpleGrid } from "@mantine/core";
import { ContactForm } from "@/features/contact/forms";
import { ContactInformation } from "@/features/contact/components";

const Contact = () => {
  return (
    <section className="container-color_contactus contactus">
      <Container className="container">
        <Box className="contactus__wrapper">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={50}>
            <ContactInformation />
            <ContactForm />
          </SimpleGrid>
        </Box>
      </Container>
    </section>
  );
};

export default Contact;
