"use client";

import { ReactNode } from "react";
import { PageHeader, PageHeaderProps } from "@/components/patterns/page-header";
import { Header } from "./header";
import { Navigation } from "./navigation";

export interface AppShellProps {
  children: ReactNode;
  pageHeader?: PageHeaderProps;
}

/**
 * Modern AppShell Component
 * 
 * Provides the foundational layout structure with:
 * - Header with logo, global search, user menu, notifications
 * - Grouped navigation with Core, Operations, Business sections
 * - Main content area with optional page headers
 */
export function AppShell({ children, pageHeader }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* App Header */}
      <Header />
      
      <div className="flex">
        {/* Navigation Sidebar */}
        <Navigation />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Page Header (optional) */}
            {pageHeader && <PageHeader {...pageHeader} />}
            
            {/* Page Content */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * Utility wrapper for pages that need only basic shell without custom headers
 */
export function SimpleShell({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

/**
 * Utility wrapper for pages that need the shell with a page header
 */
export function ShellWithHeader({ 
  children, 
  ...headerProps 
}: { 
  children: ReactNode; 
} & PageHeaderProps) {
  return (
    <AppShell pageHeader={headerProps}>
      {children}
    </AppShell>
  );
}