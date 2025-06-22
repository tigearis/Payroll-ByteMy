import {
  useQuery,
  useMutation,
  QueryHookOptions,
  DocumentNode,
  OperationVariables,
} from "@apollo/client";
import { useState, useEffect } from "react";
import { isPermissionError } from "@/lib/apollo";
import { handleGraphQLError } from "@/lib/utils/handle-graphql-error";

export interface GracefulQueryOptions<
  TData,
  TVariables extends OperationVariables,
> extends Omit<QueryHookOptions<TData, TVariables>, "context"> {
  /**
   * Fallback data to use when permission errors occur
   */
  fallbackData?: Partial<TData>;

  /**
   * Whether to show permission error toasts (default: true)
   */
  showPermissionErrors?: boolean;

  /**
   * Context name for error reporting
   */
  contextName?: string;

  /**
   * Fields that are known to be optional (won't trigger permission errors)
   */
  optionalFields?: string[];
}

export interface GracefulQueryResult<TData> {
  data: TData | undefined;
  loading: boolean;
  error?: any;
  refetch: () => void;
  hasPermissionError: boolean;
  permissionError?: any;
  canRetry: boolean;
}

export function useGracefulQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode,
  options: GracefulQueryOptions<TData, TVariables> = {}
): GracefulQueryResult<TData> {
  const {
    fallbackData,
    showPermissionErrors = true,
    contextName,
    optionalFields = [],
    ...apolloOptions
  } = options;

  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [permissionError, setPermissionError] = useState<any>(null);

  const queryResult = useQuery<TData, TVariables>(query, {
    ...apolloOptions,
    errorPolicy: "all", // Continue even with errors
    notifyOnNetworkStatusChange: true,
  });

  const { data, loading, error, refetch } = queryResult;

  useEffect(() => {
    if (error?.graphQLErrors) {
      const permissionErrors = error.graphQLErrors.filter(
        err =>
          err.message.toLowerCase().includes("permission") ||
          err.message.toLowerCase().includes("denied") ||
          err.extensions?.code === "permission-denied"
      );

      if (permissionErrors.length > 0) {
        setHasPermissionError(true);
        setPermissionError(permissionErrors[0]);

        if (showPermissionErrors) {
          console.warn(
            `Permission error in ${contextName}:`,
            permissionErrors[0].message
          );
        }
      } else {
        setHasPermissionError(false);
        setPermissionError(null);
      }
    } else {
      setHasPermissionError(false);
      setPermissionError(null);
    }
  }, [error, showPermissionErrors, contextName]);

  // Merge fallback data with actual data
  const mergedData =
    hasPermissionError && fallbackData
      ? ({ ...fallbackData, ...data } as TData)
      : data;

  // Determine if we can retry (not a permission issue)
  const canRetry = !hasPermissionError && !!error?.networkError;

  return {
    data: mergedData,
    loading,
    error,
    refetch,
    hasPermissionError,
    permissionError,
    canRetry,
  };
}

/**
 * Hook for handling mutations with graceful error handling
 */
export function useGracefulMutation<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(mutation: DocumentNode, options: any = {}) {
  const [mutationFn, result] = useMutation<TData, TVariables>(
    mutation,
    options
  );

  const gracefulMutate = async (mutationOptions: any = {}) => {
    try {
      const response = await mutationFn(mutationOptions);

      if (response.errors) {
        const permissionErrors = response.errors.filter(
          err =>
            err.message.toLowerCase().includes("permission") ||
            err.message.toLowerCase().includes("denied") ||
            err.extensions?.code === "permission-denied"
        );

        if (permissionErrors.length > 0) {
          console.warn(
            `Permission error in ${options.contextName}:`,
            permissionErrors[0].message
          );
          throw new Error(permissionErrors[0].message);
        }
      }

      return response;
    } catch (error: any) {
      if (isPermissionError(error)) {
        const parsedError = handleGraphQLError(error);
        console.warn(
          `Permission error in ${options.contextName}:`,
          parsedError.userMessage
        );
      }
      throw error;
    }
  };

  return [gracefulMutate, result] as const;
}
