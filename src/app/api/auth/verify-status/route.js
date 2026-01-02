import { verifyEmailToken } from "@/actions/email";
import { verificationStatus } from "@/lib/verification-status";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { status: verificationStatus.FORBIDDEN },
      { status: 401 }
    );
  }

  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      { status: verificationStatus.INVALID },
      { status: 400 }
    );
  }

  const res = await verifyEmailToken(token, session.user.id);

  const httpStatusMap = {
    [verificationStatus.SUCCESS]: 200,
    [verificationStatus.ALREADY_VERIFIED]: 200,
    [verificationStatus.EXPIRED]: 410,
    [verificationStatus.INVALID]: 400,
    [verificationStatus.FORBIDDEN]: 403,
  };

  return NextResponse.json(res, {
    status: httpStatusMap[res.status] ?? 400,
  });
}
