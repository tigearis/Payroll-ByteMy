import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";

// Get current user by their database UUID from JWT token
// Using session variable syntax for Hasura
const GET_CURRENT_USER = gql`
  query GetCurrentUser($currentUserId: uuid!) {
    users_by_pk(id: $currentUserId) {
      id
      name
      email
      role
      is_staff
      manager_id
      clerk_user_id
      created_at
      updated_at
    }
  }
`;

export function useCurrentUser() {
  const { userId: clerkUserId, getToken } = useAuth();
  const [databaseUserId, setDatabaseUserId] = useState<string | null>(null);

  // Extract the database UUID from JWT token
  useEffect(() => {
    async function extractUserIdFromJWT() {
      if (!clerkUserId) {
        setDatabaseUserId(null);
        return;
      }

      try {
        const token = await getToken({ template: "hasura" });
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const hasuraClaims = payload["https://hasura.io/jwt/claims"];
          const databaseId = hasuraClaims?.["x-hasura-user-id"];
          
          if (databaseId) {
            setDatabaseUserId(databaseId);
          } else {
            console.error("No x-hasura-user-id found in JWT claims");
          }
        }
      } catch (error) {
        console.error("Failed to extract user ID from JWT:", error);
      }
    }

    extractUserIdFromJWT();
  }, [clerkUserId, getToken]);

  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
    variables: { currentUserId: databaseUserId },
    skip: !databaseUserId, // Only run when we have the database UUID
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    onError: (err) => {
      console.error("useCurrentUser GraphQL error:", err);
      console.error("Error message:", err.message);
      console.error("GraphQL errors:", err.graphQLErrors);
      console.error("Network error:", err.networkError);
      console.error("Clerk User ID:", clerkUserId);
      console.error("Database User ID:", databaseUserId);
      
      // Log specific error details
      if (err.graphQLErrors?.length > 0) {
        err.graphQLErrors.forEach((gqlError, index) => {
          console.error(`GraphQL Error ${index + 1}:`, {
            message: gqlError.message,
            code: gqlError.extensions?.code,
            path: gqlError.path,
            locations: gqlError.locations,
          });
        });
      }
      
      if (err.networkError) {
        console.error("Network Error Details:", {
          statusCode: err.networkError.statusCode,
          message: err.networkError.message,
        });
      }
    },
  });

  const currentUser = data?.users_by_pk || null;

  // Ensure currentUserId is always a valid UUID or null
  const currentUserId = currentUser?.id || null;

  // Validate that currentUserId is a UUID format if it exists
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const validCurrentUserId =
    currentUserId && uuidRegex.test(currentUserId) ? currentUserId : null;

  if (currentUserId && !validCurrentUserId) {
    console.error("⚠️ Invalid UUID format for currentUserId:", currentUserId);
  }

  // Log if user not found (this is now expected to be handled by webhooks)
  if (clerkUserId && !loading && !currentUser && !error) {
    console.warn("⚠️ User not found in database for Clerk ID:", clerkUserId);
    console.warn("📝 This should be automatically synced via Clerk webhooks");
    console.warn("🔧 Check that webhook processing is working correctly");
    console.warn("🔄 You can manually sync by calling /api/sync-current-user");
  }

  return {
    currentUser,
    currentUserId: validCurrentUserId, // Always return a valid UUID or null
    clerkUserId,
    loading,
    error,
    refetch,
  };
}
