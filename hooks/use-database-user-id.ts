'use client';

import { useQuery } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import { GetUserByClerkIdCompleteDocument } from '@/domains/users/graphql/generated/graphql';

/**
 * Hook to resolve Clerk user ID to database user ID
 * Critical for billing operations that need to store references to database users
 */
export function useDatabaseUserId() {
  const { user, isLoaded } = useUser();
  
  const { data, loading, error } = useQuery(GetUserByClerkIdCompleteDocument, {
    variables: { clerkId: user?.id || '' },
    skip: !user?.id || !isLoaded,
    errorPolicy: 'all'
  });

  const databaseUserId = data?.users?.[0]?.id;

  return {
    clerkUserId: user?.id,
    databaseUserId,
    isLoading: loading || !isLoaded,
    error,
    isReady: !!databaseUserId && isLoaded
  };
}

/**
 * Hook variant that returns only the database user ID for simple use cases
 */
export function useDatabaseUserIdOnly(): string | null {
  const { databaseUserId, isReady } = useDatabaseUserId();
  return isReady ? (databaseUserId || null) : null;
}