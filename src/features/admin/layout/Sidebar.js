"use client";
import {
  AppShellNavbar,
  AppShellSection,
  Box,
  Burger,
  Flex,
  Title,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AdminLogOut from "./AdminLogOut";

export const sideBarLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/accommodations", label: "Accommodations" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

const SidebarLink = ({ href, label, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`/admin/${href}/`);

  return (
    <Box component="li" className={`sidebar__list-item`} mb={"sm"}>
      <Box
        component={Link}
        p={"xs"}
        href={href}
        className={`sidebar__link ${isActive && "active"}`}
        onClick={onClick}
      >
        {label}
      </Box>
    </Box>
  );
};

const Sidebar = ({ opened, onClick, session }) => {
  return (
    <AppShellNavbar p="xs" className="appshellnavbar__wrapper">
      <AppShellSection>
        <Burger
          mb={"lg"}
          opened={opened}
          onClick={onClick}
          hiddenFrom="sm"
          size="sm"
        />
      </AppShellSection>

      <AppShellSection className="appshellnavbar__wrapper-inner">
        <Flex direction={"column"} className="appshellnavbar__inner">
          <Flex align={"center"} mb={"xl"}>
            <Image
              src="/assets/logo/logo_small.svg"
              height={37}
              width={37}
              alt="logo"
            />
            <Title order={1} size={"h4"} ml={"xs"}>
              Holidaze
            </Title>
          </Flex>
          <Box component="ul" className="appshellnavbar__ul">
            {sideBarLinks.map((item, i) => (
              <SidebarLink key={item.href} {...item} onClick={onClick} />
            ))}
          </Box>
        </Flex>
        <SidebarLink
          href={"/account"}
          label={"Back to Holidaze"}
          onClick={onClick}
        />
        <AdminLogOut session={session} />
      </AppShellSection>
    </AppShellNavbar>
  );
};

export default Sidebar;
