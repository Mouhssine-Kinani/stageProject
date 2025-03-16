import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // Si l'URL est dans le dossier (app)
  if (request.nextUrl.pathname.includes("/(app)")) {
    if (!token) {
      // Rediriger vers login si pas de token
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Vérifier le token avec le backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Token invalide, supprimer le cookie et rediriger
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }

      // Token valide, continuer
      return NextResponse.next();
    } catch (error) {
      // Erreur de connexion au backend, rediriger par sécurité
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Pour les autres routes, continuer normalement
  return NextResponse.next();
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    // Protéger les routes (app)
    "/(app)/:path*",

    // Exclure les routes publiques
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
