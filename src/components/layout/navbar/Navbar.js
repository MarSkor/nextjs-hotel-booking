"use client";
import { Flex, Burger, Container, Group, Button, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavbarLogo from "./NavbarLogo";
import NavbarSmall from "./NavbarSmall";
import NavLink from "./NavLink";
import Link from "next/link";
import { AuthSection } from "./AuthSection";
import Search from "@/components/ui/Search";

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
            <Search />
            <AuthSection variant="desktop" />
            <Button
              className="btn btn-navbar btn-500"
              component={Link}
              href={"/accommodation"}
            >
              Explore Rooms
            </Button>
          </Group>

          <Group hiddenFrom="md">
            <Box hiddenFrom="md">
              <Search mobile />
            </Box>
            <Burger
              size={"sm"}
              lineSize={1}
              opened={opened}
              onClick={toggleDrawer}
              hiddenFrom="md"
              color="#c5bcb3"
            />
          </Group>
        </Flex>
        <NavbarSmall opened={opened} onClose={closeDrawer} />
      </Container>
    </nav>
  );
};

export default Navbar;
