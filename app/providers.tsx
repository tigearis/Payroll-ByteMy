// app/providers.tsx
"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes" 
import { ApolloProvider } from "@apollo/client"
import { apolloClient } from "@/lib/apollo-client"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ApolloProvider client={apolloClient}>
          {children}
        </ApolloProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}