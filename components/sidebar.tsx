// components/sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "./theme-toggle";

// Role display mapping
const roleDisplayNames: Record<string, string> = {
  admin: "Developer",
  manager: "Manager",
  consultant: "Consultant",
  org_admin: "Admin",
};

const routes = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "consultant", "org_admin"],
  },
  {
    href: "/clients",
    label: "Clients",
    icon: Users,
    roles: ["admin", "manager", "consultant", "org_admin"],
  },
  {
    href: "/payrolls",
    label: "Payrolls",
    icon: Calculator,
    roles: ["admin", "manager", "consultant", "org_admin"],
  },
  {
    href: "/payroll-schedule",
    label: "Schedule",
    icon: CalendarDays,
    roles: ["admin", "manager", "org_admin", "consultant"],
  },
  {
    href: "/staff",
    label: "Staff",
    icon: UserCog,
    roles: ["admin", "org_admin", "manager"], // Admin only
  },
  {
    href: "/tax-calculator",
    label: "Tax Calculator",
    icon: DollarSign,
    roles: ["admin"],
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    roles: ["admin"],
  },
  {
    href: "/developer",
    label: "Developer",
    icon: Code,
    roles: ["admin"], // Admin only
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, isLoaded } = useUser();

  // Get user role from Clerk metadata
  const userRole = user?.publicMetadata?.role as string;

  // Filter routes based on user role
  const accessibleRoutes = routes.filter((route) => {
    if (!userRole) return false;
    return route.roles.includes(userRole);
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

  // If user has no role or invalid role, show minimal sidebar
  if (!userRole || !["admin", "manager"].includes(userRole)) {
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
          <p className="text-sm text-muted-foreground text-center px-4">
            Access restricted. Please contact your administrator.
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
        <nav className="flex flex-col gap-2 p-2">
          {accessibleRoutes.map((route) => (
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

        {/* Optional: Show role indicator */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t">
            <p className="text-xs text-muted-foreground">
              Role:{" "}
              <span className="font-medium">
                {roleDisplayNames[userRole] || userRole}
              </span>
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
