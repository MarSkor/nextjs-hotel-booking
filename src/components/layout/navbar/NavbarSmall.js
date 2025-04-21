import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Drawer,
  ScrollArea,
  Divider,
  Flex,
  Box,
  Button,
  rem,
} from "@mantine/core";
import { IconCancel } from "@/components/icons";
import { NavLinks } from "./Navbar";
import NavLink from "./NavLink";

const NavbarSmall = ({ opened, onClose, user }) => {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      size="70%"
      padding="md"
      overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      hiddenFrom="md"
      zIndex={99999}
      closeButtonProps={{
        icon: <IconCancel size={20} stroke={1.5} color="#c5bcb3" />,
      }}
      classNames={{
        root: "navbar-sm__drawer-root",
        header: "navbar-sm__drawer-root__header",
        title: "navbar-sm__drawer-root__title",
        content: "navbar-sm__drawer-root__content",
      }}
    >
      <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
        <Box className="navbar-sm__list-items">
          <Divider my="sm" color="#282828" />
        </Box>
        <Flex
          className="navbar-sm__list-items"
          direction="column"
          gap="lg"
          align="end"
        >
          {NavLinks.map((item) => (
            <NavLink
              key={item.href}
              vp="sm"
              href={item.href}
              label={item.label}
            />
          ))}
        </Flex>

        <Box className="navbar-sm__list-items">
          <Divider my="sm" color="#282828" />
        </Box>

        <Flex
          className="navbar-sm__list-items"
          direction="column"
          gap="lg"
          align="end"
        >
          {user ? (
            <NavLink href="/account" label="My Account" vp="sm" />
          ) : (
            <NavLink href="/login" label="Log in" vp="sm" />
          )}
        </Flex>

        <Box className="navbar-sm__list-items">
          <Divider my="sm" mb="lg" color="#282828" />
        </Box>

        <Flex className="navbar-sm__list-items" direction="column" gap="lg">
          <Button
            className="btn btn-navbar navbar__link-sm-font"
            component={Link}
            href={"/accommodation"}
            size="md"
          >
            Explore Rooms
          </Button>
        </Flex>
      </ScrollArea>
    </Drawer>
  );
};

export default NavbarSmall;
