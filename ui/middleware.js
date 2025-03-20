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

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

/**
 * Middleware d'authentification pour protéger les routes
 * Vérifie la présence des cookies token et userId
 */
export function middleware(request) {
  // Vérifier si le chemin est protégé
  const { pathname } = request.nextUrl;

  // Obtenir les cookies d'authentification
  const token = request.cookies.get("token")?.value;
  const userId = request.cookies.get("userId")?.value;

  // Déterminer si c'est un chemin protégé
  const isProtectedPath = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Si c'est un chemin protégé et que l'utilisateur n'est pas authentifié
  if (isProtectedPath && (!token || !userId)) {
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
     * 5. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};
