"use client";

import "./header.css";
import { useLayout } from "@/contexts/LayoutContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { toggleSidebar, toggleNotification } = useLayout();
  const pathname = usePathname();

  // Transformer le chemin en format lisible
  const breadcrumb = pathname
    .split("/")
    .filter(Boolean) // Supprime les éléments vides
    .map((part) => decodeURIComponent(part.replace(/-/g, " "))); // Décoder les %20 et remplacer "-" par un espace

  return (
    <header className="area-header">
      <div className="div1">
        <button onClick={toggleSidebar}>
          <img src="/headerIcon/side.svg" alt="Toggle sidebar" />
        </button>
        <img src="/headerIcon/star.svg" alt="" />
        <p> dashboard / {breadcrumb.join(" / ") || "dashboard"}</p>
      </div>
      <div className="div2">
        <input type="text" placeholder="  Search" className="search-input" />
        <div className="iconsHolder">
          <button>
            <img src="/headerIcon/them.svg" alt="Theme" />
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
