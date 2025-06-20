// app/providers.tsx
"use client";

import React from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ApolloProvider } from "@apollo/client";
import { clientApolloClient as client } from "@/lib/apollo/unified-client";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { StrictDatabaseGuard } from "@/components/auth/StrictDatabaseGuard";

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
  const { isLoaded, isSignedIn, userId } = useAuth();

  // Memoize the audit log function to prevent re-renders
  const auditLog = React.useCallback((event: { userId: string; action: string; resource: string }) => {
    console.log('🔍 CLIENT AUDIT:', {
      timestamp: new Date().toISOString(),
      ...event
    });
    // TODO: Send to audit API endpoint in production
  }, []);

  // Clear Apollo cache on sign out for SOC2 compliance
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!isSignedIn) {
      // Only clear cache if we had a previous user session
      const hadUser = localStorage.getItem('clerk_had_user');
      if (hadUser) {
        auditLog({
          userId: hadUser,
          action: 'user_signed_out_global',
          resource: 'authentication',
        });
        client.clearStore();
        localStorage.removeItem('clerk_had_user');
      }
    } else if (userId) {
      // Store user info for potential cleanup
      localStorage.setItem('clerk_had_user', userId);
    }
  }, [isSignedIn, userId, auditLog]);

  // Wait for Clerk to finish loading before providing Apollo client
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

// ================================
// PROVIDERS COMPONENT
// ================================

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ClerkProvider
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        <AuthenticatedApolloProvider>
          <AuthProvider>
            <StrictDatabaseGuard>
              {children}
            </StrictDatabaseGuard>
          </AuthProvider>
        </AuthenticatedApolloProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
