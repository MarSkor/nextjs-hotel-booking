"use client";

import { getInitials } from "@/utils/Helpers";
import { Avatar, Box, Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import NavLink from "./NavLink";

export const AuthSection = ({ variant, session: initialSession }) => {
  const { data: session, status } = useSession({
    data: initialSession,
  });

  const currentSession = initialSession || session;
  const isAuthenticated = status === "authenticated" || !!initialSession;

  if (status === "loading" && !initialSession) {
    return variant === "desktop" ? (
      <div>
        <Loader size={16} />
      </div>
    ) : (
      <Skeleton height={40} width="100%" radius="md" />
    );
  }
  if (isAuthenticated && currentSession?.user) {
    if (variant === "desktop") {
      return (
        <Link href={"/account"} className="userAvatar__link">
          <Box className="userAvatar__inner">
            <Avatar
              className="userAvatar__avatar"
              radius="sm"
              size="md"
              name={getInitials(session.user.name) || null}
              alt={session.user.name}
              allowedInitialsColors={["var(--clr-brown-5)"]}
              color="initials"
            />
          </Box>
        </Link>
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
