import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Drawer, ScrollArea, Divider, Group, Button, rem } from "@mantine/core";
import { IconCancel } from "@/components/icons";
import { NavLinks } from "../data";

const NavbarSmall = ({ opened, onClose }) => {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      size="85%"
      padding="md"
      title="Holidaze"
      hiddenFrom="md"
      zIndex={1000000}
      closeButtonProps={{
        icon: <IconCancel size={20} stroke={1.5} color="#c5bcb3" />,
      }}
      classNames={{
        root: "header__drawer-root",
        header: "header__drawer-root__header",
        title: "header__drawer-root__title",
        content: "header__drawer-root__content",
      }}
    >
      <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
        <Divider my="sm" color="#282828" />
        {NavLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`header__link ${pathname === item.href ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
        <Divider my="sm" color="#282828" />

        <Group
          justify="center"
          grow
          pb="xl"
          px="md"
          className="header__btn-group"
        >
          {/* <UserAccountNav /> */}
          <Button
            variant="transparent"
            component={Link}
            href={"/login"}
            color="#c5bcb3"
          >
            Log in
          </Button>
          <Button
            variant="outline"
            color="#c5bcb3"
            component={Link}
            href={"/accommodation"}
            className="btn-primary"
          >
            Book Now
          </Button>
        </Group>
      </ScrollArea>
    </Drawer>
  );
};

export default NavbarSmall;
