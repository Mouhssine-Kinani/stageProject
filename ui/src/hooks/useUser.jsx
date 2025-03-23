// useUser.js
"use client";
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
        // Récupérer le token du localStorage et userId du cookie
        const token = localStorage.getItem("authToken");
        const userId = Cookies.get("userId");

        console.log(
          "[useUser] Token (localStorage):",
          token ? "Présent" : "Absent"
        );
        console.log("[useUser] UserId (cookie):", userId);

        if (!token || !userId) {
          console.log("[useUser] Token ou userId manquant, non authentifié");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Essayer d'abord de récupérer les données utilisateur depuis le localStorage
        const userDataFromStorage = localStorage.getItem("userData");
        console.log(
          "[useUser] Données du localStorage:",
          userDataFromStorage ? "Présentes" : "Absentes"
        );

        if (userDataFromStorage) {
          try {
            const parsedUserData = JSON.parse(userDataFromStorage);
            console.log("[useUser] Données parsées du localStorage:OK");
            setUser(parsedUserData);
            setIsAuthenticated(true);
          } catch (parseError) {
            console.error(
              "[useUser] Erreur de parsing des données du localStorage:",
              parseError
            );
            localStorage.removeItem("userData");
          }
        }

        // Requête API pour obtenir les données utilisateur à jour
        console.log("[useUser] Requête API pour les données utilisateur");
        const response = await axios.get(`${URLAPI}/users/${userId}`, {
          headers: {
            Authorization: token, // Utiliser directement le token du localStorage
          },
          withCredentials: true,
        });

        console.log("[useUser] Réponse API:", response.data ? "OK" : "Erreur");

        // Mettre à jour les données utilisateur dans le state et dans le localStorage
        if (response.data.success && response.data.data) {
          setUser(response.data.data);
          localStorage.setItem("userData", JSON.stringify(response.data.data));
          setIsAuthenticated(true);
        } else {
          throw new Error("Format de réponse invalide");
        }
      } catch (error) {
        console.error(
          "[useUser] Erreur lors de la récupération des données:",
          error
        );

        // Si l'erreur est liée à l'authentification (401 ou 403), nettoyer les cookies et localStorage
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          console.log("[useUser] Erreur d'authentification, déconnexion");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          Cookies.remove("userId", { path: "/" });
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
  const handleLogout = async () => {
    try {
      // Récupérer l'ID utilisateur depuis les cookies
      const userId = Cookies.get("userId");
      const token = localStorage.getItem("authToken");

      // Appeler l'API pour mettre à jour lastLogin_date
      if (userId && token) {
        await axios.post(
          `${URLAPI}/users/logout`,
          {},
          {
            headers: { Authorization: token },
            withCredentials: true,
          }
        );
        console.log("[useUser] LastLogin_date mise à jour via API");
      }

      // Appeler l'API de déconnexion pour le token
      await axios.post(`${URLAPI}/auth/logout`, {}, { withCredentials: true });
      console.log("[useUser] Déconnexion réussie via API");
    } catch (error) {
      console.error("[useUser] Erreur lors de la déconnexion via API:", error);
    } finally {
      // Nettoyer le localStorage et les cookies
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      // Nettoyer le cookie userId
      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = {
        path: "/",
        sameSite: isProduction ? "None" : "Lax",
        secure: isProduction,
      };

      Cookies.remove("userId", cookieOptions);

      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    }
  };

  return { user, loading, error, isAuthenticated, handleLogout };
};

export default useUser;
