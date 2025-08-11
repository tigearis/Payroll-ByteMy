"use client";

import { useUser } from "@clerk/nextjs";
import { clsx, type ClassValue } from "clsx";
import {
  LayoutDashboard,
  Users,
  Calculator,
  CalendarDays,
  CalendarClock,
  UserCog,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Code,
  Shield,
  Calendar,
  Bot,
  Upload,
  BarChart3,
  LineChart,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { usePermissions, useRole } from "@/hooks/use-permissions";
import { useFeatureFlags } from "@/lib/feature-flags";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";
import { getRoleDisplayName } from "@/lib/utils/role-utils";

// Local utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dashboard route (will be in header)
const dashboardRoute = {
  href: "/dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
  resource: "dashboard",
  action: "read",
};

// Define route structure with sections
const navigationSections = [
  {
    title: "Client Management",
    routes: [
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
    ],
  },
  {
    title: "Scheduling",
    routes: [
      {
        href: "/payroll-schedule",
        label: "Payroll Schedule",
        icon: CalendarDays,
        resource: "schedule",
        action: "read",
      },
      {
        href: "/work-schedule",
        label: "Work Schedule",
        icon: CalendarClock,
        resource: "workschedule",
        action: "read",
      },
    ],
  },
  {
    title: "People",
    routes: [
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
    ],
  },
  {
    title: "Business",
    routes: [
      {
        href: "/billing",
        label: "Billing",
        icon: DollarSign,
        resource: "billing",
        action: "read",
      },
      {
        href: "/reports",
        label: "Reports",
        icon: FileSpreadsheet,
        resource: "reports",
        action: "read",
      },
    ],
  },
  {
    title: "Tools",
    routes: [
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
        icon: LineChart,
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
    ],
  },
  {
    title: "System",
    routes: [
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
    ],
  },
];

interface NavSectionProps {
  title: string;
  routes: any[];
  collapsed: boolean;
  pathname: string;
  can: (resource: string, action: string) => boolean;
  isDeveloper: boolean;
  flags: any;
  isExpanded: boolean;
  onToggle: () => void;
}

function NavSection({
  title,
  routes,
  collapsed,
  pathname,
  can,
  isDeveloper,
  flags,
  isExpanded,
  onToggle,
}: NavSectionProps) {
  // Filter routes based on permissions and feature flags
  const accessibleRoutes = routes.filter(route => {
    // Feature flag checks
    if (route.href === "/ai-assistant" && !flags.aiAssistant) return false;
    if (route.href === "/ai-assistant/data-assistant" && !flags.aiDataAssistant)
      return false;
    if (route.href === "/developer" && !flags.devTools) return false;
    if (route.href === "/security" && !flags.securityReporting) return false;

    // Permission-based visibility only; remove hard-coded developer gating
    return can(route.resource, route.action);
  });

  if (accessibleRoutes.length === 0) return null;

  return (
    <div className="space-y-1">
      {!collapsed && (
        <div className="px-3 py-1">
          <button
            onClick={onToggle}
            className="flex items-center justify-between w-full py-1 hover:bg-muted/50 rounded transition-colors"
          >
            <h3 className="text-xs font-semibold text-foreground opacity-75 uppercase tracking-wide">
              {title}
            </h3>
            {isExpanded ? (
              <ChevronUp className="h-3 w-3 text-foreground opacity-50" />
            ) : (
              <ChevronDown className="h-3 w-3 text-foreground opacity-50" />
            )}
          </button>
        </div>
      )}
      {(collapsed || isExpanded) && (
        <div className="space-y-1">
          {accessibleRoutes.map(route => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-9",
                collapsed && "justify-center px-2"
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span className="ml-3">{route.label}</span>
                    {route.badge && (
                      <span className="ml-auto text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                        {route.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Modern Navigation Component
 *
 * Features:
 * - Grouped navigation sections
 * - Permission-based filtering
 * - Collapsible sidebar
 * - Role indicator
 * - Smooth transitions
 */
export function Navigation() {
  const pathname = usePathname();
  const { isLoaded } = useUser();
  const { can, isLoaded: permissionsLoaded } = usePermissions();
  const { isDeveloper, role } = useRole();
  const { sidebarCollapsed, toggleSidebar } = useLayoutPreferences();
  const { flags } = useFeatureFlags();

  // State for tracking expanded sections - all expanded by default
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    navigationSections.forEach(section => {
      initialState[section.title] = true; // Start with all sections expanded
    });
    return initialState;
  });

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  // Check if user can access dashboard
  const canAccessDashboard = can(dashboardRoute.resource, dashboardRoute.action);

  // Show loading state while auth data is being fetched
  if (!isLoaded || !permissionsLoaded) {
    return (
      <aside
        className={cn(
          "flex flex-col border-r bg-background",
          "w-64" // Default width while loading
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="h-4 w-16 animate-pulse bg-muted rounded"></div>
        </div>
        <div className="flex-1 p-3">
          {/* Loading skeleton */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-9 mb-2 bg-muted rounded animate-pulse"
            />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-200",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with Dashboard and Collapse Toggle */}
      <div className="flex h-16 items-center border-b px-2">
        {sidebarCollapsed ? (
          // When collapsed: stack vertically with Dashboard on top, toggle on bottom
          <div className="flex flex-col items-center justify-center w-full space-y-1">
            {canAccessDashboard && (
              <Button
                variant={pathname === dashboardRoute.href ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                asChild
              >
                <Link href={dashboardRoute.href}>
                  <dashboardRoute.icon className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-7 w-7"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          // When expanded: Dashboard on left, toggle on right
          <>
            {canAccessDashboard && (
              <Button
                variant={pathname === dashboardRoute.href ? "secondary" : "ghost"}
                className="justify-start h-9 flex-1 mr-2"
                asChild
              >
                <Link href={dashboardRoute.href}>
                  <dashboardRoute.icon className="h-4 w-4" />
                  <span className="ml-3">{dashboardRoute.label}</span>
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Navigation Content */}
      <ScrollArea className="flex-1">
        <nav className="p-3 space-y-6">
          {navigationSections.map((section, index) => (
            <div key={section.title}>
              <NavSection
                title={section.title}
                routes={section.routes}
                collapsed={sidebarCollapsed}
                pathname={pathname}
                can={can}
                isDeveloper={isDeveloper}
                flags={flags}
                isExpanded={expandedSections[section.title] ?? true}
                onToggle={() => toggleSection(section.title)}
              />
              {/* Add separator between sections (except last) */}
              {!sidebarCollapsed && index < navigationSections.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Role Indicator */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            <span>Role: </span>
            <span className="font-medium text-foreground">
              {getRoleDisplayName(role)}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
