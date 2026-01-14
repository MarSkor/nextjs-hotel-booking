import React from "react";
import { auth } from "../../../../../../../auth";
import { redirect } from "next/navigation";
import PasswordForm from "@/features/account/forms/PasswordForm";
import { Box } from "@mantine/core";
import { changePassword } from "@/actions/password";

const ChangePasswordPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <Box className="accountdetails__wrapper" mt={"xl"}>
      <PasswordForm
        mode="CHANGE_PASSWORD"
        handleFormOnSubmit={changePassword}
      />
    </Box>
  );
};

export default ChangePasswordPage;
