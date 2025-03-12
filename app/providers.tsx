// app/providers.tsx
"use client"

import type React from "react"
import { ThemeProvider } from "next-themes" 
import { ApolloProvider } from "@apollo/client"
import { createApolloClient } from "@/lib/apollo-client"

// Create a client-side Apollo client instance
const clientSideApolloClient = createApolloClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ApolloProvider client={clientSideApolloClient}>
        {children}
      </ApolloProvider>
    </ThemeProvider>
  )
}