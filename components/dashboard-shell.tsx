// components/dashboard-shell.tsx
import type React from "react";

import { _Sidebar } from "./sidebar";
import { _MainNav } from "@/components/main-nav";
import { _ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/domains/users/components/user-nav";


interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">Payroll Matrix</h1>
          </div>
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
