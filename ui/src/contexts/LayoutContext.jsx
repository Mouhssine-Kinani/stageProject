"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? match[2] : null;
    };

    const userId = getCookie("userId");

    if (!userId) {
      const currentPath = window.location.pathname;
      const excludedPaths = [
        "/login",
        "/register",
        "/reset",
        "/forget",
        "/forgot-password",
      ];

      if (!excludedPaths.includes(currentPath)) {
        router.push("/login");
      }
    }
  }, [router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

  return (
    <LayoutContext.Provider
      value={{
        isSidebarOpen,
        isNotificationOpen,
        toggleSidebar,
        toggleNotification,
      }}
    >
      <div className="root">{children}</div>
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
