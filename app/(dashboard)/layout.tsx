// app/(dashboard)/layout.tsx
"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
        <Toaster />
      </main>
    </div>
  )
}