import { useEffect, useState } from "react";
import { Menu, UnstyledButton, Group, rem } from "@mantine/core";
import { IconUser, IconHouse4, IconSettings } from "@/components/icons";
import { SignOutButton } from "@/components/ui";
import Link from "next/link";

const UserAccountNav = ({ user }) => {
  return (
    <Menu
      width={220}
      shadow="md"
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      withinPortal
      withArrow
    >
      <Menu.Target>
        <UnstyledButton className="avatarUser">
          <Group gap={7}>
            <IconUser stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      {/* --------------------------- */}
      <Menu.Dropdown>
        <Menu.Item disabled>
          {/* {user.user_metadata.username || user.email} */}
          placeholder username
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          component={Link}
          href={"/account"}
          leftSection={
            <IconUser
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          }
        >
          My page
        </Menu.Item>
        <Menu.Item
          component={Link}
          href={"/account/bookings"}
          leftSection={
            <IconHouse4
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          }
        >
          Bookings
        </Menu.Item>
        <Menu.Item
          component={Link}
          href={"/account/settings"}
          leftSection={
            <IconSettings
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          }
        >
          Settings
        </Menu.Item>
        <Menu.Divider />

        <SignOutButton />
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserAccountNav;
