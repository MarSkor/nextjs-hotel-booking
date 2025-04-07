"use client";
import { Text, Container, ActionIcon, Group, rem } from "@mantine/core";
import NavLogo from "./navbar/NavLogo";
import { FooterData } from "./data";
import { IconFacebook, IconInstagram, IconTwitter } from "../icons";

const Footer = () => {
  const groups = FooterData.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className="footer__link"
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className="footer__wrapper-links" key={group.title}>
        <Text className="footer__title">{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className="footer">
      <Container className="container footer__inner">
        <div className="footer__logo">
          <NavLogo />
          <Text size="sm" className="footer__description">
            Explore, book and unwind with Holidaze. Your gateway to
            unforgettable stays in Bergen, Norway.
          </Text>
        </div>
        <div className="footer__groups">{groups}</div>
      </Container>
      <Container className="footer__afterFooter">
        <Text size="sm">© 2024 Holidaze. All rights reserved.</Text>

        <Group
          gap={0}
          className="footer__social"
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" variant="subtle">
            <IconTwitter
              color="#c5bcb3"
              style={{ width: rem(26), height: rem(26) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" variant="subtle">
            <IconFacebook
              color="#c5bcb3"
              style={{ width: rem(26), height: rem(26) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" variant="subtle">
            <IconInstagram
              color="#c5bcb3"
              style={{ width: rem(26), height: rem(26) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
};

export default Footer;
