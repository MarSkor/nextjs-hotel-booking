// /* eslint-disable boundaries/no-unknown-files */
// import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request) {
  // return await updateSession(request);
}

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/reset-password",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf|woff2?|ico)$).*)",
  ],
};
