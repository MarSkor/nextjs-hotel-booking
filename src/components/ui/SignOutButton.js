"use client";
import { useTransition } from "react";
import { Text, Button, rem } from "@mantine/core";
import { IconLogOut } from "../icons";

const SignOutButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleClickSignOut = () => {
    startTransition(async () => {
      const { errorMessage } = await signOutAction();
      if (!errorMessage) {
        toast.success("Successfully signed out");
      } else {
        toast.error(errorMessage);
      }
    });
  };
  return (
    // <Button
    //   onClick={() => handleClickSignOut()}
    //   disabled={isPending}
    //   className="btn align-content"
    //   variant="default"
    //   fullWidth
    //   leftSection={
    //     <IconLogOut style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
    //   }
    // >
    //   <Text size="sm">{isPending ? "Signing out..." : "Sign Out"}</Text>
    // </Button>
    <Button>Sign Out</Button>
  );
};

export default SignOutButton;
