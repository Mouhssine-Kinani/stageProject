"use client";

import "./header.css";
import { useLayout } from "@/contexts/LayoutContext";
import { usePathname } from "next/navigation";
import { useClient } from "@/hooks/useOneClients";

export default function Header() {
  const { toggleSidebar, toggleNotification } = useLayout();
  const pathname = usePathname();

  // Découpage du chemin
  const parts = pathname.split("/").filter(Boolean);

  // Déterminer si on est sur une page client
  const isClientPage = parts.length >= 2 && parts[0] === "clients";
  const clientId = isClientPage ? parts[1] : null; // L'ID est en position 1

  // Récupération du client si c'est une page client
  const { client, clientLoading } = useClient(clientId);

  // Construction du breadcrumb
  let breadcrumb = parts.map((part, index) => {
    if (index === 1 && isClientPage) {
      return clientLoading ? "Chargement..." : client?.client_reference ? `Client #CL0${client.client_reference}` : part;
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
