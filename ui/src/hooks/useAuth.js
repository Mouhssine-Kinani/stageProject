"use client";

import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      // Supprimer le cookie de manière native
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Rediriger vers la page de connexion
      router.push("/login");

      // Forcer le rafraîchissement de la page pour effacer l'état
      router.refresh();
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  return { logout };
};
