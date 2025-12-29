import React from "react";
import VerifyEmail from "@/features/auth/components/VerifyEmail";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import { verifyEmailToken } from "@/actions/email";

const VerifyEmailPage = async ({ searchParams }) => {
  const { token } = await searchParams;
  const session = await auth();

  if (!token) {
    return <VerifyEmail status="error" />;
  }

  if (!session?.user?.id) {
    redirect(`/login?next=/verify-email?token=${token}`);
  }

  const res = await verifyEmailToken({ token, userId: session.user.id });

  switch (res.status) {
    case "success":
      return <VerifyEmail status="success" />;

    case "expired":
      return <VerifyEmail status="error" />;

    case "invalid":
    case "forbidden":
    default:
      return <VerifyEmail status="error" />;
  }
};

export default VerifyEmailPage;
