// app/layout.tsx
import './globals.css';
import type React from "react"
import { Providers } from "./providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen w-full flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}