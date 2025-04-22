import Link from "next/link";
import {
  Text,
  Container,
  ActionIcon,
  Group,
  rem,
  Box,
  Flex,
  Title,
  Anchor,
} from "@mantine/core";
import NavbarLogo from "../navbar/NavbarLogo";
import { FooterData } from "./data";
import { IconFacebook, IconInstagram, IconTwitter } from "@/components/icons";

const Footer = () => {
  const groups = FooterData.map((group) => {
    const links = group.links.map((item, index) => (
      <Anchor
        component={Link}
        key={index}
        href={item.link}
        className="footer__link"
        c={"var(--clr-footer-link)"}
        underline="hover"
        size="sm"
      >
        {item.label}
      </Anchor>
    ));
    return (
      <Flex
        key={group.title}
        m="sm"
        className="footer__wrapper-links"
        align={{ base: "center", sm: "center", md: "flex-start" }}
        direction="column"
      >
        <Title
          mb="md"
          order={4}
          c="var(--clr-gray-text"
          className="footer__title"
        >
          {group.title}
        </Title>
        {links}
      </Flex>
    );
  });
  return (
    <footer className="footer">
      <Container
        pt="xl"
        pb="xl"
        component="section"
        className="container footer__inner"
        size="xl"
      >
        <Flex
          direction={{ base: "column", sm: "column", md: "row" }}
          justify="space-between"
        >
          <Box className="footer__logo" mb={{ base: "md", sm: "sm", md: "0" }}>
            <NavbarLogo />
            <Text
              mt="md"
              size="sm"
              className="footer__description"
              c="var(--clr-gray-text"
            >
              Explore, book and unwind with Holidaze.
            </Text>
            <Text
              mt="xs"
              size="sm"
              className="footer__description"
              c="var(--clr-gray-text"
            >
              Your gateway to unforgettable stays in Bergen, Norway.
            </Text>
          </Box>
          <Flex
            className="footer__groups"
            direction={{ base: "column", sm: "column", md: "row" }}
            align={{ base: "center", sm: "center", md: "flex-start" }}
            gap={{ base: "xs", sm: "sm", md: "xl" }}
          >
            {groups}
          </Flex>
        </Flex>
      </Container>
      {/* ---------------------------------------------
      Bottom part of footer // Copyright etc.
      */}
      <Container
        component="section"
        className="footer__afterFooter"
        size="xl"
        pb="xl"
      >
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: "column", md: "row" }}
        >
          <Text
            c="var(--clr-brown-text)"
            size="sm"
            mb={{ base: "md", sm: "md", md: "0" }}
          >
            © 2024 Holidaze. All rights reserved.
          </Text>

          <Anchor
            c="var(--clr-brown-text)"
            size="sm"
            mb={{ base: "md", sm: "md", md: "0" }}
            underline="hover"
          >
            Source Code
          </Anchor>

          <Group className="footer__social" justify="flex-end" wrap="nowrap">
            <ActionIcon size="lg" variant="subtle">
              <IconTwitter
                color="var(--clr-brown-text)"
                style={{ width: rem(26), height: rem(26) }}
                stroke={1.5}
              />
            </ActionIcon>
            <ActionIcon size="lg" variant="subtle">
              <IconFacebook
                color="var(--clr-brown-text)"
                style={{ width: rem(26), height: rem(26) }}
                stroke={1.5}
              />
            </ActionIcon>
            <ActionIcon size="lg" variant="subtle">
              <IconInstagram
                color="var(--clr-brown-text)"
                style={{ width: rem(26), height: rem(26) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        </Flex>
      </Container>
    </footer>
  );
};

export default Footer;
