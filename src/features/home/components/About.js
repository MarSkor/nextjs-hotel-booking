import { IconArrowRight } from "@/components/icons";
import {
  Container,
  Flex,
  Image,
  SimpleGrid,
  Title,
  Text,
  Box,
  Button,
} from "@mantine/core";
import Link from "next/link";

const About = () => {
  return (
    <Container
      component="section"
      size="xl"
      className="home-about"
      mt="lg"
      mb="lg"
    >
      <Container fluid className="home-about__wrapper">
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 2 }}
          spacing={{ base: "10", sm: "xl" }}
          verticalSpacing={{ base: "xl" }}
        >
          <Flex
            justify="center"
            align="flex-start"
            direction="column"
            wrap="wrap"
            className="home-about__left-col"
          >
            <Box mb="xl">
              <Text size="sm">About us</Text>
              <Title order={2}> Reasons to book with Holidaze</Title>
            </Box>
            <Box>
              <Text mb="md">
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
            <Flex mt="xl" w={"100%"}>
              <Button
                className="home-about__link"
                variant="outline"
                rightSection={
                  <IconArrowRight color="var(--mantine-color-licorice-outline)" />
                }
                component={Link}
                href="#"
              >
                Read More
              </Button>
            </Flex>
          </Flex>
          <Image radius="md" src="/assets/about/about-us.png" alt="about us" />
        </SimpleGrid>
      </Container>
    </Container>
  );
};

export default About;
