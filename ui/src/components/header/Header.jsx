"use client";
import "./header.css";
import { useLayout } from "@/contexts/LayoutContext";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";
import { useClient } from "@/hooks/useOneClients";
import { Moon, Sun, Menu, Bell, ChevronDown, User, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useRouter } from "next/navigation";

export default function Header({
  isMobile = false,
  sidebarOpen = true,
  notificationOpen = true,
  toggleSidebar = () => {},
  toggleNotification = () => {},
}) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const router = useRouter();

  // Path processing
  const parts = pathname.split("/").filter(Boolean);
  const isClientPage = parts.length >= 2 && parts[0] === "clients";
  const clientId = isClientPage ? parts[1] : null;

  const { client, clientLoading } = useClient(clientId);

  let breadcrumb = parts.map((part, index) => {
    if (index === 1 && isClientPage) {
      return clientLoading
        ? "Chargement..."
        : client?.client_reference
        ? `Client #CL0${client.client_reference}`
        : part;
    }
    return decodeURIComponent(part.replace(/-/g, " "));
  });

  // Détecter la taille de la fenêtre pour les adaptations responsives
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Récupérer le nom d'utilisateur depuis le cookie
  useEffect(() => {
    const storedUserName = Cookies.get("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setUserName("User");
    }
  }, []);

  const handleLogout = () => {
    // Supprimer les cookies
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("userName");

    // Rediriger vers la page de login
    router.push("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        !event.target.closest(".profile-dropdown-container")
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="area-header w-full flex flex-col md:flex-row justify-between items-center px-4 relative">
      {/* Zone gauche avec les boutons de toggle et le chemin de navigation */}
      <div className="div1 w-full md:w-auto flex items-center py-2">
        {/* Boutons de bascule pour tous les écrans */}
        <div className="toggle-buttons flex items-center space-x-2 mr-4">
          <button
            className="sidebar-toggle p-2 text-foreground hover:bg-muted rounded-full"
            onClick={toggleSidebar}
            title={
              sidebarOpen
                ? "Masquer la barre latérale"
                : "Afficher la barre latérale"
            }
            aria-label={
              sidebarOpen
                ? "Masquer la barre latérale"
                : "Afficher la barre latérale"
            }
          >
            <Menu size={isMobile ? 24 : 20} />
          </button>

          <button
            className="notification-toggle p-2 text-foreground hover:bg-muted rounded-full"
            onClick={toggleNotification}
            title={
              notificationOpen
                ? "Masquer les notifications"
                : "Afficher les notifications"
            }
            aria-label={
              notificationOpen
                ? "Masquer les notifications"
                : "Afficher les notifications"
            }
          >
            <Bell size={isMobile ? 24 : 20} />
          </button>
        </div>

        {/* Icône et chemin de navigation - masqué sur très petits écrans */}
        <div
          className="flex items-center"
          style={{ display: windowWidth < 400 ? "none" : "flex" }}
        >
          <img src="/headerIcon/star.svg" alt="" className="mx-2" />
          <p className="text-sm md:text-base truncate max-w-[150px] md:max-w-[350px] lg:max-w-full">
            dashboard / {breadcrumb.join(" / ")}
          </p>
        </div>
      </div>

      {/* Barre de recherche et icônes */}
      <div className="div2 w-full md:w-auto flex items-center justify-between md:justify-end py-2">
        <input
          type="text"
          placeholder="  Search"
          className="search-input flex-grow md:flex-grow-0 max-w-[250px] md:max-w-[200px] lg:max-w-[300px]"
        />

        <div className="iconsHolder flex items-center space-x-1 md:space-x-3">
          <ThemeSwitcher isMobile={isMobile} />

          <img
            src="/headerIcon/history.svg"
            alt="History"
            className="cursor-pointer"
          />

          {/* Notification button in header icons area - visible on all screens but has different behavior */}
          <button
            onClick={toggleNotification}
            className="p-2 hover:bg-muted rounded-full"
          >
            <img src="/headerIcon/notification.svg" alt="Notifications" />
          </button>

          <div className="profile-dropdown-container relative">
            <button
              onClick={toggleDropdown}
              className="p-2 hover:bg-muted rounded-full flex items-center"
            >
              <img src="/headerIcon/side.svg" alt="Profile" />
              <span className="ml-1 hidden md:inline-block">{userName}</span>
              <ChevronDown
                size={16}
                className="hidden md:block ml-1 transition-transform"
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "none",
                }}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-background rounded-md shadow-lg border border-border z-20">
                <button
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm hover:bg-muted"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
