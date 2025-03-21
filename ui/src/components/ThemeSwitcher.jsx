"use client";
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

/**
 * Composant pour basculer entre le mode clair et sombre
 */
export default function ThemeSwitcher({ isMobile = false }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-muted transition-colors theme-toggle-btn"
      aria-label={
        theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"
      }
      title={
        theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"
      }
    >
      {theme === "dark" ? (
        <Sun size={isMobile ? 22 : 20} className="theme-icon" />
      ) : (
        <Moon size={isMobile ? 22 : 20} className="theme-icon" />
      )}
    </button>
  );
}
