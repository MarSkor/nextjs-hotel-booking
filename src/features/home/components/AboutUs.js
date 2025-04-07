import {
  Flex,
  Container,
  Button,
  Image,
  SimpleGrid,
  Box,
  Text,
} from "@mantine/core";
import { Heading } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";

const AboutUs = () => {
  return (
    <section className="container">
      <Container fluid className="about-us__wrapper">
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 2 }}
          spacing={{ base: "10", sm: "xl" }}
          verticalSpacing={{ base: "xl" }}
        >
          <Flex
            className="about-us__left-content"
            justify="center"
            align="flex-start"
            direction="column"
            wrap="wrap"
          >
            <Heading
              variant="left"
              label="About us"
              title="Reasons to book with Holidaze"
            />
            <Box className="about-us__paragraph mb-40">
              <Text className="mb-8">
                {" "}
                Magna aliquet arcu lacus, erat libero ut non. Ridiculus nisl
                aliquam leo malesuada ullamcorper.
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Porttitor leo senectus mattis nisi placerat sit sit eget. Sed
                rhoncus nisi, venenatis massa turpis imperdiet consequat,
                sodales.
              </Text>
            </Box>
            <Box className="about-us__button">
              <Button
                variant="outline"
                className="btn btn-outline"
                rightSection={<IconArrowRight />}
              >
                Learn More
              </Button>
            </Box>
          </Flex>
          <Image radius="md" src="./assets/about-us.png" alt="about us" />
        </SimpleGrid>
      </Container>
    </section>
  );
};

export default AboutUs;
