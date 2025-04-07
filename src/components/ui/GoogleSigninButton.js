"use client";
import { useTransition } from "react";
import { IconGoogle } from "@/components/icons";

import { useRouter } from "next/navigation";
import { Button } from "@mantine/core";

const GoogleSigninButton = (props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // const handleClickSignIn = (provider) => {
  //   startTransition(async () => {
  //     const { errorMessage, url } = await googleLoginAction(provider);
  //     if (!errorMessage && url) {
  //       router.push(url);
  //     }
  //   });
  // };
  return (
    <>
      {/* <Button
        fullWidth
        variant="outline"
        className="btn btn-outline"
        onClick={() => handleClickSignIn("google")}
        disabled={isPending}
        leftSection={<IconGoogle />}
      >
        {isPending ? "Signing in..." : props.text}
      </Button> */}
      <Button>Sign in with google</Button>
    </>
  );
};

export default GoogleSigninButton;
