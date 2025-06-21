import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { auth } from "@clerk/nextjs/server";

import { SecureErrorHandler } from "@/lib/security/error-responses";
import {
  CreateUserDocument,
  UpdateUserDocument,
  GetUserByClerkIdDocument,
  GetUserByEmailDocument,
} from "@/domains/users/graphql/generated/graphql";
import { GeneratePayrollDatesDocument } from "@/domains/payrolls/graphql/generated/graphql";

// Define allowed roles for admin operations
const ADMIN_ROLES = ["developer", "org_admin"];

// Cache configuration
const createCache = () => {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          clients: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          payrolls: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  });
};

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error in ${operation.operationName}]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(
      `[Network error in ${operation.operationName}]: ${networkError}`
    );
  }
});

// Retry link for resilience
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 10000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => !!error,
  },
});

// Create a secure Apollo client with service account credentials
function createServiceAccountClient() {
  // Use a service account token stored securely in environment variables
  const serviceAccountToken = process.env.HASURA_SERVICE_ACCOUNT_TOKEN;

  if (!serviceAccountToken) {
    throw new Error("Service account token not configured");
  }

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${serviceAccountToken}`,
    },
  }));

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "",
    credentials: "include",
  });

  return new ApolloClient({
    link: from([errorLink, retryLink, authLink, httpLink]),
    cache: createCache(),
    defaultOptions: {
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
    },
  });
}

// Secure Hasura service class
export class SecureHasuraService {
  private static instance: SecureHasuraService;
  private serviceClient: ApolloClient<any>;

  private constructor() {
    this.serviceClient = createServiceAccountClient();
  }

  static getInstance(): SecureHasuraService {
    if (!SecureHasuraService.instance) {
      SecureHasuraService.instance = new SecureHasuraService();
    }
    return SecureHasuraService.instance;
  }

  // Validate user has admin permissions
  async validateAdminAccess(): Promise<{
    isValid: boolean;
    userId?: string;
    role?: string;
  }> {
    try {
      const { userId, sessionClaims } = await auth();

      if (!userId) {
        return { isValid: false };
      }

      const userRole = sessionClaims?.metadata?.role as string;

      if (!userRole || !ADMIN_ROLES.includes(userRole)) {
        console.warn(`Access denied for user ${userId} with role ${userRole}`);
        return { isValid: false, userId, role: userRole };
      }

      return { isValid: true, userId, role: userRole };
    } catch (error) {
      console.error("Error validating admin access:", error);
      return { isValid: false };
    }
  }

  // Execute admin query with permission check
  async executeAdminQuery<T = any>(
    query: any,
    variables?: any,
    options?: { skipAuth?: boolean }
  ): Promise<{ data?: T; errors?: readonly any[] }> {
    // Skip auth check only for system operations (webhooks, cron jobs)
    if (!options?.skipAuth) {
      const { isValid, userId, role } = await this.validateAdminAccess();

      if (!isValid) {
        const error = SecureErrorHandler.authorizationError("admin access");
        throw new Error(error.error);
      }
    }

    try {
      const result = await this.serviceClient.query({
        query,
        variables,
        fetchPolicy: "network-only",
      });

      return { data: result.data, errors: result.errors || [] };
    } catch (error: any) {
      console.error("Admin query error:", error);
      return { errors: [error] };
    }
  }

  // Execute admin mutation with permission check
  async executeAdminMutation<T = any>(
    mutation: any,
    variables?: any,
    options?: { skipAuth?: boolean }
  ): Promise<{ data?: T; errors?: readonly any[] }> {
    // Skip auth check only for system operations
    if (!options?.skipAuth) {
      const { isValid, userId, role } = await this.validateAdminAccess();

      if (!isValid) {
        const error = SecureErrorHandler.authorizationError("admin access");
        throw new Error(error.error);
      }
    }

    try {
      const result = await this.serviceClient.mutate({
        mutation,
        variables,
      });

      return { data: result.data, errors: result.errors || [] };
    } catch (error: any) {
      console.error("Admin mutation error:", error);
      return { errors: [error] };
    }
  }

  // Specific methods for common admin operations
  async syncUserWithDatabase(
    clerkUserId: string,
    name: string,
    email: string,
    role?: string,
    managerId?: string,
    imageUrl?: string
  ) {
    const { isValid } = await this.validateAdminAccess();
    if (!isValid && !clerkUserId.startsWith("webhook_")) {
      throw new Error("Unauthorized: Cannot sync users without admin access");
    }

    // Check if user exists by Clerk ID first
    const { data: clerkUserData } = await this.executeAdminQuery(
      GetUserByClerkIdDocument,
      { clerkUserId },
      { skipAuth: clerkUserId.startsWith("webhook_") }
    );

    // Check if user exists by email as fallback
    const { data: emailUserData } = await this.executeAdminQuery(
      GetUserByEmailDocument,
      { email },
      { skipAuth: clerkUserId.startsWith("webhook_") }
    );

    const existingUser = clerkUserData?.users?.[0];
    
    if (existingUser) {
      // Update existing user
      const { data: updateData } = await this.executeAdminMutation(
        UpdateUserDocument,
        {
          id: existingUser.id,
          set: {
            name,
            role: role || existingUser.role,
            managerId,
            image: imageUrl,
          },
        },
        { skipAuth: clerkUserId.startsWith("webhook_") }
      );

      return updateData?.updateUser;
    } else {
      // Create new user
      const { data: createData } = await this.executeAdminMutation(
        CreateUserDocument,
        {
          object: {
            name,
            email,
            role: role || "viewer",
            managerId,
            clerkUserId,
            image: imageUrl,
            isStaff: true,
          },
        },
        { skipAuth: clerkUserId.startsWith("webhook_") }
      );

      return createData?.insertUser;
    }
  }

  // Clean all payroll dates (developer operation)
  async cleanAllPayrollDates() {
    const { isValid, userId } = await this.validateAdminAccess();
    if (!isValid) {
      throw new Error("Unauthorized: Only admins can clean payroll dates");
    }

    console.log(`Admin ${userId} is cleaning all payroll dates`);

    // This is a bulk admin operation that doesn't have a generated document equivalent
    // Keep as inline GraphQL for admin-only operations
    const CLEAN_ALL_DATES = gql`
      mutation CleanAllDatesAndVersions {
        delete_payroll_dates(where: {}) {
          affected_rows
        }
        delete_payrolls(where: { parent_payroll_id: { _is_null: false } }) {
          affected_rows
        }
        update_payrolls(
          where: {}
          _set: { superseded_date: null, version_number: 1 }
        ) {
          affected_rows
        }
      }
    `;

    const { data, errors } = await this.executeAdminMutation(CLEAN_ALL_DATES);

    if (errors) {
      throw new Error(`Failed to clean payroll dates: ${errors[0].message}`);
    }

    return {
      deletedDates: data.delete_payroll_dates.affected_rows,
      deletedVersions: data.delete_payrolls.affected_rows,
      resetPayrolls: data.update_payrolls.affected_rows,
    };
  }

  // Regenerate payroll dates for a specific payroll
  async regeneratePayrollDates(
    payrollId: string,
    startDate: string,
    endDate: string
  ) {
    const { isValid } = await this.validateAdminAccess();
    if (!isValid) {
      throw new Error("Unauthorized: Only admins can regenerate payroll dates");
    }

    // Use separate operations for better reliability
    // First delete existing dates
    const DELETE_DATES = gql`
      mutation DeletePayrollDates($payrollId: uuid!) {
        delete_payroll_dates(where: { payroll_id: { _eq: $payrollId } }) {
          affected_rows
        }
      }
    `;

    const { data: deleteData, errors: deleteErrors } = await this.executeAdminMutation(DELETE_DATES, {
      payrollId,
    });

    if (deleteErrors) {
      throw new Error(`Failed to delete existing dates: ${deleteErrors[0].message}`);
    }

    // Then generate new dates using the generated document
    const { data: generateData, errors: generateErrors } = await this.executeAdminQuery(GeneratePayrollDatesDocument, {
      payrollId,
      startDate,
      endDate,
      maxDates: null,
    });

    if (generateErrors) {
      throw new Error(`Failed to generate new dates: ${generateErrors[0].message}`);
    }

    const data = {
      delete_payroll_dates: deleteData?.delete_payroll_dates,
      generate_payroll_dates: generateData?.generatePayrollDates,
    };
    
    // Check for errors in the operation
    // This will be populated if there are actual errors from the operations

    return {
      deletedDates: data.delete_payroll_dates?.affected_rows || 0,
      generatedDates: data.generate_payroll_dates?.length || 0,
    };
  }
}

// Export singleton instance
// Lazy initialization to prevent build-time errors
let _secureHasuraService: SecureHasuraService | null = null;

export const secureHasuraService: Pick<
  SecureHasuraService,
  "executeAdminQuery" | "executeAdminMutation"
> = {
  executeAdminQuery: async <T = any>(
    query: any,
    variables?: any,
    options?: { skipAuth?: boolean }
  ): Promise<{ data?: T; errors?: readonly any[] }> => {
    if (!_secureHasuraService) {
      _secureHasuraService = SecureHasuraService.getInstance();
    }
    return _secureHasuraService.executeAdminQuery(query, variables, options);
  },
  executeAdminMutation: async <T = any>(
    mutation: any,
    variables?: any,
    options?: { skipAuth?: boolean }
  ): Promise<{ data?: T; errors?: readonly any[] }> => {
    if (!_secureHasuraService) {
      _secureHasuraService = SecureHasuraService.getInstance();
    }
    return _secureHasuraService.executeAdminMutation(
      mutation,
      variables,
      options
    );
  },
};
