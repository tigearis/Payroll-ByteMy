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
  Calendar,
  Bot,
  Upload,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermissions, useRole } from "@/hooks/use-permissions";
import { useFeatureFlags } from "@/lib/feature-flags";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";
import { ThemeToggle } from "./theme-toggle";

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
    resource: "dashboard",
    action: "read",
  },
  {
    href: "/clients",
    label: "Clients",
    icon: Users,
    resource: "clients",
    action: "read",
  },
  {
    href: "/payrolls",
    label: "Payrolls",
    icon: Calculator,
    resource: "payrolls",
    action: "read",
  },
  {
    href: "/payroll-schedule",
    label: "Schedule",
    icon: CalendarDays,
    resource: "schedule",
    action: "read",
  },
  {
    href: "/work-schedule",
    label: "Work Schedule",
    icon: CalendarDays,
    resource: "workschedule",
    action: "read",
  },
  {
    href: "/staff",
    label: "Staff",
    icon: UserCog,
    resource: "staff",
    action: "read",
  },
  {
    href: "/leave",
    label: "Leave",
    icon: Calendar,
    resource: "leave",
    action: "read",
  },
  {
    href: "/billing",
    label: "Billing",
    icon: DollarSign,
    resource: "billing",
    action: "read",
  },
  {
    href: "/ai-assistant",
    label: "AI Assistant",
    icon: Bot,
    resource: "ai",
    action: "read",
  },
  {
    href: "/ai-assistant/data-assistant",
    label: "Data Assistant",
    icon: BarChart3,
    resource: "ai",
    action: "read",
    parentLabel: "AI Tools",
  },
  {
    href: "/bulk-upload",
    label: "Bulk Upload",
    icon: Upload,
    resource: "bulkupload",
    action: "read",
  },
  {
    href: "/reports",
    label: "Reports",
    icon: BarChart3,
    resource: "reports",
    action: "read",
  },
  {
    href: "/tax-calculator",
    label: "Tax Calculator",
    icon: DollarSign,
    resource: "dashboard",
    action: "read",
    devOnly: true, // Only show in development
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    resource: "settings",
    action: "read",
    hidden: true, // Temporarily hidden - may use in the future
  },
  {
    href: "/developer",
    label: "Debug Tools",
    icon: Code,
    resource: "developer",
    action: "manage",
    badge: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  },
  {
    href: "/security",
    label: "Security",
    icon: Shield,
    resource: "security",
    action: "read",
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
  const { can, isLoaded: permissionsLoaded } = usePermissions();
  const { isDeveloper } = useRole();
  const { sidebarCollapsed, toggleSidebar } = useLayoutPreferences();
  const { flags } = useFeatureFlags();

  // Show loading state while auth data is being fetched
  if (!isLoaded || !permissionsLoaded) {
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

  // Filter routes based on permissions and feature flags
  const accessibleRoutes = routes.filter(route => {
    // Hide routes marked as hidden
    if (route.hidden) {
      return false;
    }
    
    // Feature flag checks
    if (route.href === '/ai-assistant' && !flags.aiAssistant) {
      return false;
    }
    if (route.href === '/ai-assistant/data-assistant' && !flags.aiDataAssistant) {
      return false;
    }
    if (route.href === '/tax-calculator' && !flags.taxCalculator) {
      return false;
    }
    if (route.href === '/developer' && !flags.devTools) {
      return false;
    }
    if (route.href === '/security' && !flags.securityReporting) {
      return false;
    }
    
    // Hide reports for non-developers
    if (route.href === '/reports' && !isDeveloper) {
      return false;
    }
    
    // Check if user has permission to access this route
    return can(route.resource, route.action);
  });

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
          {sidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {accessibleRoutes.map(route => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                sidebarCollapsed && "justify-center"
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4" />
                {!sidebarCollapsed && (
                  <span className="ml-2">{route.label}</span>
                )}
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
                {/* {roleDisplayNames[authContext.userRole] || authContext.userRole} */}
              </span>
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
