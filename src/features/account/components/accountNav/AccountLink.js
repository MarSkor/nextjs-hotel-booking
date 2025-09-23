"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, UnstyledButton } from "@mantine/core";

const AccountLink = ({ href, label }) => {
  const pathname = usePathname();

  const isActive =
    pathname === href || pathname?.startsWith(`my-account/${href}/`);

  return (
    <Box component="li" className="accountnav__link-item " radius={"sm"}>
      <UnstyledButton
        component={Link}
        className={`accountnav__link ${isActive ? "active" : ""}`}
        href={href}
        radius={"sm"}
      >
        {label}
      </UnstyledButton>
    </Box>
  );
};

export default AccountLink;
