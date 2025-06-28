// components/sidebar.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { clsx, type ClassValue } from "clsx";
import {
  LayoutDashboard,
  Users,
  Calculator,
  CalendarDays,
  UserCog,
  Settings,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Code,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthContext } from "@/lib/auth";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";

// Local utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Role display mapping
const roleDisplayNames: Record<string, string> = {
  developer: "Developer",
  manager: "Manager",
  consultant: "Consultant",
  org_admin: "Admin",
};

const allRoutes = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    checkAccess: () => true, // Dashboard always accessible
  },
  {
    href: "/clients",
    label: "Clients",
    icon: Users,
    checkAccess: (auth: any) => auth.hasPermission("client:read"),
  },
  {
    href: "/payrolls",
    label: "Payrolls",
    icon: Calculator,
    checkAccess: (auth: any) => auth.hasPermission("payroll:read"),
  },
  {
    href: "/payroll-schedule",
    label: "Schedule",
    icon: CalendarDays,
    checkAccess: (auth: any) => auth.hasPermission("payroll:read"),
  },
  {
    href: "/staff",
    label: "Staff",
    icon: UserCog,
    checkAccess: (auth: any) => auth.hasPermission("staff:read"),
  },
  {
    href: "/tax-calculator",
    label: "Tax Calculator",
    icon: DollarSign,
    checkAccess: () => true,
    devOnly: true, // Only show in development
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    checkAccess: (auth: any) => auth.hasPermission("settings:write"),
    hidden: true, // Temporarily hidden - may use in the future
  },
  {
    href: "/developer/diagnostics/user-creation",
    label: "Debug Tools",
    icon: Code,
    checkAccess: (auth: any) => auth.userRole === "developer",
    badge: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  },
  {
    href: "/security",
    label: "Security",
    icon: Shield,
    checkAccess: (auth: any) => auth.hasPermission("audit:read"),
  },
];

// Filter out dev-only routes in production
const routes = allRoutes.filter(route => {
  if (route.devOnly && process.env.NODE_ENV === "production") {
    return false;
  }
  return true;
});

export function Sidebar() {
  const pathname = usePathname();
  const { isLoaded } = useUser();
  const authContext = useAuthContext();
  const { sidebarCollapsed, toggleSidebar } = useLayoutPreferences();

  // Filter routes based on auth context
  const accessibleRoutes = routes.filter(route => {
    // Hide routes marked as hidden
    if (route.hidden) {
      return false;
    }
    
    if (!authContext.isLoading && authContext.isAuthenticated) {
      return route.checkAccess(authContext);
    }
    return false; // Don't show routes if not authenticated
  });

  // Show loading state while auth data is being fetched
  if (!isLoaded || authContext.isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col border-r bg-gray-100/40 dark:bg-gray-800/40",
          "w-64" // Default width while loading
        )}
      >
        <div className="flex h-16 items-center border-b px-4">
          <div className="h-4 w-4 animate-pulse bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 p-2">
          {/* Loading skeleton */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 mb-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // If user is not authenticated or has no role, show minimal sidebar
  if (!authContext.isAuthenticated || !authContext.userRole) {
    return (
      <div
        className={cn(
          "flex flex-col border-r bg-gray-100/40 dark:bg-gray-800/40",
          "w-64"
        )}
      >
        <div className="flex h-16 items-center border-b px-4">
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-500 text-center px-4">
            {authContext.isLoading
              ? "Loading permissions..."
              : "Access restricted. Please contact your administrator."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-gray-100/40 dark:bg-gray-800/40",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!sidebarCollapsed && (
          <span>
            <ThemeToggle />
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {accessibleRoutes.map(route => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("justify-start", sidebarCollapsed && "justify-center")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">{route.label}</span>}
              </Link>
            </Button>
          ))}
        </nav>


        {/* Optional: Show role indicator */}
        {!sidebarCollapsed && (
          <div className="mt-auto p-4 border-t">
            <p className="text-xs text-gray-500">
              Role:{" "}
              <span className="font-medium">
                {roleDisplayNames[authContext.userRole] || authContext.userRole}
              </span>
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
