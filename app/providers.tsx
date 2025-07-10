// app/providers.tsx
"use client";

import { ApolloProvider } from "@apollo/client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { StrictDatabaseGuard } from "@/components/auth/strict-database-guard";
// import { TokenRefreshBoundary } from "@/components/auth/token-refresh-boundary";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { ByteMyLoadingIcon } from "@/components/ui/bytemy-loading-icon";
import { clientApolloClient } from "@/lib/apollo/unified-client";
// Auth provider removed - using simplified Clerk-only auth
import { FeatureFlagProvider } from "@/lib/feature-flags";
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ByteMyLoadingIcon 
          title="Initializing..."
          description="Setting up your secure connection"
          size="lg"
        />
      </div>
    );
  }

  return (
    <ApolloProvider client={clientApolloClient}>
      <FeatureFlagProvider>
        {children}
      </FeatureFlagProvider>
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
          <LoadingProvider>
            <LayoutPreferencesProvider>
              <StrictDatabaseGuard>{children}</StrictDatabaseGuard>
            </LayoutPreferencesProvider>
          </LoadingProvider>
        </AuthenticatedApolloProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
