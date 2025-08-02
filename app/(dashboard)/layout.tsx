// app/(dashboard)/layout.tsx
"use client";

import type React from "react";
import { AIAssistantFloat } from "@/components/ai-assistant-float";
import { DashboardShell } from "@/components/dashboard-shell";
import { Sidebar } from "@/components/sidebar";
import { ClientWrapper } from "@/domains/clients/components/client-wrapper";
import { UserNav } from "@/domains/users/components/user-nav";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";
import { ResourceProvider } from "@/components/auth/resource-context";
import { usePathResource } from "@/hooks/use-path-resource";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { layoutType } = useLayoutPreferences();
  
  // Auto-detect resource from current path
  const pageResource = usePathResource();

  if (layoutType === "header") {
    return (
      <DashboardShell>
        <ResourceProvider resource={pageResource}>
          <ClientWrapper>{children}</ClientWrapper>
        </ResourceProvider>
        <AIAssistantFloat />
      </DashboardShell>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="border-b h-16 flex items-center px-6">
          <h1 className="text-xl font-bold">Payroll Matrix</h1>
          <div className="ml-auto flex items-center gap-4">
            <UserNav />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          <ResourceProvider resource={pageResource}>
            <ClientWrapper>{children}</ClientWrapper>
          </ResourceProvider>
        </main>
      </div>
      <AIAssistantFloat />
    </div>
  );
}
