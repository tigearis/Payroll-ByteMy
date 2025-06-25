/**
 * Admin Operations Service
 * 
 * Provides secure admin operations using the unified Apollo client.
 * Replaces the functionality from secure-hasura-service.ts with 
 * unified client approach.
 */

import { auth } from "@clerk/nextjs/server";
import { gql } from "@apollo/client";

import { adminApolloClient } from "./unified-client";
import { ApiResponses } from "@/lib/api-responses";
import {
  CreateUserDocument,
  UpdateUserDocument,
  GetUserByClerkIdDocument,
  GetUserByEmailDocument,
} from "@/domains/users/graphql/generated/graphql";
import { GeneratePayrollDatesDocument } from "@/domains/payrolls/graphql/generated/graphql";

// Define allowed roles for admin operations
const ADMIN_ROLES = ["developer", "org_admin"];

/**
 * Admin operations service using unified Apollo client
 */
export class AdminOperationsService {
  private static instance: AdminOperationsService;

  private constructor() {}

  static getInstance(): AdminOperationsService {
    if (!AdminOperationsService.instance) {
      AdminOperationsService.instance = new AdminOperationsService();
    }
    return AdminOperationsService.instance;
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
      const { isValid } = await this.validateAdminAccess();

      if (!isValid) {
        throw new Error("Insufficient permissions for admin access");
      }
    }

    try {
      const result = await adminApolloClient.query({
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
      const { isValid } = await this.validateAdminAccess();

      if (!isValid) {
        throw new Error("Insufficient permissions for admin access");
      }
    }

    try {
      const result = await adminApolloClient.mutate({
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
    const { data: _emailUserData } = await this.executeAdminQuery(
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

    // This is a bulk admin operation - keep as inline GraphQL for admin-only operations
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
      deletedDates: data.deletepayroll_dates.affected_rows,
      deletedVersions: data.deletepayrolls.affected_rows,
      resetPayrolls: data.updatepayrolls.affected_rows,
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

    const { data: deleteData, errors: deleteErrors } =
      await this.executeAdminMutation(DELETE_DATES, {
        payrollId,
      });

    if (deleteErrors) {
      throw new Error(
        `Failed to delete existing dates: ${deleteErrors[0].message}`
      );
    }

    // Then generate new dates using the generated document
    const { data: generateData, errors: generateErrors } =
      await this.executeAdminQuery(GeneratePayrollDatesDocument, {
        payrollId,
        startDate,
        endDate,
        maxDates: null,
      });

    if (generateErrors) {
      throw new Error(
        `Failed to generate new dates: ${generateErrors[0].message}`
      );
    }

    const data = {
      delete_payroll_dates: deleteData?.delete_payroll_dates,
      generate_payroll_dates: generateData?.generatePayrollDates,
    };

    return {
      deletedDates: data.delete_payroll_dates?.affected_rows || 0,
      generatedDates: data.generate_payroll_dates?.length || 0,
    };
  }
}

// Export singleton instance with lazy initialization
let _adminOperationsService: AdminOperationsService | null = null;

export const adminOperationsService: Pick<
  AdminOperationsService,
  "executeAdminQuery" | "executeAdminMutation" | "syncUserWithDatabase" | "cleanAllPayrollDates" | "regeneratePayrollDates"
> = {
  executeAdminQuery: async <T = any>(
    query: any,
    variables?: any,
    options?: { skipAuth?: boolean }
  ): Promise<{ data?: T; errors?: readonly any[] }> => {
    if (!_adminOperationsService) {
      _adminOperationsService = AdminOperationsService.getInstance();
    }
    return _adminOperationsService.executeAdminQuery(query, variables, options);
  },
  
  executeAdminMutation: async <T = any>(
    mutation: any,
    variables?: any,
    options?: { skipAuth?: boolean }
  ): Promise<{ data?: T; errors?: readonly any[] }> => {
    if (!_adminOperationsService) {
      _adminOperationsService = AdminOperationsService.getInstance();
    }
    return _adminOperationsService.executeAdminMutation(
      mutation,
      variables,
      options
    );
  },

  syncUserWithDatabase: async (
    clerkUserId: string,
    name: string,
    email: string,
    role?: string,
    managerId?: string,
    imageUrl?: string
  ) => {
    if (!_adminOperationsService) {
      _adminOperationsService = AdminOperationsService.getInstance();
    }
    return _adminOperationsService.syncUserWithDatabase(
      clerkUserId,
      name,
      email,
      role,
      managerId,
      imageUrl
    );
  },

  cleanAllPayrollDates: async () => {
    if (!_adminOperationsService) {
      _adminOperationsService = AdminOperationsService.getInstance();
    }
    return _adminOperationsService.cleanAllPayrollDates();
  },

  regeneratePayrollDates: async (
    payrollId: string,
    startDate: string,
    endDate: string
  ) => {
    if (!_adminOperationsService) {
      _adminOperationsService = AdminOperationsService.getInstance();
    }
    return _adminOperationsService.regeneratePayrollDates(
      payrollId,
      startDate,
      endDate
    );
  },
};

// For backwards compatibility, export the old names
export const secureHasuraService = adminOperationsService;
export { AdminOperationsService as SecureHasuraService };