// app/providers.tsx
"use client";

import { ApolloProvider } from "@apollo/client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

import { StrictDatabaseGuard } from "@/components/auth/strict-database-guard";
import { ErrorBoundary } from "@/components/error-boundary";
import { clientApolloClient } from "@/lib/apollo/unified-client";
import { AuthProvider } from "@/lib/auth/enhanced-auth-context";
import { LayoutPreferencesProvider } from "@/lib/preferences/layout-preferences";

// ================================
// TYPES
// ================================

interface ProvidersProps {
  children: React.ReactNode;
}

// ================================
// AUTHENTICATED APOLLO PROVIDER
// ================================

function AuthenticatedApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useAuth();

  // Wait for Clerk to finish loading before providing Apollo client
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <ApolloProvider client={clientApolloClient}>{children}</ApolloProvider>
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
          <AuthProvider>
            <LayoutPreferencesProvider>
              <StrictDatabaseGuard>{children}</StrictDatabaseGuard>
            </LayoutPreferencesProvider>
          </AuthProvider>
        </AuthenticatedApolloProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
