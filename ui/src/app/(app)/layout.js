"use client";
import "../globals.css";
import SideBar from "@/components/sidebar/SideBar";
import Header from "@/components/header/Header";
import Content from "@/components/content/dashbord";
import NotificationPanel from "@/components/notification/NotificationPanel";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { useState, useEffect } from "react";
import { Menu, Bell, X } from "lucide-react";

export default function AppLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(true);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);

      // Sur mobile, fermer automatiquement les panneaux
      if (width <= 768) {
        setSidebarOpen(false);
        setNotificationOpen(false);
      }
      // Sur tablette, fermer automatiquement le panneau de notification
      else if (width <= 1024) {
        setNotificationOpen(false);
      }
    };

    // Vérifier au chargement initial
    checkScreenSize();

    // Ajouter un écouteur d'événement pour les changements de taille d'écran
    window.addEventListener("resize", checkScreenSize);

    // Nettoyer l'écouteur d'événement lors du démontage
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fermer les panneaux quand on clique ailleurs sur mobile
  useEffect(() => {
    if (isMobile) {
      const handleClickOutside = (e) => {
        // Si la sidebar est ouverte et qu'on clique en dehors
        if (
          sidebarOpen &&
          !e.target.closest(".area-sidebar") &&
          !e.target.closest(".sidebar-toggle")
        ) {
          setSidebarOpen(false);
        }

        // Si le panneau de notification est ouvert et qu'on clique en dehors
        if (
          notificationOpen &&
          !e.target.closest(".notification-panel") &&
          !e.target.closest(".notification-toggle")
        ) {
          setNotificationOpen(false);
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMobile, sidebarOpen, notificationOpen]);

  // Classes conditionnelles pour la mise en page
  const layoutClasses = [
    "grid-areas-layout",
    !sidebarOpen ? "sidebar-closed" : "",
    !notificationOpen ? "notification-closed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Fonction de bascule pour la sidebar et le panneau de notification
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleNotification = () => setNotificationOpen(!notificationOpen);

  return (
    <LayoutProvider>
      <div className={layoutClasses}>
        {/* Sidebar avec classe conditionnelle basée sur l'état mobile et ouvert/fermé */}
        <div className={`area-sidebar ${!sidebarOpen ? "closed" : ""}`}>
          {/* Bouton de fermeture sur mobile seulement */}
          {isMobile && sidebarOpen && (
            <button
              className="absolute top-4 right-4 z-50 bg-primary text-primary-foreground rounded-full p-1"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          )}
          <SideBar />
        </div>

        {/* Header modifié pour desktop/tablette/mobile avec les props nécessaires */}
        <div className="area-header">
          {/* Passer les fonctions de toggle et l'état au Header */}
          <Header
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            notificationOpen={notificationOpen}
            toggleSidebar={toggleSidebar}
            toggleNotification={toggleNotification}
          />
        </div>

        {/* Contenu principal */}
        <Content>{children}</Content>

        {/* Panneau de notification avec classe conditionnelle */}
        <div
          className={`notification-panel ${
            isMobile
              ? notificationOpen
                ? "open"
                : "closed"
              : !notificationOpen
              ? "closed"
              : ""
          }`}
        >
          {/* Bouton de fermeture sur mobile seulement */}
          {isMobile && notificationOpen && (
            <button
              className="absolute top-4 left-4 z-50 bg-primary text-primary-foreground rounded-full p-1"
              onClick={() => setNotificationOpen(false)}
            >
              <X size={24} />
            </button>
          )}
          <NotificationPanel />
        </div>
      </div>
    </LayoutProvider>
  );
}
