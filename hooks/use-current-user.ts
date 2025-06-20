import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useMemo } from "react";

// Current user query using native Clerk metadata
const GET_CURRENT_USER = gql`
  query GetCurrentUser($currentUserId: uuid!) {
    users_by_pk(id: $currentUserId) {
      id
      name
      role
      is_staff
      is_active
      manager_id
      clerk_user_id
      created_at
      updated_at
    }
  }
`;

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

  // Extract database user ID from Clerk's native sessionClaims
  const databaseUserId = useMemo(() => {
    if (!isLoaded || !clerkUserId || !sessionClaims) return null;
    
    // Use Clerk's native JWT claims - no custom parsing needed
    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    return claims?.["x-hasura-user-id"] || null;
  }, [isLoaded, clerkUserId, sessionClaims]);

  // Apollo automatically handles deduplication and caching
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_CURRENT_USER, {
    variables: { currentUserId: databaseUserId },
    skip: !databaseUserId, // Don't query if no database user ID
    
    // Apollo's built-in optimizations (replaces auth-mutex functionality)
    fetchPolicy: 'cache-and-network', // Use cache first, then network
    errorPolicy: 'all', // Return partial data even with errors
    notifyOnNetworkStatusChange: true, // Track network state
    
    // Prevent unnecessary re-fetches
    nextFetchPolicy: 'cache-first',
  });

  const currentUser = data?.users_by_pk;
  const isReady = isLoaded && !loading;

  return {
    // User data
    currentUser,
    databaseUserId,
    clerkUserId,
    
    // Loading states
    loading: !isLoaded || loading,
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