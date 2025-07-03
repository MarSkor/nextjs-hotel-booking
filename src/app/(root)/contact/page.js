import { SimpleGrid, Container, Flex } from "@mantine/core";
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
          <Flex className="contactform__container" justify={"center"}>
            <ContactForm />
          </Flex>
        </SimpleGrid>
      </Container>
    </article>
  );
};

export default ContactPage;
