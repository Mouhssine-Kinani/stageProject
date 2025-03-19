import { useState, useEffect } from "react";

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { windowWidth, mounted };
}
