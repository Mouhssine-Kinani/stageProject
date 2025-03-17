"use client";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ThemeProvider>
        <NotificationProvider>
          <LayoutProvider>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </LayoutProvider>
        </NotificationProvider>
    </ThemeProvider>
      </body>
    </html>
  );
}
