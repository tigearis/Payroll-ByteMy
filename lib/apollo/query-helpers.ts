import "server-only";
import { DocumentNode } from '@apollo/client';
import { getHasuraToken } from '@/lib/auth/token-utils';
import { serverApolloClient } from './unified-client';

/**
 * Apollo Query Helpers for Server-Side Operations
 * 
 * Provides clean, typed interfaces for GraphQL operations in API routes
 * while maintaining full Apollo Client benefits and authentication.
 * 
 * SERVER-ONLY: These functions can only be used in server contexts
 */

export interface QueryOptions {
  /** Additional context to pass to Apollo Client */
  context?: any;
  /** Override default fetch policy */
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache';
}

export interface MutationOptions {
  /** Additional context to pass to Apollo Client */
  context?: any;
  /** Whether to refetch queries after mutation */
  refetchQueries?: boolean;
}

/**
 * Execute an authenticated GraphQL query using Apollo Client
 * 
 * @param document - GraphQL query document (generated from codegen)
 * @param variables - Query variables
 * @param options - Additional query options
 * @returns Typed query response data
 */
export async function executeQuery<TData = any, TVariables = any>(
  document: DocumentNode,
  variables?: TVariables,
  options: QueryOptions = {}
): Promise<TData> {
  try {
    // Get authenticated Hasura token
    const { token, error: tokenError } = await getHasuraToken();
    
    if (!token || tokenError) {
      throw new Error(`Authentication failed: ${tokenError || 'No token available'}`);
    }

    // Execute query with Apollo Client
    const { data, errors } = await serverApolloClient.query({
      query: document,
      variables,
      fetchPolicy: options.fetchPolicy || 'no-cache', // Default to fresh data for API routes
      context: {
        // Tell auth link to use server context
        context: "server",
        headers: {
          authorization: `Bearer ${token}`,
        },
        // Merge any additional context
        ...options.context,
      },
    });

    // Handle GraphQL errors
    if (errors && errors.length > 0) {
      throw new Error(`GraphQL error: ${errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error('Apollo query execution failed:', error);
    throw error instanceof Error ? error : new Error('Unknown query error');
  }
}

/**
 * Execute an authenticated GraphQL mutation using Apollo Client
 * 
 * @param document - GraphQL mutation document (generated from codegen)
 * @param variables - Mutation variables
 * @param options - Additional mutation options
 * @returns Typed mutation response data
 */
export async function executeMutation<TData = any, TVariables = any>(
  document: DocumentNode,
  variables?: TVariables,
  options: MutationOptions = {}
): Promise<TData> {
  try {
    // Get authenticated Hasura token
    const { token, error: tokenError } = await getHasuraToken();
    
    if (!token || tokenError) {
      throw new Error(`Authentication failed: ${tokenError || 'No token available'}`);
    }

    // Execute mutation with Apollo Client
    const { data, errors } = await serverApolloClient.mutate({
      mutation: document,
      variables,
      context: {
        // Tell auth link to use server context
        context: "server",
        headers: {
          authorization: `Bearer ${token}`,
        },
        // Merge any additional context
        ...options.context,
      },
    });

    // Handle GraphQL errors
    if (errors && errors.length > 0) {
      throw new Error(`GraphQL error: ${errors[0].message}`);
    }

    return data;
  } catch (error) {
    console.error('Apollo mutation execution failed:', error);
    throw error instanceof Error ? error : new Error('Unknown mutation error');
  }
}

/**
 * Type-safe wrapper for common query patterns
 * Provides better error messages and logging for development
 */
export async function executeTypedQuery<TQuery, TVariables = Record<string, any>>(
  document: DocumentNode,
  variables?: TVariables,
  options: QueryOptions = {}
): Promise<TQuery> {
  return executeQuery<TQuery, TVariables>(document, variables, options);
}

/**
 * Type-safe wrapper for common mutation patterns
 * Provides better error messages and logging for development
 */
export async function executeTypedMutation<TMutation, TVariables = Record<string, any>>(
  document: DocumentNode,
  variables?: TVariables,
  options: MutationOptions = {}
): Promise<TMutation> {
  return executeMutation<TMutation, TVariables>(document, variables, options);
}