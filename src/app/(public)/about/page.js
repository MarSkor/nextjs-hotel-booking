import {
  Box,
  Container,
  Flex,
  Grid,
  GridCol,
  Text,
  Title,
} from "@mantine/core";

export default function About() {
  return (
    <section className="about about__section">
      <Container className="container-full">
        <Grid
          gutter={{ base: 0 }}
          classNames={{
            root: "about__grid",
          }}
        >
          {/* column 1 */}
          <GridCol
            span={{ base: 12, sm: 12, md: 6 }}
            classNames={{
              root: "about__column-root",
              col: "about__column-col col1",
              inner: "about__column-inner",
            }}
          >
            <Container className="about__column--content">
              <Flex direction="column" className="about__column--heading">
                <Text size="sm" className="heading__label">
                  Embracing Hospitality Excellence
                </Text>
                <Title order={1} className="heading-dark">
                  Our story
                </Title>
              </Flex>
              <Box className="about__column--text">
                <Text className="text-dark">
                  At Holidaze, our story began with a simple yet powerful idea -
                  to make travel more accessible, enjoyable, and personalized
                  for everyone. Founded by a team of passionate travelers who
                  understand the joy and excitement that comes with exploring
                  new destinations, Holidaze was born out of a desire to
                  simplify the booking process and elevate the overall travel
                  experience.
                </Text>
                <Text className="text-dark">
                  What started as a vision to connect travelers with their dream
                  accommodations has evolved into a thriving platform that
                  offers a curated selection of properties spanning across
                  diverse destinations. Our journey has been driven by a
                  relentless commitment to excellence, innovation, and customer
                  satisfaction, ensuring that every traveler who uses Holidaze
                  can embark on unforgettable getaways with ease.
                </Text>
              </Box>
            </Container>
          </GridCol>
          {/* column 2 */}
          <GridCol
            span={{ base: 12, sm: 12, md: 6 }}
            classNames={{
              root: "about__column-root",
              col: "about__column-col col2",
              inner: "about__column-inner",
            }}
          >
            <Box className="about__column--image-wrap">
              <img
                className="about__column--img"
                src={"./assets/about-us_img.png"}
                alt="view of Bergen"
              />
            </Box>
          </GridCol>
          {/* column 3 */}
          <GridCol
            span={{ base: 12, sm: 12, md: 6 }}
            classNames={{
              root: "about__column-root",
              col: "about__column-col col3",
              inner: "about__column-inner",
            }}
          >
            <Box className="about__column--image-wrap">
              <img
                className="about__column--img"
                src={"./assets/about-us_img-2.png"}
                alt="view of Bergen"
              />
            </Box>
          </GridCol>
          {/* column 4 */}
          <GridCol
            span={{ base: 12, sm: 12, md: 6 }}
            classNames={{
              root: "about__column-root",
              col: "about__column-col col4",
              inner: "about__column-inner",
            }}
          >
            <Container className="about__column--content">
              <Flex direction="column" className="about__column--heading">
                <Text size="sm" className="label-light">
                  another label here
                </Text>
                <Title order={2} className="heading-light">
                  The Holidaze Experience
                </Title>
              </Flex>
              <Box className="about__column--text ">
                <Text className="text-light">
                  At Holidaze, we understand that planning a trip can be
                  overwhelming. That&apos;s why we&apos;ve designed our platform
                  to provide a seamless and hassle-free experience. Our
                  intuitive search and filter options allow you to find the
                  perfect accommodation tailored to your preferences and budget.
                </Text>
                <Text className="text-light">
                  With detailed property listings, verified guest reviews, and
                  secure booking options, you can book with confidence, knowing
                  that your getaway is in good hands.
                </Text>
              </Box>
            </Container>
          </GridCol>
          {/* column 5 */}
          <GridCol
            span={{ base: 12, sm: 12, md: 6 }}
            classNames={{
              root: "about__column-root",
              col: "about__column-col col1",
              inner: "about__column-inner",
            }}
          >
            <Container className="about__column--content">
              <Flex direction="column" className="about__column--heading">
                <Text size="sm" className="heading__label">
                  Embracing Hospitality Excellence
                </Text>
                <Title order={2} className="heading-dark">
                  Our Commitment to You
                </Title>
              </Flex>
              <Box className="about__column--text">
                <Text className="text-dark">
                  We are dedicated to delivering exceptional service and
                  ensuring that your vacation experience exceeds your
                  expectations. Our team is passionate about travel and
                  committed to helping you find the ideal accommodation that
                  suits your unique needs.
                </Text>
                <Text className="text-dark">
                  Whether you&apos;re traveling solo, with family, or with a
                  group of friends, Holidaze is here to elevate your travel
                  experience.
                </Text>
              </Box>
            </Container>
          </GridCol>
          {/* column 6 */}
          <GridCol
            span={{ base: 12, sm: 12, md: 6 }}
            classNames={{
              root: "about__column-root",
              col: "about__column-col col2",
              inner: "about__column-inner",
            }}
          >
            <Box className="about__column--image-wrap">
              <img
                className="about__column--img"
                src={"./assets/about-us_img-3.jpg"}
                alt="view of Bergen"
              />
            </Box>
          </GridCol>
        </Grid>
      </Container>
    </section>
  );
}
