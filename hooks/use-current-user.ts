import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery } from "@apollo/client";
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
  const { userId: clerkUserId, isLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  // Extract database user ID from Clerk's user public metadata
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

    // Extract database ID from user's public metadata (set by user sync service)
    const extractedUserId = user.publicMetadata?.databaseId as string;

    console.log("🔍 useCurrentUser: Public metadata extraction", {
      extractedUserId,
      clerkUserId,
      userRole: user.publicMetadata?.role,
      hasPublicMetadata: !!user.publicMetadata,
      fullPublicMetadata: user.publicMetadata,
    });

    // Additional validation that the extracted ID looks like a UUID
    if (
      extractedUserId &&
      typeof extractedUserId === "string" &&
      extractedUserId.length === 36
    ) {
      console.log(
        "✅ Valid database user ID extracted from public metadata:",
        extractedUserId
      );
      return extractedUserId;
    } else if (extractedUserId) {
      console.warn("⚠️ Invalid database user ID format:", extractedUserId);
      return null;
    }

    console.warn("⚠️ No database user ID found in public metadata");
    return null;
  }, [isLoaded, userLoaded, clerkUserId, user]);

  // Apollo automatically handles deduplication and caching
  const { data, loading, error, refetch, networkStatus } = useQuery(
    GetCurrentUserDocument,
    {
      variables: { currentUserId: databaseUserId! },
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
