"use client";

import { ReactNode } from "react";
import { ResourceProvider, type ResourceName } from "@/components/auth/resource-context";

interface DashboardLayoutProps {
  children: ReactNode;
  resource?: ResourceName; // Optional - can be passed from page
}

/**
 * Dashboard Layout with built-in Resource Context
 * 
 * This layout can automatically provide resource context based on:
 * 1. Explicit resource prop from page
 * 2. Auto-detection from pathname
 * 3. Page-level resource export
 */
export function DashboardLayout({ children, resource }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your existing layout structure */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm">
          {/* Navigation */}
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          <ResourceProvider resource={resource || null}>
            {children}
          </ResourceProvider>
        </main>
      </div>
    </div>
  );
}

/**
 * Auto-detect resource from pathname
 * Useful for automatic resource context without explicit props
 */
export function usePathResource(): ResourceName | null {
  if (typeof window === 'undefined') return null;
  
  const pathname = window.location.pathname;
  
  // Map common paths to resources
  if (pathname.startsWith('/billing')) return 'billing';
  if (pathname.startsWith('/staff')) return 'staff';
  if (pathname.startsWith('/payrolls')) return 'payrolls';
  if (pathname.startsWith('/clients')) return 'clients';
  if (pathname.startsWith('/reports')) return 'reports';
  if (pathname.startsWith('/settings')) return 'settings';
  
  return null;
}

/**
 * Auto-Resource Layout - Automatically detects resource from path
 */
export function AutoResourceLayout({ children }: { children: ReactNode }) {
  const autoResource = usePathResource();
  
  return (
    <DashboardLayout {...(autoResource && { resource: autoResource })}>
      {children}
    </DashboardLayout>
  );
}