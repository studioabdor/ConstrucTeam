"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Theme context for additional theme-related state
interface ThemeContextType {
  glassmorphism: boolean;
  setGlassmorphism: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function GlassmorphismProvider({ children }: { children: React.ReactNode }) {
  const [glassmorphism, setGlassmorphism] = useState(true);

  useEffect(() => {
    // Load glassmorphism preference from localStorage
    const saved = localStorage.getItem("glassmorphism");
    if (saved !== null) {
      setGlassmorphism(JSON.parse(saved));
    }
  }, []);

  const handleSetGlassmorphism = (enabled: boolean) => {
    setGlassmorphism(enabled);
    localStorage.setItem("glassmorphism", JSON.stringify(enabled));
  };

  return (
    <ThemeContext.Provider value={{ glassmorphism, setGlassmorphism: handleSetGlassmorphism }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useGlassmorphism() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useGlassmorphism must be used within a GlassmorphismProvider");
  }
  return context;
}
