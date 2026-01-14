import VerifyEmail from "@/features/auth/components/VerifyEmail";
import { auth } from "../../../../../auth";
import { verifyEmailToken } from "@/actions/email";
import { redirect } from "next/navigation";
import { findUserById } from "@/database/queries";

const VerifyEmailPage = async ({ searchParams }) => {
  console.log("searchParams", searchParams);
  const { token } = await searchParams;
  const session = await auth();

  if (!token) redirect("/account/account-details");

  if (!session?.user?.id) {
    const callbackUrl = encodeURIComponent(
      `/account/verify-email?token=${token}`
    );
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  const user = await findUserById(session.user.id);
  if (!user?.pendingEmail) {
    redirect("/account/account-details?already_verified=true");
  }

  const res = await verifyEmailToken(token);

  switch (res.status) {
    case "SUCCESS":
      return <VerifyEmail status="success" />;

    case "ALREADY_VERIFIED":
      return <VerifyEmail status="alreadyVerified" />;

    case "UNAUTHORIZED":
      return <VerifyEmail status="unauthorized" />;

    case "EXPIRED":
      return <VerifyEmail status="expired" />;

    case "INVALID":
      return <VerifyEmail status="invalid" />;

    default:
      return <VerifyEmail status="error" />;
  }
};

export default VerifyEmailPage;
