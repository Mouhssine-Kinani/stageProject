// useUser.js
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

axios.defaults.withCredentials = true;
const URLAPI = process.env.NEXT_PUBLIC_URLAPI;

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
        setLoading(true);

        // Vérifier si les cookies existent avant de faire la requête
        const tokenCookie = document.cookie.includes("token=");
        const userIdCookie = document.cookie.includes("userId=");

        if (!tokenCookie || !userIdCookie) {
          console.error("[useUser] Cookies d'authentification manquants");
          setError("Cookies d'authentification manquants");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        console.log(
          "[useUser] Tentative de récupération des données utilisateur"
        );

        // Essayer d'abord de récupérer les données du localStorage pour un affichage rapide
        try {
          const cachedUser = localStorage.getItem("userData");
          if (cachedUser) {
            const parsedUser = JSON.parse(cachedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            console.log(
              "[useUser] Données utilisateur récupérées du localStorage:",
              parsedUser
            );
          }
        } catch (e) {
          console.warn(
            "[useUser] Erreur lors de la récupération des données du localStorage:",
            e
          );
        }

        // Ensuite, faire une requête API pour obtenir les données à jour
        const response = await axios.get(`${URLAPI}/users/me`, {
          withCredentials: true,
        });

        if (response.data && response.status === 200) {
          const userData = response.data;
          setUser(userData);
          setIsAuthenticated(true);

          // Mettre à jour le cache si les données ont changé
          try {
            localStorage.setItem("userData", JSON.stringify(userData));
          } catch (e) {
            console.warn(
              "[useUser] Erreur lors de la mise en cache des données:",
              e
            );
          }

          console.log(
            "[useUser] Données utilisateur mises à jour depuis l'API"
          );
        } else {
          throw new Error("Réponse API invalide");
        }
      } catch (error) {
        console.error("[useUser] Erreur:", error);

        // Si l'erreur est liée à l'authentification (401 ou 403), nettoyer les cookies
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          console.log("[useUser] Erreur d'authentification, déconnexion");
          Cookies.remove("token", { path: "/" });
          Cookies.remove("userId", { path: "/" });
          localStorage.removeItem("userData");
          setIsAuthenticated(false);
        }

        setError(
          error.message ||
            "Erreur lors de la récupération des données utilisateur"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  /**
   * Fonction pour déconnecter l'utilisateur
   */
  const logout = async () => {
    try {
      // Appeler l'API de déconnexion
      await axios.post(`${URLAPI}/auth/logout`, {}, { withCredentials: true });
      console.log("[useUser] Déconnexion réussie via API");
    } catch (error) {
      console.error("[useUser] Erreur lors de la déconnexion via API:", error);
    } finally {
      // Nettoyer les cookies et le localStorage même si l'API échoue
      Cookies.remove("token", { path: "/" });
      Cookies.remove("userId", { path: "/" });
      localStorage.removeItem("userData");

      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    }
  };

  return { user, loading, error, isAuthenticated, logout };
};

export default useUser;
