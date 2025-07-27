"use client";

import { useQuery, QueryHookOptions, OperationVariables, TypedDocumentNode } from '@apollo/client';
import { useAuth } from '@clerk/nextjs';
import { useLogoutState } from '@/lib/auth/logout-state';

/**
 * Safe wrapper around useQuery that automatically handles logout states
 * Prevents GraphQL queries from running during logout transitions
 */
export function useSafeQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
  query: TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>
) {
  const { isSignedIn } = useAuth();
  const { isLoggingOut } = useLogoutState();

  // Combine skip conditions: not signed in OR logout in progress OR user-provided skip
  const shouldSkip = !isSignedIn || isLoggingOut || options?.skip;

  return useQuery(query, {
    ...options,
    skip: shouldSkip,
    errorPolicy: options?.errorPolicy || 'all', // Default to 'all' for better error handling
  });
}

/**
 * Hook to determine if GraphQL operations should be allowed
 * Use this in components to conditionally execute GraphQL operations
 */
export function useGraphQLSafety() {
  const { isSignedIn } = useAuth();
  const { isLoggingOut } = useLogoutState();

  const canExecuteQueries = isSignedIn && !isLoggingOut;

  return {
    canExecuteQueries,
    isSignedIn,
    isLoggingOut,
  };
}