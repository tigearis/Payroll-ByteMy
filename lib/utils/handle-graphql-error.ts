/**
 * Enhanced GraphQL Error Handler Utility
 *
 * Provides comprehensive error handling for GraphQL operations with:
 * - Permission denied error detection and messaging
 * - Role-based error messages
 * - Hasura auth failure parsing
 * - User-friendly error messages for common scenarios
 */

import { ApolloError } from "@apollo/client";

export interface GraphQLErrorDetails {
  type: "permission" | "auth" | "validation" | "network" | "unknown";
  message: string;
  userMessage: string;
  originalError?: any;
  suggestions?: string[];
  requiredRole?: string;
  currentRole?: string;
}

/**
 * Parse and handle GraphQL errors with enhanced messaging
 */
export function handleGraphQLError(
  error: ApolloError | Error
): GraphQLErrorDetails {
  // Handle ApolloError (GraphQL-specific errors)
  if (error instanceof ApolloError) {
    return handleApolloError(error);
  }

  // Handle generic JavaScript errors
  return {
    type: "unknown",
    message: error.message || "An unexpected error occurred",
    userMessage: "Something went wrong. Please try again.",
    originalError: error,
    suggestions: [
      "Refresh the page and try again",
      "Contact support if the problem persists",
    ],
  };
}

/**
 * Handle Apollo-specific GraphQL errors
 */
function handleApolloError(error: ApolloError): GraphQLErrorDetails {
  // Check for permission denied errors
  if (error.graphQLErrors?.length > 0) {
    const permissionError = error.graphQLErrors.find(
      err =>
        err.message.toLowerCase().includes("permission") ||
        err.message.toLowerCase().includes("denied") ||
        err.extensions?.code === "permission-denied"
    );

    if (permissionError) {
      return handlePermissionError(permissionError, error);
    }

    // Check for authentication errors
    const authError = error.graphQLErrors.find(
      err =>
        err.message.toLowerCase().includes("jwt") ||
        err.message.toLowerCase().includes("unauthorized") ||
        err.message.toLowerCase().includes("authentication") ||
        err.extensions?.code === "invalid-jwt"
    );

    if (authError) {
      return handleAuthError(authError, error);
    }

    // Check for validation errors
    const validationError = error.graphQLErrors.find(
      err =>
        err.extensions?.code === "validation-failed" ||
        err.message.toLowerCase().includes("validation")
    );

    if (validationError) {
      return handleValidationError(validationError, error);
    }

    // Return first GraphQL error with enhanced messaging
    const firstError = error.graphQLErrors[0];
    return {
      type: "unknown",
      message: firstError.message,
      userMessage: getReadableErrorMessage(firstError.message),
      originalError: error,
      suggestions: [
        "Check your input and try again",
        "Contact support if this issue persists",
      ],
    };
  }

  // Handle network errors
  if (error.networkError) {
    return handleNetworkError(error.networkError, error);
  }

  // Fallback for other Apollo errors
  return {
    type: "unknown",
    message: error.message || "GraphQL operation failed",
    userMessage: "Unable to complete the operation. Please try again.",
    originalError: error,
    suggestions: ["Check your connection and try again"],
  };
}

/**
 * Handle permission denied errors with role-specific messaging
 */
function handlePermissionError(
  graphQLError: any,
  originalError: ApolloError
): GraphQLErrorDetails {
  const message = graphQLError.message || "";
  const _extensions = graphQLError.extensions || {};

  // Extract role information from error
  let currentRole: string | undefined;
  let requiredRole: string | undefined;

  // Try to extract role from error message patterns
  const roleMatch = message.match(/role\s+["']([^"']+)["']/i);
  if (roleMatch) {
    currentRole = roleMatch[1];
  }

  // Check for specific permission patterns
  if (message.includes("developer")) {
    requiredRole = "developer";
  } else if (message.includes("admin")) {
    requiredRole = "developer"; // Map old admin references to developer
  } else if (message.includes("org_admin")) {
    requiredRole = "org_admin";
  } else if (message.includes("manager")) {
    requiredRole = "manager";
  }

  const userMessage = getUserFriendlyPermissionMessage(
    currentRole,
    requiredRole
  );
  const suggestions = getPermissionSuggestions(currentRole, requiredRole);

  return {
    type: "permission",
    message,
    userMessage,
    originalError,
    ...(currentRole && { currentRole }),
    ...(requiredRole && { requiredRole }),
    suggestions,
  };
}

/**
 * Handle authentication/JWT errors
 */
function handleAuthError(
  graphQLError: any,
  originalError: ApolloError
): GraphQLErrorDetails {
  const message = graphQLError.message || "";

  let userMessage = "Your session has expired. Please sign in again.";
  let suggestions = [
    "Sign out and sign back in",
    "Clear your browser cache and try again",
  ];

  if (message.includes("jwt") || message.includes("token")) {
    userMessage = "Authentication token is invalid. Please sign in again.";
  } else if (message.includes("unauthorized")) {
    userMessage = "You are not authorized to perform this action.";
    suggestions = [
      "Contact your administrator for access",
      "Ensure you have the correct permissions",
    ];
  }

  return {
    type: "auth",
    message,
    userMessage,
    originalError,
    suggestions,
  };
}

/**
 * Handle validation errors
 */
function handleValidationError(
  graphQLError: any,
  originalError: ApolloError
): GraphQLErrorDetails {
  const message = graphQLError.message || "";

  return {
    type: "validation",
    message,
    userMessage: "Please check your input and try again.",
    originalError,
    suggestions: [
      "Verify all required fields are filled",
      "Check that data formats are correct",
      "Ensure values meet the required constraints",
    ],
  };
}

/**
 * Handle network errors
 */
function handleNetworkError(
  networkError: any,
  originalError: ApolloError
): GraphQLErrorDetails {
  const isOffline = !navigator.onLine;

  let userMessage =
    "Network error. Please check your connection and try again.";
  let suggestions = [
    "Check your internet connection",
    "Try refreshing the page",
  ];

  if (isOffline) {
    userMessage =
      "You appear to be offline. Please check your internet connection.";
    suggestions = [
      "Check your internet connection",
      "Try again when you're back online",
    ];
  } else if (networkError.statusCode === 500) {
    userMessage = "Server error. We're working to fix this issue.";
    suggestions = [
      "Try again in a few minutes",
      "Contact support if the problem persists",
    ];
  } else if (networkError.statusCode === 403) {
    userMessage =
      "Access denied. You don't have permission to perform this action.";
    suggestions = [
      "Contact your administrator for access",
      "Verify your account permissions",
    ];
  }

  return {
    type: "network",
    message: networkError.message || "Network error",
    userMessage,
    originalError,
    suggestions,
  };
}

/**
 * Generate user-friendly permission messages based on roles
 */
function getUserFriendlyPermissionMessage(
  currentRole?: string,
  requiredRole?: string
): string {
  if (!currentRole && !requiredRole) {
    return "You don't have permission to perform this action.";
  }

  if (requiredRole) {
    const roleNames: Record<string, string> = {
      developer: "Developer",
      org_admin: "Organization Administrator",
      manager: "Manager",
      consultant: "Consultant",
      viewer: "Viewer",
    };

    const readableRole = roleNames[requiredRole] || requiredRole;
    return `This action requires ${readableRole} permissions. Your current role (${currentRole || "unknown"}) doesn't have sufficient access.`;
  }

  return `Your current role (${currentRole}) doesn't have permission to perform this action.`;
}

/**
 * Generate role-specific suggestions for permission errors
 */
function getPermissionSuggestions(
  currentRole?: string,
  requiredRole?: string
): string[] {
  const suggestions = ["Contact your administrator to request access"];

  if (requiredRole === "developer") {
    suggestions.push(
      "Developer access is required for this system administration function"
    );
  } else if (requiredRole === "org_admin") {
    suggestions.push(
      "Organization Administrator access is needed for this operation"
    );
  } else if (requiredRole === "manager") {
    suggestions.push("Manager permissions are required to manage team members");
  }

  suggestions.push("Verify your account has the correct role assigned");

  return suggestions;
}

/**
 * Convert technical error messages to user-friendly versions
 */
function getReadableErrorMessage(technicalMessage: string): string {
  const lowerMessage = technicalMessage.toLowerCase();

  if (lowerMessage.includes("unique") || lowerMessage.includes("duplicate")) {
    return "This item already exists. Please use a different value.";
  }

  if (
    lowerMessage.includes("foreign key") ||
    lowerMessage.includes("violates")
  ) {
    return "This action would create invalid data relationships.";
  }

  if (lowerMessage.includes("not null") || lowerMessage.includes("required")) {
    return "Please fill in all required fields.";
  }

  if (lowerMessage.includes("timeout")) {
    return "The operation took too long. Please try again.";
  }

  // Return the original message if no pattern matches
  return technicalMessage;
}

/**
 * Utility function to check if an error is a permission error
 */
export function isPermissionError(error: ApolloError | Error): boolean {
  if (error instanceof ApolloError) {
    return (
      error.graphQLErrors?.some(
        err =>
          err.message.toLowerCase().includes("permission") ||
          err.message.toLowerCase().includes("denied") ||
          err.extensions?.code === "permission-denied"
      ) || false
    );
  }
  return false;
}

/**
 * Utility function to check if an error is an auth error
 */
export function isAuthError(error: ApolloError | Error): boolean {
  if (error instanceof ApolloError) {
    return (
      error.graphQLErrors?.some(
        err =>
          err.message.toLowerCase().includes("jwt") ||
          err.message.toLowerCase().includes("unauthorized") ||
          err.message.toLowerCase().includes("authentication") ||
          err.extensions?.code === "invalid-jwt"
      ) || false
    );
  }
  return false;
}

/**
 * Get a simple user message for display in UI
 */
export function getSimpleErrorMessage(error: ApolloError | Error): string {
  const details = handleGraphQLError(error);
  return details.userMessage;
}

/**
 * Log error details for debugging while showing user-friendly message
 */
export function logAndShowError(
  error: ApolloError | Error,
  context?: string
): GraphQLErrorDetails {
  const details = handleGraphQLError(error);

  // Log technical details for debugging
  console.error(`GraphQL Error${context ? ` in ${context}` : ""}:`, {
    type: details.type,
    originalMessage: details.message,
    userMessage: details.userMessage,
    currentRole: details.currentRole,
    requiredRole: details.requiredRole,
    originalError: details.originalError,
  });

  return details;
}
