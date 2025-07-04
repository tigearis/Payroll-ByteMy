import { useQuery } from "@apollo/client";
import { useAuth, useUser, useSession } from "@clerk/nextjs";
import { useMemo } from "react";
import { GetCurrentUserDocument } from "@/domains/users/graphql/generated/graphql";

/**
 * Simplified useCurrentUser hook using Apollo's built-in deduplication
 *
 * Apollo automatically handles:
 * - Request deduplication (multiple calls = single request)
 * - Caching and cache updates
 * - Race condition prevention
 * - Error handling and retries
 *
 * No auth-mutex needed!
 */
export function useCurrentUser() {
  const { userId: clerkUserId, isLoaded, sessionClaims } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { session } = useSession();

  // Extract database user ID using Clerk's native methods with JWT claims fallback
  const databaseUserId = useMemo(() => {
    if (!isLoaded || !userLoaded || !clerkUserId || !user) {
      console.log("🔍 useCurrentUser: Missing basic auth data", {
        isLoaded,
        userLoaded,
        hasClerkUserId: !!clerkUserId,
        hasUser: !!user,
      });
      return null;
    }

    // Method 1: Use Clerk's native publicMetadata (preferred)
    const metadataUserId = user.publicMetadata?.databaseId as string;

    // Method 2: Use session object for direct access (alternative native method)
    const sessionUserId = session?.user?.publicMetadata?.databaseId as string;

    // Method 3: Extract from JWT session claims (fallback)
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const jwtUserId = hasuraClaims?.["x-hasura-user-id"] as string;
    const jwtRole = sessionClaims?.["x-hasura-default-role"] as string;

    // Priority: user metadata, session metadata, then JWT claims
    const extractedUserId =
      metadataUserId || sessionUserId || jwtUserId || jwtRole;

    console.log("🔍 useCurrentUser: Database ID extraction", {
      extractedUserId,
      metadataUserId,
      sessionUserId,
      jwtUserId,
      jwtRole,
      clerkUserId,
      userRole: user.publicMetadata?.role,
      hasPublicMetadata: !!user.publicMetadata,
      hasSession: !!session,
      hasJwtClaims: !!hasuraClaims,
      source: metadataUserId
        ? "user-metadata"
        : sessionUserId
          ? "session-metadata"
          : jwtUserId
            ? "jwt-claims"
            : "none",
      fullPublicMetadata: user.publicMetadata,
    });

    // Additional validation that the extracted ID looks like a UUID
    if (
      extractedUserId &&
      typeof extractedUserId === "string" &&
      extractedUserId.length === 36
    ) {
      console.log(
        "✅ Valid database user ID extracted:",
        extractedUserId,
        metadataUserId
          ? "(from user metadata)"
          : sessionUserId
            ? "(from session metadata)"
            : "(from JWT claims)"
      );
      return extractedUserId;
    } else if (extractedUserId) {
      console.warn("⚠️ Invalid database user ID format:", extractedUserId);
      return null;
    }

    console.warn("⚠️ No database user ID found in public metadata");
    return null;
  }, [isLoaded, userLoaded, clerkUserId, user, session, sessionClaims]);

  // Apollo automatically handles deduplication and caching
  const { data, loading, error, refetch, networkStatus } = useQuery(
    GetCurrentUserDocument,
    {
      variables: { userId: databaseUserId! },
      skip: !databaseUserId, // Don't query if no database user ID

      // Apollo's built-in optimizations (replaces auth-mutex functionality)
      fetchPolicy: "cache-and-network", // Use cache first, then network
      errorPolicy: "all", // Return partial data even with errors
      notifyOnNetworkStatusChange: true, // Track network state

      // Prevent unnecessary re-fetches
      nextFetchPolicy: "cache-first",

      // Enhanced error handling and debugging
      onCompleted: result => {
        console.log("🔍 useCurrentUser: GraphQL query completed", {
          hasUser: !!result?.user,
          userData: result?.user,
          databaseUserId,
        });
      },
      onError: apolloError => {
        console.error("🔍 useCurrentUser: GraphQL query error", {
          error: apolloError,
          databaseUserId,
          message: apolloError.message,
          graphQLErrors: apolloError.graphQLErrors,
          networkError: apolloError.networkError,
        });
      },
    }
  );

  const currentUser = data?.user;
  const isReady = isLoaded && userLoaded && !loading;

  return {
    // User data
    currentUser,
    databaseUserId,
    clerkUserId,

    // Loading states
    loading: !isLoaded || !userLoaded || loading,
    error,
    isReady,

    // Actions
    refetch,

    // Network status for debugging
    networkStatus,

    // Legacy compatibility
    currentUserId: databaseUserId,
    extractionAttempts: 0, // No longer needed
  };
}
