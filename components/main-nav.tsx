// components/main-nav.tsx
"use client";

import { clsx, type ClassValue } from "clsx";
import {
  LayoutDashboard,
  Users,
  Calculator,
  CalendarDays,
  UserCog,
  Settings,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";

// Local utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function MainNav() {
  const pathname = usePathname();

  const allRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/clients",
      label: "Clients",
      icon: Users,
      active: pathname.startsWith("/clients"),
    },
    {
      href: "/payrolls",
      label: "Payrolls",
      icon: Calculator,
      active: pathname.startsWith("/payrolls"),
    },
    {
      href: "/calendar",
      label: "Calendar",
      icon: CalendarDays,
      active: pathname === "/calendar",
      devOnly: true, // Only show in development
    },
    {
      href: "/payroll-schedule",
      label: "Schedule",
      icon: CalendarDays,
      active: pathname === "/payroll-schedule",
    },
    {
      href: "/staff",
      label: "Staff",
      icon: UserCog,
      active: pathname.startsWith("/staff"),
    },
    {
      href: "/tax-calculator",
      label: "Tax Calculator",
      icon: DollarSign,
      active: pathname === "/tax-calculator",
      devOnly: true, // Only show in development
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  // Filter out dev-only routes in production
  const routes = allRoutes.filter(route => {
    if (route.devOnly && process.env.NODE_ENV === 'production') {
      return false;
    }
    return true;
  });

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={route.active ? "default" : "ghost"}
          asChild
        >
          <Link
            href={route.href}
            className={cn(
              "flex items-center space-x-2",
              route.active
                ? "text-white"
                : "text-gray-600 hover:text-blue-600"
            )}
          >
            <route.icon className="h-4 w-4" />
            <span className="hidden md:inline-block">{route.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}
