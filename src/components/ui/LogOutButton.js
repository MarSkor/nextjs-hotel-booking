"use client";
import { signOut } from "next-auth/react";
import { useTransition } from "react";
import { Button, rem } from "@mantine/core";
import { IconLogOut } from "../icons";

const LogOutButton = (props) => {
  const [isPending, startTransition] = useTransition();

  const handleLogOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <Button
      onClick={handleLogOut}
      disabled={isPending}
      className={`btn-logout ${
        isPending ? "btn cursor-not-allowed" : "bg-red"
      }`}
      leftSection={
        <IconLogOut
          style={{ width: rem(20), height: rem(20) }}
          stroke={1.5}
          color={props.color}
        />
      }
      size="md"
      variant="outline"
      color={props.color}
      fullWidth
      radius={"sm"}
    >
      {isPending ? "Logging out..." : "Log Out"}
    </Button>
  );
};

export default LogOutButton;
