import { SimpleGrid, Container } from "@mantine/core";
import { ContactInformation } from "@/features/contact/components";
import { ContactForm } from "@/features/contact/forms";

const ContactPage = () => {
  return (
    <article className="contact-wrapper">
      <Container
        component="section"
        size="xl"
        className="contact-container"
        mt="xl"
        mb="xl"
      >
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={"lg"}>
          <ContactInformation />
          <ContactForm />
        </SimpleGrid>
      </Container>
    </article>
  );
};

export default ContactPage;
