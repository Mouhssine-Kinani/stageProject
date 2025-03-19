import { NextResponse } from "next/server";

export function middleware(req) {
  // Access cookies directly from the 'req' object
  const token = req.cookies.get("token");
  const userId = req.cookies.get("userId");

  // Debug logs (visibles uniquement dans les logs serveur)
  console.log("Token in middleware:", token?.value);
  console.log("UserId in middleware:", userId?.value);

  // If no token or userId is found, redirect to login
  if (!token || !userId) {
    console.log("Authentication credentials missing, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If credentials exist, continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/clients/:path*",
    "/products/:path*",
    "/reminders/:path*",
    "/users/:path*",
    "/settings/:path*",
  ],
};
