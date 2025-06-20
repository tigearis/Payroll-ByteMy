import { ErrorResponse } from "@apollo/client/link/error";
import { toast } from "sonner";

// Track recent error messages to prevent duplicates
const recentErrors = new Set<string>();
const ERROR_DUPLICATE_TIMEOUT = 5000; // 5 seconds

function isDuplicateError(message: string): boolean {
  if (recentErrors.has(message)) {
    return true;
  }
  
  recentErrors.add(message);
  setTimeout(() => {
    recentErrors.delete(message);
  }, ERROR_DUPLICATE_TIMEOUT);
  
  return false;
}

export interface GraphQLPermissionError {
  message: string;
  field?: string;
  table?: string;
  role?: string;
}

export function isPermissionError(error: any): boolean {
  if (!error?.message) return false;

  const message = error.message.toLowerCase();
  return (
    (message.includes("field") && message.includes("not found in type")) ||
    message.includes("insufficient permissions") ||
    message.includes("access denied") ||
    message.includes("forbidden")
  );
}

export function parsePermissionError(error: any): GraphQLPermissionError {
  const message = error.message || "";

  // Extract field name from "field 'field_name' not found in type: 'table_name'"
  const fieldMatch = message.match(
    /field '([^']+)' not found in type: '([^']+)'/
  );

  return {
    message,
    field: fieldMatch?.[1],
    table: fieldMatch?.[2],
    role: undefined, // Could be extracted from context if available
  };
}

export function getPermissionErrorMessage(
  error: GraphQLPermissionError
): string {
  if (error.field && error.table) {
    return `You don't have permission to access the '${error.field}' field on ${error.table}. Contact your administrator to request access.`;
  }

  if (error.message.includes("insufficient permissions")) {
    return "You don't have sufficient permissions to perform this action. Contact your administrator for access.";
  }

  return "Access denied. You may not have the required permissions for this resource.";
}

export function handlePermissionError(
  error: GraphQLPermissionError,
  context?: string
): void {
  const userMessage = getPermissionErrorMessage(error);
  const errorKey = `permission_${error.field}_${error.table}`;

  // Prevent duplicate permission error toasts
  if (isDuplicateError(errorKey)) {
    return;
  }

  console.warn(`🔒 Permission Error${context ? ` in ${context}` : ""}:`, {
    field: error.field,
    table: error.table,
    originalMessage: error.message,
  });

  toast.error("Access Denied", {
    description: userMessage,
    duration: 8000,
    action: {
      label: "Contact Support",
      onClick: () => {
        // Could open a support modal or redirect to help
        toast.info(
          "Please contact your system administrator for assistance with permissions."
        );
      },
    },
  });
}

export function createApolloErrorHandler() {
  return ({
    graphQLErrors,
    networkError,
    operation,
    forward,
  }: ErrorResponse) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        if (isPermissionError(error)) {
          const permissionError = parsePermissionError(error);
          const context =
            operation.operationName || operation.query.definitions[0]?.kind;
          handlePermissionError(permissionError, context);
        } else {
          // Handle other GraphQL errors - but be more selective about showing toasts
          console.error(
            `🚨 GraphQL error in ${operation.operationName}:`,
            error.message,
            error.extensions
          );

          // Don't show toasts for certain error types that are expected or handled elsewhere
          const shouldShowToast = 
            !error.message.includes("cache") &&
            !error.message.includes("JWTExpired") &&
            !error.message.includes("Could not verify JWT") &&
            !error.message.includes("invalid-jwt") &&
            !(typeof error.extensions?.code === 'string' && error.extensions.code.includes("jwt")) &&
            !(typeof error.extensions?.code === 'string' && error.extensions.code.includes("auth"));

          const errorKey = `graphql_${error.message}`;
          if (shouldShowToast && !isDuplicateError(errorKey)) {
            toast.error("Data Error", {
              description:
                "There was an issue loading data. Please try refreshing the page.",
              duration: 5000,
            });
          }
        }
      });
    }

    if (networkError) {
      console.error(
        `🌐 Network error in ${operation.operationName}:`,
        networkError
      );

      const errorKey = `network_${networkError.message}`;
      if (!isDuplicateError(errorKey)) {
        toast.error("Connection Error", {
          description:
            "Unable to connect to the server. Please check your internet connection.",
          duration: 5000,
          action: {
            label: "Retry",
            onClick: () => {
              // Retry the operation
              return forward(operation);
            },
          },
        });
      }
    }
  };
}