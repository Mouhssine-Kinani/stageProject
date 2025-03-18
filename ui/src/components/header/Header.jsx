"use client";
import "./header.css";
import { useLayout } from "@/contexts/LayoutContext";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";
import { useClient } from "@/hooks/useOneClients";
import { Moon } from "lucide-react";
import { Sun } from "lucide-react";

export default function Header() {
  const { toggleSidebar, toggleNotification } = useLayout();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

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

  return (
    <header className="area-header">
      <div className="div1">
        <button onClick={toggleSidebar}>
          <img src="/headerIcon/side.svg" alt="Toggle sidebar" />
        </button>
        <img src="/headerIcon/star.svg" alt="" />
        <p>dashboard / {breadcrumb.join(" / ")}</p>
      </div>
      <div className="div2">
        <input type="text" placeholder="  Search" className="search-input" />
        <div className="iconsHolder">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={
              theme === "dark"
                ? "Passer en mode clair"
                : "Passer en mode sombre"
            }
          >
            {theme === "dark" ? (
              <Sun size={20} className="theme-icon" />
            ) : (
              <Moon size={20} className="theme-icon" />
            )}
          </button>
          <img src="/headerIcon/history.svg" alt="History" />
          <button onClick={toggleNotification}>
            <img src="/headerIcon/notification.svg" alt="Notifications" />
          </button>
          <button onClick={toggleNotification}>
            <img src="/headerIcon/side.svg" alt="Profile" />
          </button>
        </div>
      </div>
    </header>
  );
}
