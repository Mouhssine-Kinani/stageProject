'use client';
import "../globals.css";
import SideBar from "@/components/sidebar/SideBar";
import Header from "@/components/header/Header";
import Content from "@/components/content/dashbord"; // Assure-toi du bon chemin
import NotificationPanel from "@/components/notification/NotificationPanel";
import { LayoutProvider } from "@/contexts/LayoutContext";

export default function AppLayout({ children }) {
  return (
    <LayoutProvider>
      <div className="grid-areas-layout">
        <SideBar />
        <Header />
        <Content>{children}</Content> {/* Le contenu de la page s'affiche ici */}
        <NotificationPanel />
      </div>
    </LayoutProvider>
  );
}
