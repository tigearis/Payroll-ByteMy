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
import { useEnhancedPermissions } from "@/hooks/use-enhanced-permissions";
import { DebugPermissions } from "@/components/debug-permissions";
import { DebugPermissionInfo } from "@/components/debug-permission-info";

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
    checkAccess: (permissions: any) =>
      permissions.navigation.canAccess.dashboard,
  },
  {
    href: "/clients",
    label: "Clients",
    icon: Users,
    checkAccess: (permissions: any) => permissions.navigation.canAccess.clients,
  },
  {
    href: "/payrolls",
    label: "Payrolls",
    icon: Calculator,
    checkAccess: (permissions: any) =>
      permissions.navigation.canAccess.payrolls,
  },
  {
    href: "/payroll-schedule",
    label: "Schedule",
    icon: CalendarDays,
    checkAccess: (permissions: any) =>
      permissions.navigation.canAccess.payrolls,
  },
  {
    href: "/staff",
    label: "Staff",
    icon: UserCog,
    checkAccess: (permissions: any) => permissions.navigation.canAccess.staff,
  },
  {
    href: "/tax-calculator",
    label: "Tax Calculator",
    icon: DollarSign,
    checkAccess: (permissions: any) => permissions.canAccessDashboard,
    devOnly: true, // Only show in development
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    checkAccess: (permissions: any) =>
      permissions.navigation.canAccess.settings,
  },
  {
    href: "/developer",
    label: "Developer",
    icon: Code,
    checkAccess: (permissions: any) =>
      permissions.navigation.canAccess.developer,
    devOnly: true, // Only show in development
  },
  {
    href: "/security",
    label: "Security",
    icon: Shield,
    checkAccess: (permissions: any) =>
      permissions.navigation.canAccess.security,
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, isLoaded } = useUser();
  const permissions = useEnhancedPermissions();

  // Filter routes based on enhanced permission checks
  const accessibleRoutes = routes.filter(route => {
    if (!permissions.isLoaded) {
      return false;
    }
    return route.checkAccess(permissions);
  });

  // Show loading state while user data is being fetched
  if (!isLoaded) {
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

  // If user has no role or permissions not loaded, show minimal sidebar
  if (!permissions.isLoaded || !permissions.userRole) {
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
            {!permissions.isLoaded
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
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!isCollapsed && (
          <span>
            <ThemeToggle />
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <DebugPermissions />
        <nav className="flex flex-col gap-2 p-2">
          {accessibleRoutes.map(route => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("justify-start", isCollapsed && "justify-center")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">{route.label}</span>}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Debug info - temporary */}
        {!isCollapsed && (
          <div className="p-2 border-t">
            <DebugPermissionInfo />
          </div>
        )}

        {/* Optional: Show role indicator */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t">
            <p className="text-xs text-gray-500">
              Role:{" "}
              <span className="font-medium">
                {roleDisplayNames[permissions.userRole] || permissions.userRole}
              </span>
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
