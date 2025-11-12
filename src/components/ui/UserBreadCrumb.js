"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Anchor, Breadcrumbs } from "@mantine/core";

const UserBreadCrumb = () => {
  const path = usePathname();
  if (path === "/account") return null;

  const pathSegments = path.split("/").filter(Boolean);

  const prettifyTitle = (segment) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const crumbs = pathSegments.map((segment, i) => ({
    title: prettifyTitle(segment),
    href: "/" + pathSegments.slice(0, i + 1).join("/"),
  }));

  const breadCrumbs = crumbs.map((crumb, i) => (
    <Anchor
      component={Link}
      href={crumb.href}
      key={crumb.href}
      c={i === crumbs.length - 1 ? "dimmed" : "blue"}
    >
      {crumb.title}
    </Anchor>
  ));

  return <Breadcrumbs mb={"md"}>{breadCrumbs}</Breadcrumbs>;
};

export default UserBreadCrumb;
