// useUser.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth, logout as apiLogout } from "@/lib/api";

/**
 * Hook pour gérer l'utilisateur actuel et son état d'authentification
 * @returns {Object} Données de l'utilisateur, état de chargement et erreurs
 */
const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Vérifier l'authentification via l'API
        const {
          isAuthenticated,
          user: userData,
          error: authError,
        } = await checkAuth();

        console.log("[useUser] Authentification vérifiée:", isAuthenticated);

        if (isAuthenticated && userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.log(
            "[useUser] Non authentifié ou données utilisateur manquantes"
          );
          setIsAuthenticated(false);

          if (authError) {
            throw authError;
          }
        }
      } catch (error) {
        console.error(
          "[useUser] Erreur lors de la vérification de l'authentification:",
          error
        );
        setError(
          error.message ||
            "Erreur lors de la récupération des données utilisateur"
        );
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  /**
   * Fonction pour déconnecter l'utilisateur
   */
  const handleLogout = async () => {
    try {
      // Appeler l'API de déconnexion
      const result = await apiLogout();

      console.log("[useUser] Résultat de la déconnexion:", result);

      // Que la déconnexion réussisse ou échoue, nous réinitialisons l'état
      setUser(null);
      setIsAuthenticated(false);

      // Rediriger vers la page de connexion
      router.push("/login");
    } catch (error) {
      console.error("[useUser] Erreur lors de la déconnexion:", error);

      // Même en cas d'erreur, nous réinitialisons l'état et redirigeons
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    }
  };

  return { user, loading, error, isAuthenticated, handleLogout };
};

export default useUser;
