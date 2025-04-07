"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Group, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavLinks } from "../data";
import NavLogo from "./NavLogo";
import RightSideNav from "./RightSideNav";
import NavbarSmall from "./NavBarSmall";

const Navbar = () => {
  const [opened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const pathname = usePathname();

  return (
    <header className="header">
      <nav className="header">
        <Group className="header__wrapper" h="100%" justify="space-between">
          <NavLogo />
          <Group h="100%" gap={0} visibleFrom="md">
            {NavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`header__link ${pathname === item.href ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </Group>
          <RightSideNav />
          <Burger
            opened={opened}
            onClick={toggleDrawer}
            hiddenFrom="md"
            color="#c5bcb3"
          />
        </Group>
        <NavbarSmall opened={opened} onClose={closeDrawer} />
      </nav>
    </header>
  );
};

export default Navbar;
