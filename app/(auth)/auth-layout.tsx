// app/(auth)/layout.tsx
import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Payroll Matrix</h1>
          <p className="text-sm text-muted-foreground">Comprehensive payroll management system</p>
        </div>
        {children}
      </div>
    </div>
  )
}