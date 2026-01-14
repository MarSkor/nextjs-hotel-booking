import PasswordForm from "@/features/account/forms/PasswordForm";
import { Center, Container, Loader } from "@mantine/core";
import { resetPassword } from "@/actions/password";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const ResetPasswordPage = async ({ searchParams }) => {
  const { token } = await searchParams;
  if (!token) redirect("/login");

  return (
    <Container w={"100%"} mt={"xl"}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Loader />
          </Center>
        }
      >
        <PasswordForm
          mode="RESET_PASSWORD"
          handleFormOnSubmit={resetPassword}
        />
      </Suspense>
    </Container>
  );
};

export default ResetPasswordPage;
