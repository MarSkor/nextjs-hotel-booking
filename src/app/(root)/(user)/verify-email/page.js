import VerifyEmail from "@/features/auth/components/VerifyEmail";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import { verifyEmailToken } from "@/actions/email";

const VerifyEmailPage = async ({ searchParams }) => {
  const token = (await searchParams).token;
  console.log("verifyemailpage TOKEN: ", token);

  const session = await auth();
  if (!token) {
    return <VerifyEmail status="error" />;
  }
  if (!session?.user?.id) {
    redirect(`/login?next=/verify-email?token=${token}`);
  }
  const res = await verifyEmailToken(token, session.user.id);

  switch (res.status) {
    case "SUCCESS":
      return <VerifyEmail status="success" />;

    case "ALREADY_VERIFIED":
      return <VerifyEmail status="alreadyVerified" />;

    case "EXPIRED":
      return <VerifyEmail status="expired" />;

    case "INVALID":
      return <VerifyEmail status="invalid" />;

    default:
      return <VerifyEmail status="error" />;
  }
};

export default VerifyEmailPage;
