import {
  Container,
  Grid,
  GridCol,
  Box,
  Flex,
  Text,
  Title,
  Image,
} from "@mantine/core";

const AboutGrid = () => {
  return (
    <Container
      component="section"
      size="xl"
      className="about-container"
      mt="xl"
      mb="xl"
    >
      <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
        <GridCol
          span={{ base: 12, sm: 12, md: 6 }}
          order={{ base: 1, xs: 1, sm: 1 }}
          classNames={{
            root: "about__column-root",
            col: "about__column-col col1",
            inner: "about__column-inner",
          }}
        >
          <Flex direction="column" h={"100%"} justify={"center"}>
            <Flex justify={"flex-start"} direction={"column"} mb={"md"}>
              <Text size="sm">Embracing Hospitality Excellence</Text>
              <Title order={1} mt={"xs"}>
                Our story
              </Title>
            </Flex>
            <Box>
              <Text mb={"sm"} size="sm">
                At Holidaze, our story began with a simple yet powerful idea -
                to make travel more accessible, enjoyable, and personalized for
                everyone. Founded by a team of passionate travelers who
                understand the joy and excitement that comes with exploring new
                destinations, Holidaze was born out of a desire to simplify the
                booking process and elevate the overall travel experience.
              </Text>
              <Text size="sm">
                What started as a vision to connect travelers with their dream
                accommodations has evolved into a thriving platform that offers
                a curated selection of properties spanning across diverse
                destinations. Our journey has been driven by a relentless
                commitment to excellence, innovation, and customer satisfaction,
                ensuring that every traveler who uses Holidaze can embark on
                unforgettable getaways with ease.
              </Text>
            </Box>
          </Flex>
        </GridCol>
        <GridCol
          span={{ base: 12, sm: 12, md: 6 }}
          order={{ base: 2, xs: 2, sm: 2 }}
          classNames={{
            root: "about__column-root",
            col: "about__column-col col2",
            inner: "about__column-inner",
          }}
        >
          <Box className="about__column--image-wrap">
            <Image
              radius={"sm"}
              className="about__column--img"
              src={"./assets/about/about-us_img.png"}
              alt="view of Bergen"
            />
          </Box>
        </GridCol>
        {/* ------------------------------------------------ */}
        <GridCol
          span={{ base: 12, sm: 12, md: 6 }}
          order={{ base: 4, xs: 4, sm: 3 }}
          classNames={{
            root: "about__column-root",
            col: "about__column-col col2",
            inner: "about__column-inner",
          }}
        >
          <Box className="about__column--image-wrap">
            <Image
              radius={"sm"}
              className="about__column--img"
              src={"./assets/about/about-us_img-2.png"}
              alt="view of Bergen"
            />
          </Box>
        </GridCol>
        <GridCol
          span={{ base: 12, sm: 12, md: 6 }}
          order={{ base: 3, xs: 3, sm: 4 }}
          classNames={{
            root: "about__column-root",
            col: "about__column-col col4",
            inner: "about__column-inner",
          }}
        >
          <Flex direction="column" h={"100%"} justify={"center"}>
            <Flex direction="column" mb={"md"}>
              <Text size="sm">another label here</Text>
              <Title order={2} mt={"xs"}>
                The Holidaze Experience
              </Title>
            </Flex>
            <Box>
              <Text size="sm">
                At Holidaze, we understand that planning a trip can be
                overwhelming. That&apos;s why we&apos;ve designed our platform
                to provide a seamless and hassle-free experience. Our intuitive
                search and filter options allow you to find the perfect
                accommodation tailored to your preferences and budget.
              </Text>
              <Text size="sm">
                With detailed property listings, verified guest reviews, and
                secure booking options, you can book with confidence, knowing
                that your getaway is in good hands.
              </Text>
            </Box>
          </Flex>
        </GridCol>
        {/* ------------------------------------------------ */}
        <GridCol
          span={{ base: 12, sm: 12, md: 6 }}
          order={{ base: 5, xs: 5, sm: 5 }}
          classNames={{
            root: "about__column-root",
            col: "about__column-col col1",
            inner: "about__column-inner",
          }}
        >
          <Flex direction="column" h={"100%"} justify={"center"}>
            <Flex direction="column" mb={"md"}>
              <Text size="sm">Embracing Hospitality Excellence</Text>
              <Title order={2} mt={"xs"}>
                Our Commitment to You
              </Title>
            </Flex>
            <Box>
              <Text size="sm">
                We are dedicated to delivering exceptional service and ensuring
                that your vacation experience exceeds your expectations. Our
                team is passionate about travel and committed to helping you
                find the ideal accommodation that suits your unique needs.
              </Text>
              <Text size="sm">
                Whether you&apos;re traveling solo, with family, or with a group
                of friends, Holidaze is here to elevate your travel experience.
              </Text>
            </Box>
          </Flex>
        </GridCol>
        <GridCol
          span={{ base: 12, sm: 12, md: 6 }}
          order={{ base: 6, xs: 6, sm: 6 }}
          classNames={{
            root: "about__column-root",
            col: "about__column-col col2",
            inner: "about__column-inner",
          }}
        >
          <Box className="about__column--image-wrap">
            <Image
              radius={"sm"}
              className="about__column--img"
              src={"./assets/about/about-us_img-3.jpg"}
              alt="view of Bergen"
            />
          </Box>
        </GridCol>
      </Grid>
    </Container>
  );
};

export default AboutGrid;
