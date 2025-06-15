// app/providers.tsx
"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";
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
  const { isLoaded } = useAuth();

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
        signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
        signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
        signInFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL}
        signUpFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
        signInForceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL}
        signUpForceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL}
        afterSignOutUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL}
      >
        <AuthenticatedApolloProvider>
          <AuthProvider>
            <StrictDatabaseGuard>{children}</StrictDatabaseGuard>
          </AuthProvider>
        </AuthenticatedApolloProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
