"use client";

import { getInitials } from "@/utils/Helpers";
import { Avatar, Loader, Menu, Skeleton, UnstyledButton } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import NavLink from "./NavLink";
import {
  IconHouse4,
  IconLogOut,
  IconSettings,
  IconUser,
} from "@/components/icons";

export const AuthSection = ({ variant }) => {
  const { data: session, status } = useSession();

  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return variant === "desktop" ? (
      <div>
        <Loader size={16} />
      </div>
    ) : (
      <Skeleton height={40} width="100%" radius="md" />
    );
  }
  if (status === "authenticated" && session?.user) {
    if (variant === "desktop") {
      return (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton className="userAvatar__inner">
              <Avatar
                className="userAvatar__avatar"
                radius="sm"
                size="md"
                name={getInitials(session.user.name) || null}
                alt={session.user.name}
                allowedInitialsColors={["var(--clr-brown-5)"]}
                color="initials"
              />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              component={Link}
              href={"/account"}
              leftSection={<IconUser height={14} width={14} />}
            >
              Account
            </Menu.Item>
            <Menu.Item
              component={Link}
              href={"/account/booking-history"}
              leftSection={<IconHouse4 height={14} width={14} />}
            >
              Bookings
            </Menu.Item>
            <Menu.Item
              component={Link}
              href={"/account/settings"}
              leftSection={<IconSettings height={14} width={14} />}
            >
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onClick={handleLogOut}
              color="red"
              leftSection={<IconLogOut color="red" height={14} width={14} />}
            >
              Log Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      );
    }
    return <NavLink href="/account" label="My Account" vp="sm" />;
  }
  return (
    <NavLink
      href="/login"
      label="Log in"
      vp={variant === "desktop" ? "lg" : "sm"}
    />
  );
};
