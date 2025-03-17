'use client';
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}