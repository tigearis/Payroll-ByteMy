// lib/utils/auth-error-utils.ts - Authentication error utilities

/**
 * Check if an Apollo/GraphQL error is authentication-related
 * Useful for error handling and conditional logic
 */
export function isAuthError(error: any): boolean {
  if (error?.graphQLErrors) {
    return error.graphQLErrors.some(
      (err: any) =>
        err.extensions?.code === "invalid-jwt" ||
        err.extensions?.code === "access-denied" ||
        err.message.includes("JWTExpired") ||
        err.message.includes("Could not verify JWT")
    );
  }
  return false;
}

/**
 * Check if an error indicates the user needs to re-authenticate
 */
export function isReauthRequired(error: any): boolean {
  return isAuthError(error) || 
    error?.networkError?.statusCode === 401 ||
    error?.message?.includes("Unauthorized");
}

/**
 * Extract error message for user display
 */
export function getAuthErrorMessage(error: any): string {
  if (isAuthError(error)) {
    return "Your session has expired. Please sign in again.";
  }
  
  if (error?.networkError?.statusCode === 403) {
    return "You don't have permission to access this resource.";
  }
  
  return "An authentication error occurred. Please try again.";
}