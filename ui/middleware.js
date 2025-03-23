import { NextResponse } from "next/server";

// Configuration des chemins protégés et publics
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
 * Middleware d'authentification pour protéger les routes
 * Vérifie la présence du cookie userId
 */
export function middleware(request) {
  // Vérifier si le chemin est protégé
  const { pathname, search } = request.nextUrl;

  // Debug logs
  console.log(`[Middleware] Processing: ${pathname}${search}`);

  // Special case for reset password with token
  if (pathname === "/reset" && search && search.includes("token=")) {
    console.log(`[Middleware] Reset with token detected, allowing through`);
    return NextResponse.next();
  }

  // More logs
  console.log(`[Middleware] Not a reset with token path`);

  // Alternative approach
  const url = request.nextUrl;
  if (pathname === "/reset" && url.searchParams.has("token")) {
    console.log(`[Middleware] Reset with token detected via searchParams`);
    return NextResponse.next();
  }

  // Obtenir le cookie userId
  const userId = request.cookies.get("userId")?.value;

  // Vérifier si c'est un chemin public
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Si c'est un chemin public, laisser passer
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Déterminer si c'est un chemin protégé
  const isProtectedPath = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Si c'est un chemin protégé et que l'utilisateur n'est pas authentifié
  if (isProtectedPath && !userId) {
    console.log(
      `[Middleware] Redirection immédiate vers la page de connexion - ${pathname}`
    );

    // Créer l'URL de redirection avec le returnUrl pour revenir à cette page après la connexion
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("returnUrl", pathname);

    // Force la réponse à être un redirect complet, pas un rewrite
    return NextResponse.redirect(redirectUrl);
  }

  // Laisser passer pour toutes les autres demandes
  return NextResponse.next();
}

/**
 * Configuration des routes à protéger
 * Toutes ces routes nécessitent une authentification
 */
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * 1. /api (API routes)
     * 2. /_next (Next.js internal routes)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internal routes)
     * 5. /favicon.ico, sitemap.xml (static files)
     */
    "/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};
