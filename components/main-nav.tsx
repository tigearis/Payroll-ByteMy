// components/main-nav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Calculator, CalendarDays, UserCog, Settings, DollarSign } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
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
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Button key={route.href} variant={route.active ? "default" : "ghost"} asChild>
          <Link
            href={route.href}
            className={cn(
              "flex items-center gap-2",
              route.active ? "text-primary-foreground" : "text-muted-foreground hover:text-primary",
            )}
          >
            <route.icon className="h-4 w-4" />
            <span className="hidden md:inline-block">{route.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  )
}