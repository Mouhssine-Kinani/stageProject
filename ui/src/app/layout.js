'use client';
import "./globals.css";
import Header from "@/components/header/Header";
import SideBar from "@/components/sidebar/SideBar";
import Content from "@/components/content/dashbord";
import NotificationPanel from "@/components/notification/NotificationPanel";
import { LayoutProvider } from "@/contexts/LayoutContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutProvider>
          <div className="grid-areas-layout">
            <SideBar/>
            <Header/>
            <Content/>
            <NotificationPanel/>
          </div>
        </LayoutProvider>
      </body>
    </html>
  );
}