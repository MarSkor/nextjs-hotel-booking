import { useTransition } from "react";
import { Button, rem, Text } from "@mantine/core";
import { IconLogOut } from "../icons";

const SignOutButton = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      //   onClick={() => handleClickSignOut()}
      disabled={isPending}
      className="btn align-content btn-signOut avatarUser__dropdown-link"
      variant="transparent"
      fullWidth
      leftSection={
        <IconLogOut
          style={{ width: rem(14), height: rem(14) }}
          stroke={1.5}
          color="var(--clr-icon-logout)"
        />
      }
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
};

export default SignOutButton;
