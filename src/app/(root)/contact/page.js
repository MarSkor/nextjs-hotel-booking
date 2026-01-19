import { Container, Grid, GridCol } from "@mantine/core";
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
        <Grid gutter={"sm"}>
          <GridCol span={{ base: 12, md: 6, lg: 5 }}>
            <ContactInformation />
          </GridCol>
          <GridCol span={{ base: 12, md: 6, lg: 7 }}>
            <ContactForm />
          </GridCol>
        </Grid>
      </Container>
    </article>
  );
};

export default ContactPage;
