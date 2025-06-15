import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useState, useEffect, useCallback } from "react";

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
  const { userId: clerkUserId, getToken, isLoaded } = useAuth();
  const [databaseUserId, setDatabaseUserId] = useState<string | null>(null);
  const [isExtractingUserId, setIsExtractingUserId] = useState(false);
  const [extractionAttempts, setExtractionAttempts] = useState(0);
  const [lastExtractionTime, setLastExtractionTime] = useState<number>(0);

  // Extract the database UUID from JWT token with debouncing and retry logic
  const extractUserIdFromJWT = useCallback(async () => {
    if (!clerkUserId || !isLoaded) {
      setDatabaseUserId(null);
      setIsExtractingUserId(false);
      return;
    }

    // Prevent too frequent attempts (debounce)
    const now = Date.now();
    if (now - lastExtractionTime < 1000) {
      // 1 second debounce
      return;
    }

    // Limit retry attempts to prevent infinite loops
    if (extractionAttempts >= 5) {
      console.warn("⚠️ Max extraction attempts reached, stopping retries");
      setIsExtractingUserId(false);
      return;
    }

    setIsExtractingUserId(true);
    setLastExtractionTime(now);

    try {
      const token = await getToken({ template: "hasura" });
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const hasuraClaims = payload["https://hasura.io/jwt/claims"];
        const databaseId = hasuraClaims?.["x-hasura-user-id"];

        if (databaseId) {
          setDatabaseUserId(databaseId);
          setExtractionAttempts(0); // Reset attempts on success
          console.log(
            "✅ Successfully extracted database user ID:",
            databaseId
          );
        } else {
          console.warn(
            "⚠️ No x-hasura-user-id found in JWT claims, attempt:",
            extractionAttempts + 1
          );
          setExtractionAttempts((prev) => prev + 1);

          // If no database ID found, try to sync user
          if (extractionAttempts === 0) {
            console.log("🔄 Attempting to sync user with database...");
            try {
              const syncResponse = await fetch("/api/sync-current-user", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              if (syncResponse.ok) {
                console.log(
                  "✅ User sync successful, retrying token extraction..."
                );
                // Retry extraction after a short delay
                setTimeout(() => {
                  setExtractionAttempts(0);
                  extractUserIdFromJWT();
                }, 2000);
              }
            } catch (syncError) {
              console.error("❌ User sync failed:", syncError);
            }
          }
        }
      } else {
        console.warn("⚠️ No token received from Clerk");
        setExtractionAttempts((prev) => prev + 1);
      }
    } catch (error) {
      console.error("❌ Failed to extract user ID from JWT:", error);
      setExtractionAttempts((prev) => prev + 1);
    } finally {
      setIsExtractingUserId(false);
    }
  }, [clerkUserId, getToken, isLoaded, extractionAttempts, lastExtractionTime]);

  // Extract user ID when Clerk user changes
  useEffect(() => {
    if (isLoaded) {
      extractUserIdFromJWT();
    }
  }, [clerkUserId, isLoaded, extractUserIdFromJWT]);

  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery(GET_CURRENT_USER, {
    variables: { currentUserId: databaseUserId },
    skip: !databaseUserId, // Only run when we have the database UUID
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    onError: (err) => {
      console.error("❌ useCurrentUser GraphQL error:", err);

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
          statusCode: (err.networkError as any).statusCode,
          message: err.networkError.message,
        });
      }
    },
  });

  const currentUser = data?.users_by_pk || null;

  // Combine loading states - we're loading if either extracting user ID or running query
  const loading = isExtractingUserId || queryLoading;

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

  // Enhanced logging for debugging (throttled to prevent spam)
  useEffect(() => {
    const logState = () => {
      console.log("🔍 useCurrentUser state:", {
        clerkUserId,
        databaseUserId,
        hasCurrentUser: !!currentUser,
        loading,
        hasError: !!error,
        querySkipped: !databaseUserId,
        isExtractingUserId,
        queryLoading,
        extractionAttempts,
        isLoaded,
        timestamp: new Date().toISOString(),
      });
    };

    // Throttle logging to every 2 seconds max
    const timeoutId = setTimeout(logState, 100);
    return () => clearTimeout(timeoutId);
  }, [
    clerkUserId,
    databaseUserId,
    currentUser,
    loading,
    error,
    isExtractingUserId,
    queryLoading,
    extractionAttempts,
    isLoaded,
  ]);

  return {
    currentUser,
    currentUserId: validCurrentUserId, // Always return a valid UUID or null
    clerkUserId,
    databaseUserId, // Expose this for debugging
    loading,
    error,
    refetch,
    extractionAttempts, // Expose for debugging
    isExtractingUserId, // Expose for debugging
  };
}
