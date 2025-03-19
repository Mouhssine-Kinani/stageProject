// "use client";
// import { createContext, useContext, useEffect, useState } from "react";

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   // Load theme from local storage or default to 'light'
//   const [theme, setTheme] = useState(() => {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem("theme") || "light";
//     }
//     return "light";
//   });

//   // Toggle between light and dark mode
//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   // Apply theme class to <html> tag
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       document.documentElement.classList.toggle("dark", theme === "dark");
//       localStorage.setItem("theme", theme);
//     }
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// // Custom hook to use theme context
// export const useTheme = () => useContext(ThemeContext);
