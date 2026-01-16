"use client";

import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";
import { IconLogOut } from "../icons";

const LogOutButton = () => {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })}
      leftSection={<IconLogOut color="var(--mantine-color-white)" />}
      type="submit"
    >
      Sign Out
    </Button>
  );
};

export default LogOutButton;
