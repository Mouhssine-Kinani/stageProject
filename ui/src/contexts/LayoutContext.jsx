"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/api";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log(
          "[LayoutContext] Vérification de l'authentification via API"
        );

        const { isAuthenticated: authStatus, user } = await checkAuth();
        console.log("[LayoutContext] Statut d'authentification:", authStatus);

        setIsAuthenticated(authStatus);

        // Liste des chemins publics qui ne nécessitent pas d'authentification
        const publicPaths = [
          "/login",
          "/register",
          "/reset",
          "/forget",
          "/forgot-password",
        ];

        const currentPath = window.location.pathname;
        console.log(`[LayoutContext] Chemin actuel: ${currentPath}`);

        // Vérifier si c'est une page publique
        const isPublicPage =
          publicPaths.includes(currentPath) ||
          currentPath.startsWith("/reset") ||
          currentPath === "/";

        if (authStatus) {
          console.log("[LayoutContext] Utilisateur authentifié");

          // Si l'utilisateur est authentifié et essaie d'accéder à la page de connexion,
          // rediriger vers la page d'accueil
          if (currentPath === "/login") {
            console.log(
              "[LayoutContext] Redirection de l'utilisateur authentifié vers l'accueil"
            );
            router.push("/home");
          }
        } else {
          console.log("[LayoutContext] Utilisateur non authentifié");

          // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
          // et que la page actuelle nécessite une authentification
          if (!isPublicPage) {
            console.log(
              "[LayoutContext] Redirection de l'utilisateur non authentifié vers la connexion"
            );
            router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
          }
        }
      } catch (error) {
        console.error(
          "[LayoutContext] Erreur lors de la vérification de l'authentification:",
          error
        );
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

  if (isLoading) {
    return <div className="root loading">Chargement...</div>;
  }

  return (
    <LayoutContext.Provider
      value={{
        isSidebarOpen,
        isNotificationOpen,
        isAuthenticated,
        toggleSidebar,
        toggleNotification,
      }}
    >
      <div className="root">{children}</div>
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
