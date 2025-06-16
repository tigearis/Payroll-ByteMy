import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useState, useEffect, useCallback, useRef } from "react";
import { authMutex } from "@/lib/auth/auth-mutex";

// Get current user by their database UUID from JWT token
// Using session variable syntax for Hasura
// Note: Using minimal fields to avoid permission issues during JWT refresh
const GET_CURRENT_USER = gql`
  query GetCurrentUser($currentUserId: uuid!) {
    users_by_pk(id: $currentUserId) {
      id
      name
      role
      is_staff
      manager_id
      clerk_user_id
      created_at
      updated_at
    }
  }
`;

// Fallback query with even fewer fields if the main query fails
const GET_CURRENT_USER_MINIMAL = gql`
  query GetCurrentUserMinimal($currentUserId: uuid!) {
    users_by_pk(id: $currentUserId) {
      id
      name
      is_staff
    }
  }
`;

// Ultra minimal query with just basic fields that should always be accessible
const GET_CURRENT_USER_BASIC = gql`
  query GetCurrentUserBasic($currentUserId: uuid!) {
    users_by_pk(id: $currentUserId) {
      id
      name
    }
  }
`;

export function useCurrentUser() {
  const { userId: clerkUserId, getToken, isLoaded } = useAuth();
  const [databaseUserId, setDatabaseUserId] = useState<string | null>(null);
  const [isExtractingUserId, setIsExtractingUserId] = useState(false);
  const [extractionAttempts, setExtractionAttempts] = useState(0);
  const [lastExtractionTime, setLastExtractionTime] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);
  const [queryLevel, setQueryLevel] = useState<'full' | 'minimal' | 'basic'>('full');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoggedSuccessRef = useRef<boolean>(false);
  const extractionPromiseRef = useRef<Promise<void> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Extract the database UUID from JWT token with request deduplication
  const extractUserIdFromJWT = useCallback(async () => {
    if (!clerkUserId || !isLoaded) {
      setDatabaseUserId(null);
      setIsExtractingUserId(false);
      setIsReady(true); // Ready even without user (unauthenticated state)
      return;
    }

    // Don't re-extract if we already have a valid database user ID
    if (databaseUserId && isReady) {
      return;
    }

    // If already extracting, wait for the current promise
    if (extractionPromiseRef.current) {
      console.log('⏳ User ID extraction already in progress, waiting...');
      try {
        await extractionPromiseRef.current;
        return;
      } catch (error) {
        console.warn('❌ Previous extraction failed:', error);
        // Continue with new extraction attempt
      }
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Prevent too frequent attempts (debounce)
    const now = Date.now();
    if (now - lastExtractionTime < 2000) {
      // Increased to 2 seconds for better stability
      timeoutRef.current = setTimeout(() => extractUserIdFromJWT(), 2000);
      return;
    }

    // Limit retry attempts to prevent infinite loops
    if (extractionAttempts >= 3) {
      console.warn("⚠️ Max extraction attempts reached, stopping retries");
      setIsExtractingUserId(false);
      setIsReady(true); // Set ready even on failure to prevent infinite loading
      return;
    }

    // Create abort controller for this extraction
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Create the extraction promise
    extractionPromiseRef.current = performExtraction(signal, now);
    
    try {
      await extractionPromiseRef.current;
    } catch (error) {
      if (!signal.aborted) {
        console.error("❌ User ID extraction failed:", error);
      }
    } finally {
      extractionPromiseRef.current = null;
      if (abortControllerRef.current?.signal === signal) {
        abortControllerRef.current = null;
      }
    }
  }, [clerkUserId, getToken, isLoaded, extractionAttempts, databaseUserId, isReady]);

  // Separate function to perform the actual extraction
  const performExtraction = useCallback(async (signal: AbortSignal, startTime: number) => {
    setIsExtractingUserId(true);
    setLastExtractionTime(startTime);

    try {
      // Check if aborted before starting
      if (signal.aborted) {
        throw new Error('Extraction aborted');
      }

      const token = await getToken({ template: "hasura" });
      
      // Check if aborted after getting token
      if (signal.aborted) {
        throw new Error('Extraction aborted');
      }

      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const hasuraClaims = payload["https://hasura.io/jwt/claims"];
        const databaseId = hasuraClaims?.["x-hasura-user-id"];

        if (databaseId) {
          if (!signal.aborted) {
            setDatabaseUserId(databaseId);
            setExtractionAttempts(0); // Reset attempts on success
            setIsReady(true); // Mark as ready when we have user ID
            // Only log once per session
            if (!hasLoggedSuccessRef.current) {
              console.log(
                "✅ Successfully extracted database user ID:",
                databaseId
              );
              hasLoggedSuccessRef.current = true;
            }
          }
        } else {
          console.warn(
            "⚠️ No x-hasura-user-id found in JWT claims, attempt:",
            extractionAttempts + 1
          );
          
          if (!signal.aborted) {
            setExtractionAttempts((prev) => prev + 1);

            // If no database ID found, try to sync user (but don't retry infinitely)
            if (extractionAttempts === 0) {
              console.log("🔄 Attempting to sync user with database...");
              try {
                // Use mutex to prevent concurrent sync operations
                await authMutex.acquire(
                  `user-sync-${clerkUserId}-${Date.now()}`,
                  'user_extraction',
                  async () => {
                    const syncResponse = await fetch("/api/sync-current-user", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      signal, // Add abort signal to fetch
                    });

                    if (syncResponse.ok && !signal.aborted) {
                      console.log(
                        "✅ User sync successful, retrying token extraction..."
                      );
                      // Retry extraction after a delay
                      timeoutRef.current = setTimeout(() => {
                        if (!signal.aborted) {
                          setExtractionAttempts(0);
                          extractUserIdFromJWT();
                        }
                      }, 2000);
                    } else if (!signal.aborted) {
                      setIsReady(true); // Mark ready even if sync fails to prevent infinite loading
                    }
                    return true;
                  }
                );
              } catch (syncError: any) {
                if (syncError.name !== 'AbortError' && !signal.aborted) {
                  console.error("❌ User sync failed:", syncError);
                  setIsReady(true); // Mark ready even if sync fails
                }
              }
            } else {
              setIsReady(true); // Mark ready after max attempts
            }
          }
        }
      } else {
        console.warn("⚠️ No token received from Clerk");
        if (!signal.aborted) {
          setExtractionAttempts((prev) => prev + 1);
          setIsReady(true);
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && !signal.aborted) {
        console.error("❌ Failed to extract user ID from JWT:", error);
        setExtractionAttempts((prev) => prev + 1);
        setIsReady(true);
      }
    } finally {
      if (!signal.aborted) {
        setIsExtractingUserId(false);
      }
    }
  }, [clerkUserId, getToken, isLoaded, extractionAttempts, databaseUserId, isReady]);

  // Cleanup timeout and abort ongoing requests on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Extract user ID when Clerk user changes (but only if we don't already have it)
  useEffect(() => {
    if (isLoaded && clerkUserId && !databaseUserId && !isExtractingUserId) {
      extractUserIdFromJWT();
    }
  }, [clerkUserId, isLoaded, databaseUserId, isExtractingUserId, extractUserIdFromJWT]);

  // Select query based on current level
  const getCurrentQuery = () => {
    switch (queryLevel) {
      case 'basic': return GET_CURRENT_USER_BASIC;
      case 'minimal': return GET_CURRENT_USER_MINIMAL;
      default: return GET_CURRENT_USER;
    }
  };

  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery(getCurrentQuery(), {
    variables: { currentUserId: databaseUserId },
    skip: !databaseUserId || !isReady, // Only run when we have database UUID AND extraction is ready
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    onError: (err) => {
      console.error("❌ useCurrentUser GraphQL error:", err);

      // Check if this is a field permission error and try next level down
      const hasFieldError = err.graphQLErrors?.some(gqlError => 
        gqlError.message.includes("field") && 
        gqlError.message.includes("not found")
      );

      if (hasFieldError) {
        if (queryLevel === 'full') {
          console.log("🔄 Switching to minimal query due to field permission error");
          setQueryLevel('minimal');
          return;
        } else if (queryLevel === 'minimal') {
          console.log("🔄 Switching to basic query due to field permission error");
          setQueryLevel('basic');
          return;
        }
      }

      // Log specific error details only if we can't fallback further
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

  // Combine loading states - we're loading if either extracting user ID, running query, or not ready
  const loading = !isReady || isExtractingUserId || (databaseUserId && queryLoading);

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

  // Enhanced logging for debugging (only on significant state changes)
  const lastLoggedStateRef = useRef<string>("");
  useEffect(() => {
    const currentState = {
      clerkUserId: !!clerkUserId,
      databaseUserId: !!databaseUserId,
      hasCurrentUser: !!currentUser,
      loading,
      isReady,
      hasError: !!error,
      isExtractingUserId,
      queryLoading,
      extractionAttempts,
      isLoaded,
    };

    const stateString = JSON.stringify(currentState);
    
    // Only log if state actually changed
    if (stateString !== lastLoggedStateRef.current) {
      console.log("🔍 useCurrentUser state changed:", currentState);
      lastLoggedStateRef.current = stateString;
    }
  }, [
    clerkUserId,
    databaseUserId,
    currentUser,
    loading,
    isReady,
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
    isReady, // Expose for debugging
  };
}
