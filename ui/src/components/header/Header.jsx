"use client";
import "./header.css";
import { useLayout } from "@/contexts/LayoutContext";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";
import { useOneClients } from "@/hooks/useOneClients";
import { Moon, Sun, Menu, Bell, ChevronDown, User, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useRouter } from "next/navigation";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import useUser from "@/hooks/useUser";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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
  const { windowWidth, mounted } = useWindowWidth();
  const router = useRouter();
  const { userName: userNameFromContext, handleLogout } = useUser();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Path processing
  const parts = pathname.split("/").filter(Boolean);
  const isClientPage = parts.length >= 2 && parts[0] === "clients";
  const clientId = isClientPage ? parts[1] : null;

  // Maintenant on peut utiliser clientId en toute sécurité
  const { client, clientLoading } = useOneClients(clientId);

  let breadcrumb = parts.map((part, index) => {
    if (index === 1 && isClientPage) {
      return clientLoading
        ? "Loading..."
        : client?.client_reference
        ? `Client #CL0${client.client_reference}`
        : part;
    }
    return decodeURIComponent(part.replace(/-/g, " "));
  });

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    setIsDropdownOpen(false);
  };

  const handleConfirmLogout = async () => {
    await handleLogout();
    setLogoutDialogOpen(false);
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  // Ne pas rendre le contenu jusqu'à ce que le composant soit monté côté client
  if (!mounted) {
    return (
      <header className="area-header">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="area-header w-full flex flex-col md:flex-row justify-between items-center px-4 relative">
        {/* Zone gauche avec les boutons de toggle et le chemin de navigation */}
        <div className="div1 w-full md:w-auto flex items-center py-2">
          {/* Boutons de bascule pour tous les écrans */}
          <div className="toggle-buttons flex items-center space-x-2 mr-4">
            <button
              className="sidebar-toggle p-2 text-foreground hover:bg-muted rounded-full"
              onClick={toggleSidebar}
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <Menu size={isMobile ? 24 : 20} />
            </button>

            <button
              className="notification-toggle p-2 text-foreground hover:bg-muted rounded-full"
              onClick={toggleNotification}
              title={
                notificationOpen ? "Hide notifications" : "Show notifications"
              }
              aria-label={
                notificationOpen ? "Hide notifications" : "Show notifications"
              }
            >
              <Bell size={isMobile ? 24 : 20} />
            </button>
          </div>

          {/* Icône et chemin de navigation - masqué sur très petits écrans */}
          <div
            className={`flex items-center ${
              windowWidth < 400 ? "hidden" : "flex"
            }`}
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
            <ThemeSwitcher isMobile={windowWidth < 768} />

            <img
              src="/headerIcon/history.svg"
              alt="History"
              className="cursor-pointer"
            />

            <button
              onClick={toggleNotification}
              className="p-2 hover:bg-muted rounded-full"
            >
              <img src="/headerIcon/notification.svg" alt="Notifications" />
            </button>

            <div className="profile-dropdown-container relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 hover:bg-muted rounded-full flex items-center"
              >
                {/* <img src="/headerIcon/side.svg" alt="Profile" /> */}
                <LogOut size={16} />
                <span className="ml-1 md:inline-block"></span>
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
                    onClick={handleLogoutClick}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <ConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </>
  );
}
