// app/providers.tsx
"use client";

import { ApolloProvider } from "@apollo/client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { StrictDatabaseGuard } from "@/components/auth/strict-database-guard";
// import { TokenRefreshBoundary } from "@/components/auth/token-refresh-boundary";
import { ErrorBoundary } from "@/components/error-boundary";
import { LogoutErrorBoundary } from "@/components/auth/logout-error-boundary";
import { HooksErrorBoundary } from "@/components/auth/hooks-error-boundary";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { ByteMyLoadingIcon } from "@/components/ui/bytemy-loading-icon";
import { Suspense } from "react";
import { clientApolloClient } from "@/lib/apollo/unified-client";
// Auth provider removed - using simplified Clerk-only auth
import { FeatureFlagProvider } from "@/lib/feature-flags";
import { LayoutPreferencesProvider } from "@/lib/preferences/layout-preferences";
import { LogoutStateProvider } from "@/lib/auth/logout-state";

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
  const { isLoaded, isSignedIn } = useAuth();

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

  // Expose Apollo client globally for logout cache clearing
  if (typeof window !== 'undefined') {
    (window as any).__APOLLO_CLIENT__ = clientApolloClient;
  }

  return (
    <ApolloProvider client={clientApolloClient}>
      {/* Only provide FeatureFlagProvider if user is signed in */}
      {isSignedIn ? (
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <ByteMyLoadingIcon 
              title="Loading features..."
              description="Setting up your dashboard"
              size="lg"
            />
          </div>
        }>
          <FeatureFlagProvider>
            {children}
          </FeatureFlagProvider>
        </Suspense>
      ) : (
        children
      )}
    </ApolloProvider>
  );
}

// ================================
// PROVIDERS COMPONENT
// ================================

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <HooksErrorBoundary>
        <LogoutErrorBoundary>
          <LogoutStateProvider>
            <ClerkProvider>
              <AuthenticatedApolloProvider>
                <LoadingProvider>
                  <LayoutPreferencesProvider>
                    <StrictDatabaseGuard>{children}</StrictDatabaseGuard>
                  </LayoutPreferencesProvider>
                </LoadingProvider>
              </AuthenticatedApolloProvider>
            </ClerkProvider>
          </LogoutStateProvider>
        </LogoutErrorBoundary>
      </HooksErrorBoundary>
    </ErrorBoundary>
  );
}
