import { NextResponse } from "next/server";

export function middleware(req) {
  // Access cookies directly from the 'req' object
  const token = req.cookies.get("token");

  // If no token is found, redirect to login
  if (!token) {
    console.log("No token found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If a token is found, continue with the request
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
