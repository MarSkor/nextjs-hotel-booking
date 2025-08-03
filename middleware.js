export { auth as middleware } from "./auth";

//fix this
// if user is authenticated --> not be able to access log in or register pages. SE LAUOUT.JS FOR (AUTH)

// export async function middleware(request) {
//   //
// }

export const config = {
  matcher: [
    "/my-account/:path*",
    "/admin/:path*",
    "/reset-password",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf|woff2?|ico)$).*)",
  ],
};
