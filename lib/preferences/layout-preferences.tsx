"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type LayoutType = "sidebar" | "header";

interface LayoutPreferencesContextType {
  layoutType: LayoutType;
  setLayoutType: (layout: LayoutType) => void;
}

const LayoutPreferencesContext = createContext<LayoutPreferencesContextType | undefined>(
  undefined
);

interface LayoutPreferencesProviderProps {
  children: React.ReactNode;
}

export function LayoutPreferencesProvider({ children }: LayoutPreferencesProviderProps) {
  const [layoutType, setLayoutTypeState] = useState<LayoutType>("sidebar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("layout-preference");
    if (stored && (stored === "sidebar" || stored === "header")) {
      setLayoutTypeState(stored as LayoutType);
    }
  }, []);

  const setLayoutType = (layout: LayoutType) => {
    setLayoutTypeState(layout);
    localStorage.setItem("layout-preference", layout);
  };

  if (!mounted) {
    return null;
  }

  return (
    <LayoutPreferencesContext.Provider value={{ layoutType, setLayoutType }}>
      {children}
    </LayoutPreferencesContext.Provider>
  );
}

export function useLayoutPreferences() {
  const context = useContext(LayoutPreferencesContext);
  if (context === undefined) {
    throw new Error("useLayoutPreferences must be used within a LayoutPreferencesProvider");
  }
  return context;
}