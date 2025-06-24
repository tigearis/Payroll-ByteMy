// lib/optimistic-updates.ts
import { ApolloCache } from "@apollo/client";
import { gql } from "@apollo/client";

/**
 * Helper functions for working with optimistic updates in Apollo Client
 * 
 * @future-enhancement Currently unused but valuable for improving UX with optimistic updates
 * @usage Ideal for payroll operations, user management, and data mutations that benefit from immediate UI feedback
 * @benefits Provides instant feedback to users before server confirmation
 * @example
 * ```typescript
 * // In a mutation hook:
 * const [updatePayroll] = useMutation(UPDATE_PAYROLL, {
 *   optimisticResponse: (variables) => ({ updatePayroll: { __typename: 'Payroll', ...variables } }),
 *   update: (cache, { data }) => updatePayrollInCache(cache, data.id, data)
 * });
 * ```
 */

/**
 * Updates a payroll entity in the cache
 */
export function updatePayrollInCache(
  cache: ApolloCache<any>,
  payrollId: string,
  data: Partial<any>
) {
  try {
    // Read the existing payroll from the cache
    const cacheId = `payrolls:${payrollId}`;
    const existingPayroll = cache.readFragment({
      id: cacheId,
      fragment: PAYROLL_FIELDS_FRAGMENT,
      fragmentName: "PayrollFields",
    });

    if (!existingPayroll) {
      console.warn(`Payroll with ID ${payrollId} not found in cache`);
      return false;
    }

    // Write the updated payroll back to the cache
    cache.writeFragment({
      id: cacheId,
      fragment: PAYROLL_FIELDS_FRAGMENT,
      fragmentName: "PayrollFields",
      data: {
        ...existingPayroll,
        ...data,
        __typename: "payrolls", // Ensure typename is preserved
      },
    });

    return true;
  } catch (error) {
    console.error(`Error updating payroll ${payrollId} in cache:`, error);
    return false;
  }
}

/**
 * Updates a payroll date in the cache
 */
export function updatePayrollDateInCache(
  cache: ApolloCache<any>,
  payrollDateId: string,
  data: Partial<any>
) {
  try {
    // Similar to updatePayrollInCache but for payroll_dates
    const cacheId = `payroll_dates:${payrollDateId}`;
    const existingDate = cache.readFragment({
      id: cacheId,
      fragment: PAYROLL_DATE_FIELDS_FRAGMENT,
      fragmentName: "PayrollDateFields",
    });

    if (!existingDate) {
      console.warn(`Payroll date with ID ${payrollDateId} not found in cache`);
      return false;
    }

    cache.writeFragment({
      id: cacheId,
      fragment: PAYROLL_DATE_FIELDS_FRAGMENT,
      fragmentName: "PayrollDateFields",
      data: {
        ...existingDate,
        ...data,
        __typename: "payroll_dates",
      },
    });

    return true;
  } catch (error) {
    console.error(
      `Error updating payroll date ${payrollDateId} in cache:`,
      error
    );
    return false;
  }
}

/**
 * Updates the status of a payroll in the cache
 */
export function updatePayrollStatusInCache(
  cache: ApolloCache<any>,
  payrollId: string,
  status: "Active" | "Implementation" | "Inactive"
) {
  return updatePayrollInCache(cache, payrollId, { status });
}

/**
 * Adds a new payroll to the cache
 */
export function addPayrollToCache(
  cache: ApolloCache<any>,
  newPayroll: any,
  queryName = "GET_PAYROLLS"
) {
  try {
    // Read the existing query from the cache
    const existingQuery = cache.readQuery({
      query: PAYROLLS_QUERY,
    }) as { payrolls: any[] } | null;

    if (!existingQuery) {
      console.warn("No payrolls query found in cache");
      return false;
    }

    // Add the new payroll to the list
    cache.writeQuery({
      query: PAYROLLS_QUERY,
      data: {
        ...(existingQuery || {}),
        payrolls: [...existingQuery.payrolls, newPayroll],
      },
    });

    return true;
  } catch (error) {
    console.error("Error adding payroll to cache:", error);
    return false;
  }
}

/**
 * Removes a payroll from the cache
 */
export function removePayrollFromCache(
  cache: ApolloCache<any>,
  payrollId: string
) {
  try {
    // First evict the payroll from the cache
    cache.evict({ id: `payrolls:${payrollId}` });

    // Then garbage collect any dangling references
    cache.gc();

    return true;
  } catch (error) {
    console.error(`Error removing payroll ${payrollId} from cache:`, error);
    return false;
  }
}

// Define fragments for cache operations
const PAYROLL_FIELDS_FRAGMENT = gql`
  fragment PayrollFields on payrolls {
    id
    name
    status
    notes
    cycle_id
    date_type_id
    date_value
    processing_days_before_eft
    updated_at
  }
`;

const PAYROLL_DATE_FIELDS_FRAGMENT = gql`
  fragment PayrollDateFields on payroll_dates {
    id
    payroll_id
    original_eft_date
    adjusted_eft_date
    processing_date
    notes
  }
`;

// Define query for adding to list
const PAYROLLS_QUERY = gql`
  query GetPayrolls {
    payrolls {
      id
      name
      client {
        id
        name
      }
      payroll_cycle {
        id
        name
      }
      status
      updated_at
    }
  }
`;

// Optimistic response generators for common mutations
export const optimisticResponseGenerators = {
  updateUser: (variables: any) => ({
    __typename: "Mutation",
    update_users: {
      __typename: "users_mutation_response",
      affected_rows: 1,
      returning: [
        {
          ...variables._user,
          __typename: "users",
        },
      ],
    },
  }),

  updatePayroll: (variables: any) => ({
    __typename: "Mutation",
    update_payrolls_by_pk: {
      __typename: "payrolls",
      ...variables.input,
      updated_at: new Date().toISOString(),
    },
  }),

  createClient: (variables: any) => ({
    __typename: "Mutation",
    insert_clients_one: {
      __typename: "clients",
      id: crypto.randomUUID(), // Temporary ID that will be replaced
      ...variables.input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  }),

  updateNote: (variables: any) => ({
    __typename: "Mutation",
    update_notes_by_pk: {
      __typename: "notes",
      ...variables.input,
      updated_at: new Date().toISOString(),
    },
  }),

  deletePayrollDate: (variables: any) => ({
    __typename: "Mutation",
    delete_payroll_dates_by_pk: {
      __typename: "payroll_dates",
      id: variables.id,
    },
  }),
};
