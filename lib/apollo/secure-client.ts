import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
  FetchResult,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createHttpLink } from "@apollo/client/link/http";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

// Security classifications for operations
export enum SecurityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Operation security metadata
interface OperationSecurityMetadata {
  securityLevel: SecurityLevel;
  requiredRole?: string;
  audit: boolean;
  mfa?: boolean;
  rateLimit?: string;
}

// Map of operation names to their security requirements
const operationSecurityMap: Record<string, OperationSecurityMetadata> = {
  // Standard operations
  GetPublicUsers: {
    securityLevel: SecurityLevel.LOW,
    requiredRole: "viewer",
    audit: false,
    rateLimit: "100/minute",
  },
  GetTeamMembers: {
    securityLevel: SecurityLevel.MEDIUM,
    requiredRole: "viewer",
    audit: false,
    rateLimit: "50/minute",
  },

  // Sensitive operations
  GetUserById: {
    securityLevel: SecurityLevel.HIGH,
    requiredRole: "consultant",
    audit: true,
    rateLimit: "20/minute",
  },
  GetUsersWithDetails: {
    securityLevel: SecurityLevel.HIGH,
    requiredRole: "manager",
    audit: true,
    rateLimit: "10/minute",
  },
  SearchUsersByEmail: {
    securityLevel: SecurityLevel.HIGH,
    requiredRole: "manager",
    audit: true,
    rateLimit: "5/minute",
  },

  // Critical operations
  GetAllUsersAdmin: {
    securityLevel: SecurityLevel.CRITICAL,
    requiredRole: "admin",
    audit: true,
    mfa: true,
    rateLimit: "5/minute",
  },
  ExportUserData: {
    securityLevel: SecurityLevel.CRITICAL,
    requiredRole: "admin",
    audit: true,
    mfa: true,
    rateLimit: "1/hour",
  },
  DeleteUserComplete: {
    securityLevel: SecurityLevel.CRITICAL,
    requiredRole: "admin",
    audit: true,
    mfa: true,
    rateLimit: "1/day",
  },
};

// Audit logging link
const createAuditLink = () => {
  return new ApolloLink((operation, forward) => {
    const operationName = operation.operationName;
    const security = operationSecurityMap[operationName];

    if (!security?.audit) {
      return forward(operation);
    }

    // Add audit context to operation
    operation.setContext({
      ...operation.getContext(),
      audit: {
        operationName,
        securityLevel: security.securityLevel,
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    });

    return new Observable<FetchResult>((observer) => {
      const startTime = Date.now();

      const subscription = forward(operation).subscribe({
        next: (result) => {
          // Log successful operation
          if (process.env.NODE_ENV !== "production") {
            console.log(`[AUDIT] Operation: ${operationName}`, {
              duration: Date.now() - startTime,
              securityLevel: security.securityLevel,
              success: true,
            });
          }
          observer.next(result);
        },
        error: (error) => {
          // Log failed operation
          console.error(`[AUDIT] Operation failed: ${operationName}`, {
            duration: Date.now() - startTime,
            securityLevel: security.securityLevel,
            success: false,
            error: error.message,
          });
          observer.error(error);
        },
        complete: () => observer.complete(),
      });

      return () => subscription.unsubscribe();
    });
  });
};

// Security validation link
const createSecurityLink = () => {
  return new ApolloLink((operation, forward) => {
    const operationName = operation.operationName;
    const security = operationSecurityMap[operationName];

    if (!security) {
      console.warn(
        `[SECURITY] No security metadata for operation: ${operationName}`
      );
      return forward(operation);
    }

    const context = operation.getContext();
    const userRole = context.headers?.["x-hasura-role"];

    // Validate role requirements
    if (security.requiredRole) {
      const roleHierarchy: Record<string, number> = {
        admin: 5,
        org_admin: 4,
        manager: 3,
        consultant: 2,
        viewer: 1,
      };

      const userLevel = roleHierarchy[userRole] || 0;
      const requiredLevel = roleHierarchy[security.requiredRole] || 999;

      if (userLevel < requiredLevel) {
        return new Observable<FetchResult>((observer) => {
          observer.error(
            new Error(
              `Insufficient permissions for operation ${operationName}. Required: ${security.requiredRole}, Current: ${userRole}`
            )
          );
        });
      }
    }

    // Add security headers
    operation.setContext({
      ...context,
      headers: {
        ...context.headers,
        "x-security-level": security.securityLevel,
        "x-audit-required": security.audit ? "true" : "false",
      },
    });

    return forward(operation);
  });
};

// Data masking link for sensitive fields
const createDataMaskingLink = () => {
  return new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const security = operationSecurityMap[operation.operationName];

      // Only mask data for HIGH and CRITICAL operations in non-admin contexts
      if (
        security?.securityLevel === SecurityLevel.HIGH ||
        security?.securityLevel === SecurityLevel.CRITICAL
      ) {
        const context = operation.getContext();
        const userRole = context.headers?.["x-hasura-role"];

        // Don't mask for admins
        if (userRole !== "admin" && userRole !== "org_admin") {
          // Apply field-level masking based on schema annotations
          // This would be implemented based on your specific masking requirements
          return response;
        }
      }

      return response;
    });
  });
};

// Create secure Apollo client
export function createSecureApolloClient(request?: NextRequest) {
  // HTTP link
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
    credentials: "include",
  });

  // Auth link
  const authLink = setContext(async (_, { headers }) => {
    if (request) {
      const { userId, sessionClaims } = await getAuth(request);

      if (userId) {
        return {
          headers: {
            ...headers,
            "x-hasura-user-id": userId,
            "x-hasura-role": sessionClaims?.metadata?.role || "viewer",
            "x-hasura-default-role": sessionClaims?.metadata?.role || "viewer",
            "x-hasura-allowed-roles": JSON.stringify(
              sessionClaims?.metadata?.allowedRoles || ["viewer"]
            ),
          },
        };
      }
    }

    return { headers };
  });

  // Error handling link
  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    const security = operationSecurityMap[operation.operationName];

    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          {
            operation: operation.operationName,
            securityLevel: security?.securityLevel,
          }
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`, {
        operation: operation.operationName,
        securityLevel: security?.securityLevel,
      });
    }
  });

  // Combine all links
  const link = from([
    errorLink,
    createAuditLink(),
    createSecurityLink(),
    createDataMaskingLink(),
    authLink,
    httpLink,
  ]);

  // Cache configuration with security considerations
  const cache = new InMemoryCache({
    typePolicies: {
      users: {
        fields: {
          // Mask sensitive fields in cache for non-admin users
          email: {
            read(existing, { readField, variables }) {
              const role = variables?.role;
              if (role !== "admin" && role !== "org_admin") {
                // Mask email for non-admin users
                return existing?.replace(/^(.{2}).*(@.*)$/, "$1***$2");
              }
              return existing;
            },
          },
          clerk_user_id: {
            read(existing, { variables }) {
              const role = variables?.role;
              // Only admins can see clerk_user_id
              if (role !== "admin") {
                return null;
              }
              return existing;
            },
          },
        },
      },
      payrolls: {
        fields: {
          employee_count: {
            read(existing, { variables }) {
              const role = variables?.role;
              // Only managers and above can see employee count
              if (role === "viewer" || role === "consultant") {
                return null;
              }
              return existing;
            },
          },
        },
      },
    },
  });

  return new ApolloClient({
    link,
    cache,
    defaultOptions: {
      query: {
        fetchPolicy: "network-only", // Always fetch fresh data for security
        errorPolicy: "all",
      },
      watchQuery: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
      mutate: {
        // Add optimistic response support while maintaining security
        // Only critical operations will still use network-only
        fetchPolicy: (operation) => {
          const security = operationSecurityMap[operation.operationName];
          return security?.securityLevel === SecurityLevel.CRITICAL
            ? "network-only"
            : "cache-first";
        },
        errorPolicy: "all",
      },
    },
  });
}

// Export security utilities
export { operationSecurityMap };
export type { OperationSecurityMetadata };
