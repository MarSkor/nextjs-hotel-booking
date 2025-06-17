"use client";
import { useState } from "react";
import { Flex, Burger, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavbarLogo from "./NavbarLogo";
import NavbarSmall from "./NavbarSmall";
import NavbarRight from "./NavbarRight";
import NavLink from "./NavLink";

export const NavLinks = [
  { href: "/", label: "Home" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact us" },
];

const Navbar = () => {
  const [opened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [user, setUser] = useState(true);

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
          <NavbarRight />
          <Burger
            opened={opened}
            onClick={toggleDrawer}
            hiddenFrom="md"
            color="#c5bcb3"
          />
        </Flex>
        <NavbarSmall user={user} opened={opened} onClose={closeDrawer} />
      </Container>
    </nav>
  );
};

export default Navbar;
