// app/(dashboard)/layout.tsx
"use client";

import type React from "react";
import { AIAssistantFloat } from "@/components/ai-assistant-float";
import { ResourceProvider } from "@/components/auth/resource-context";
import { AppShell } from "@/components/layout";
import { ClientWrapper } from "@/domains/clients/components/client-wrapper";
import { usePathResource } from "@/hooks/use-path-resource";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { layoutType } = useLayoutPreferences();

  // Auto-detect resource from current path
  const pageResource = usePathResource();

  // Legacy layout removed; enforce modern AppShell consistently

  // Modern AppShell Layout
  return (
    <AppShell>
      <ResourceProvider resource={pageResource}>
        <ClientWrapper>{children}</ClientWrapper>
      </ResourceProvider>
      <AIAssistantFloat />
    </AppShell>
  );
}
