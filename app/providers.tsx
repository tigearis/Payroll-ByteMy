// app/providers.tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";
import { AuthProvider } from "@/lib/auth-context";

// ================================
// TYPES
// ================================

interface ProvidersProps {
  children: React.ReactNode;
}

// ================================
// PROVIDERS COMPONENT
// ================================

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <ApolloProvider client={client}>
        <AuthProvider>{children}</AuthProvider>
      </ApolloProvider>
    </ClerkProvider>
  );
}
