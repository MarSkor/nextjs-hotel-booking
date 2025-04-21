import { Menu, UnstyledButton, Group, rem, Text } from "@mantine/core";
import {
  IconUser,
  IconHouse4,
  IconSettings,
  IconLogOut,
} from "@/components/icons";
import Link from "next/link";
import { SignOutButton } from "@/components/ui";

const NavbarUserAccount = ({ user }) => {
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
          <Group gap={8}>
            <IconUser color="#eae6e4" stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      {/* --------------------------- */}
      <Menu.Dropdown>
        <Menu.Item disabled>User account name here</Menu.Item>
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
          <Text size="sm" className="avatarUser__dropdown-link">
            My page
          </Text>
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
          <Text size="sm" className="avatarUser__dropdown-link">
            {" "}
            Bookings
          </Text>
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
          <Text size="sm" className="avatarUser__dropdown-link">
            Settings
          </Text>
        </Menu.Item>
        <Menu.Divider />

        <SignOutButton />
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavbarUserAccount;
