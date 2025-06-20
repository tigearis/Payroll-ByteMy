import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import { extractDatabaseUserId } from "@/lib/auth/soc2-auth";

// Simplified current user query using native Clerk metadata
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

// Simplified hook using native Clerk features
export function useCurrentUser() {
  const { userId: clerkUserId, isLoaded, sessionClaims, getToken } = useAuth();
  const [databaseUserId, setDatabaseUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Extract database user ID from Clerk metadata (no JWT parsing needed!)
  useEffect(() => {
    if (!isLoaded) return;

    if (!clerkUserId) {
      setDatabaseUserId(null);
      setIsReady(true);
      return;
    }

    // Use native Clerk metadata access - much simpler!
    const dbId = extractDatabaseUserId(sessionClaims);
    setDatabaseUserId(dbId);
    setIsReady(true);
  }, [clerkUserId, isLoaded, sessionClaims]);

  // Query current user from database
  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
    variables: { currentUserId: databaseUserId },
    skip: !databaseUserId,
    errorPolicy: "all"
  });

  const currentUser = data?.users_by_pk;

  return {
    currentUser,
    loading: loading || !isReady,
    error,
    isReady: isReady && !loading,
    refetch,
    databaseUserId,
    clerkUserId,
    // Legacy compatibility
    currentUserId: databaseUserId,
    extractionAttempts: 0, // No longer needed with native Clerk
  };
}