// app/providers.tsx
"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";

// ================================
// TYPES
// ================================

interface ProvidersProps {
  children: React.ReactNode;
}

// ================================
// AUTHENTICATED APOLLO PROVIDER
// ================================

function AuthenticatedApolloProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();

  // Wait for Clerk to finish loading before providing Apollo client
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}

// ================================
// PROVIDERS COMPONENT
// ================================

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ClerkProvider>
        <AuthenticatedApolloProvider>
          <AuthProvider>{children}</AuthProvider>
        </AuthenticatedApolloProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
