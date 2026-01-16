"use client";
import { Flex, Burger, Container, Group, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavbarLogo from "./NavbarLogo";
import NavbarSmall from "./NavbarSmall";
import NavLink from "./NavLink";
import Link from "next/link";
import { AuthSection } from "./AuthSection";

export const NavLinks = [
  { href: "/", label: "Home" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact us" },
];

const Navbar = () => {
  const [opened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <nav className="navbar-lg__outer">
      <Container size="xl" className="navbar-lg__inner">
        <Flex justify="space-between" align="center">
          <NavbarLogo />
          <Flex visibleFrom="md" gap="lg" className="navbar-lg__list-items">
            {NavLinks.map((item) => (
              <NavLink
                key={item.href}
                vp="lg"
                href={item.href}
                label={item.label}
              />
            ))}
          </Flex>
          <Group visibleFrom="md" className="navbar__right">
            {/* <SearchBar/> */}
            <AuthSection variant="desktop" />
            <Button
              className="btn btn-navbar btn-500"
              component={Link}
              href={"/accommodation"}
            >
              Explore Rooms
            </Button>
          </Group>
          <Burger
            opened={opened}
            onClick={toggleDrawer}
            hiddenFrom="md"
            color="#c5bcb3"
          />
        </Flex>
        <NavbarSmall opened={opened} onClose={closeDrawer} />
      </Container>
    </nav>
  );
};

export default Navbar;
