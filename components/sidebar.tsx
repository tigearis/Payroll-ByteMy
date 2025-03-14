// components/sidebar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Loader2,
  Code,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const routes = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/clients",
    label: "Clients",
    icon: Users,
  },
  {
    href: "/payrolls",
    label: "Payrolls",
    icon: Calculator,
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
  {
    href: "/payroll-schedule",
    label: "Schedule",
    icon: CalendarDays,
  },
  {
    href: "/staff",
    label: "Staff",
    icon: UserCog,
  },
  {
    href: "/tax-calculator",
    label: "Tax Calculator",
    icon: DollarSign,
  },
  {
    href: "/onboarding",
    label: "Onboarding",
    icon: Loader2,
  },
  {
    href: "/developer",
    label: "Developer",
    icon: Code,
  },
  {
    href: "/ai-assistant",
    label: "AI Assistant",
    icon: MessageSquare,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn("flex flex-col border-r bg-gray-100/40 dark:bg-gray-800/40", isCollapsed ? "w-16" : "w-64")}>
      <div className="flex h-14 items-center border-b px-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {!isCollapsed && <span>Payroll Matrix</span>}
        </Link>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {routes.map((route) => (
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
      </ScrollArea>
    </div>
  )
}