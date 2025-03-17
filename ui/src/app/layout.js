"use client";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ThemeProvider>
        <NotificationProvider>
          <LayoutProvider>
            {children}
          </LayoutProvider>
        </NotificationProvider>
    </ThemeProvider>
      </body>
    </html>
  );
}
