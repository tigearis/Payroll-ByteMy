"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type LayoutType = "sidebar" | "header";

interface LayoutPreferencesContextType {
  layoutType: LayoutType;
  setLayoutType: (layout: LayoutType) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const LayoutPreferencesContext = createContext<
  LayoutPreferencesContextType | undefined
>(undefined);

interface LayoutPreferencesProviderProps {
  children: React.ReactNode;
}

export function LayoutPreferencesProvider({
  children,
}: LayoutPreferencesProviderProps) {
  const [layoutType, setLayoutTypeState] = useState<LayoutType>("sidebar");
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLayout = localStorage.getItem("layout-preference");
    const storedSidebar = localStorage.getItem("sidebar-collapsed");

    if (
      storedLayout &&
      (storedLayout === "sidebar" || storedLayout === "header")
    ) {
      setLayoutTypeState(storedLayout as LayoutType);
    }

    if (storedSidebar === "true") {
      setSidebarCollapsedState(true);
    }
  }, []);

  const setLayoutType = (layout: LayoutType) => {
    setLayoutTypeState(layout);
    localStorage.setItem("layout-preference", layout);
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    localStorage.setItem("sidebar-collapsed", collapsed.toString());
  };

  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsedState(newCollapsed);
    localStorage.setItem("sidebar-collapsed", newCollapsed.toString());
  };

  if (!mounted) {
    return null;
  }

  return (
    <LayoutPreferencesContext.Provider
      value={{
        layoutType,
        setLayoutType,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </LayoutPreferencesContext.Provider>
  );
}

export function useLayoutPreferences() {
  const context = useContext(LayoutPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useLayoutPreferences must be used within a LayoutPreferencesProvider"
    );
  }
  return context;
}
