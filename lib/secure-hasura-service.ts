import { auth } from "@clerk/nextjs/server";
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
import { SecureErrorHandler } from "@/lib/api/responses";

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
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
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

      return { data: result.data, errors: result.errors };
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

      return { data: result.data, errors: result.errors };
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

    const CHECK_USER = gql`
      query CheckUser($clerkId: String!, $email: String!) {
        userByClerkId: users(where: { clerk_user_id: { _eq: $clerkId } }) {
          id
          email
          role
        }
        userByEmail: users(where: { email: { _eq: $email } }) {
          id
          email
          clerk_user_id
        }
      }
    `;

    const CREATE_USER = gql`
      mutation CreateUser(
        $name: String!
        $email: String!
        $role: user_role!
        $managerId: uuid
        $clerkUserId: String!
        $image: String
      ) {
        insert_users_one(
          object: {
            name: $name
            email: $email
            role: $role
            manager_id: $managerId
            clerk_user_id: $clerkUserId
            image: $image
            is_staff: true
          }
        ) {
          id
          name
          email
          role
          clerk_user_id
        }
      }
    `;

    const UPDATE_USER = gql`
      mutation UpdateUser(
        $id: uuid!
        $name: String!
        $role: user_role
        $managerId: uuid
        $image: String
      ) {
        update_users_by_pk(
          pk_columns: { id: $id }
          _set: {
            name: $name
            role: $role
            manager_id: $managerId
            image: $image
            updated_at: "now()"
          }
        ) {
          id
          name
          email
          role
        }
      }
    `;

    // Check if user exists
    const { data: checkData } = await this.executeAdminQuery(
      CHECK_USER,
      {
        clerkId: clerkUserId,
        email,
      },
      { skipAuth: clerkUserId.startsWith("webhook_") }
    );

    if (checkData?.userByClerkId?.[0]) {
      // Update existing user
      const user = checkData.userByClerkId[0];
      const { data: updateData } = await this.executeAdminMutation(
        UPDATE_USER,
        {
          id: user.id,
          name,
          role: role || user.role,
          managerId,
          image: imageUrl,
        },
        { skipAuth: clerkUserId.startsWith("webhook_") }
      );

      return updateData?.update_users_by_pk;
    } else {
      // Create new user
      const { data: createData } = await this.executeAdminMutation(
        CREATE_USER,
        {
          name,
          email,
          role: role || "viewer",
          managerId,
          clerkUserId,
          image: imageUrl,
        },
        { skipAuth: clerkUserId.startsWith("webhook_") }
      );

      return createData?.insert_users_one;
    }
  }

  // Clean all payroll dates (developer operation)
  async cleanAllPayrollDates() {
    const { isValid, userId } = await this.validateAdminAccess();
    if (!isValid) {
      throw new Error("Unauthorized: Only admins can clean payroll dates");
    }

    console.log(`Admin ${userId} is cleaning all payroll dates`);

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

    const REGENERATE_DATES = gql`
      mutation RegenerateDates(
        $payrollId: uuid!
        $startDate: date!
        $endDate: date!
      ) {
        delete_payroll_dates(where: { payroll_id: { _eq: $payrollId } }) {
          affected_rows
        }
        generate_payroll_dates(
          p_payroll_id: $payrollId
          p_start_date: $startDate
          p_end_date: $endDate
        ) {
          id
          original_eft_date
          adjusted_eft_date
          processing_date
        }
      }
    `;

    const { data, errors } = await this.executeAdminMutation(REGENERATE_DATES, {
      payrollId,
      startDate,
      endDate,
    });

    if (errors) {
      throw new Error(`Failed to regenerate dates: ${errors[0].message}`);
    }

    return {
      deletedDates: data.delete_payroll_dates.affected_rows,
      generatedDates: data.generate_payroll_dates.length,
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
