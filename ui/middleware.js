import { NextResponse } from "next/server";

// Configuration of protected and public paths
const PROTECTED_PATHS = [
  "/home",
  "/clients",
  "/products",
  "/reminders",
  "/users",
  "/settings",
];

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset",
  "/forget",
];

/**
 * Middleware de redirection basique
 * Note: Avec httpOnly: true, nous ne pouvons pas vérifier les cookies côté client
 * Nous devons donc vérifier l'authentification sur les pages protégées elles-mêmes
 */
export function middleware(request) {
  // Extract URL information
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Processing request for path: ${pathname}`);

  // Special case for password reset with token
  if (pathname === "/reset" && request.nextUrl.searchParams.has("token")) {
    console.log("[Middleware] Password reset with token, allowing");
    return NextResponse.next();
  }

  // Special case for root - we let this pass since it will be handled by its own redirection
  if (pathname === "/") {
    console.log("[Middleware] Root path, allowing");
    return NextResponse.next();
  }

  // Check if it's a public path
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If it's a public path, let the request pass
  if (isPublicPath) {
    console.log(`[Middleware] Public path ${pathname}, allowing`);
    return NextResponse.next();
  }

  // Let all requests through to be handled by client-side authentication checks
  // This is because with httpOnly cookies, middleware can't check authentication
  console.log(
    `[Middleware] Allowing request to ${pathname}, authentication will be checked by the page component`
  );
  return NextResponse.next();
}

/**
 * Configuration of routes to apply middleware
 */
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internal routes)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internal routes)
     * 5. /favicon.ico, sitemap.xml (static files)
     */
    "/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};
