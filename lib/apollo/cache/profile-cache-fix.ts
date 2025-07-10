/**
 * Profile Page Cache Fix
 * 
 * Specific cache policies to handle profile page Apollo cache normalization issues
 */

import type { TypePolicies } from "@apollo/client";

/**
 * Additional type policies specifically for profile page queries
 * These handle the nested relationships that cause cache normalization errors
 */
export const profileCacheTypePolicies: TypePolicies = {
  // Ensure all payroll-related objects are properly normalized
  payrolls: {
    keyFields: ["id"],
    fields: {
      client: {
        // Always merge client data to prevent normalization issues
        merge: (_existing: any, incoming: any) => {
          if (!incoming) return null;
          return {
            __typename: "clients",
            ...incoming,
          };
        }
      },
      employeeCount: {
        merge: (_existing: any, incoming: any) => incoming || 0,
      }
    }
  },
  
  // Ensure client objects always have proper identification
  clients: {
    keyFields: ["id"],
    fields: {
      name: {
        merge: (_existing: any, incoming: any) => incoming || "Unknown Client",
      }
    }
  },
  
  // User work schedules for profile page
  userWorkSchedules: {
    keyFields: ["id"],
    fields: {
      workDay: {
        merge: (_existing: any, incoming: any) => incoming,
      },
      workHours: {
        merge: (_existing: any, incoming: any) => incoming || 0,
      }
    }
  },
  
  // Leave records for profile page
  leave: {
    keyFields: ["id"],
    fields: {
      startDate: {
        merge: (_existing: any, incoming: any) => incoming,
      },
      endDate: {
        merge: (_existing: any, incoming: any) => incoming,
      },
      leaveType: {
        merge: (_existing: any, incoming: any) => incoming || "Unknown",
      },
      status: {
        merge: (_existing: any, incoming: any) => incoming || "pending",
      }
    }
  }
};

/**
 * Safe object access helper for profile data
 * Prevents runtime errors when objects don't have expected properties
 */
export function safeProfileAccess<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current !== undefined ? current : defaultValue;
  } catch (error) {
    console.warn(`Safe access failed for path ${path}:`, error);
    return defaultValue;
  }
}

/**
 * Merge profile type policies with existing policies
 */
export function mergeProfilePolicies(existingPolicies: TypePolicies): TypePolicies {
  return {
    ...existingPolicies,
    ...profileCacheTypePolicies,
    // Merge existing policies with profile-specific ones
    payrolls: {
      ...existingPolicies.payrolls,
      ...profileCacheTypePolicies.payrolls,
      fields: {
        ...existingPolicies.payrolls?.fields,
        ...profileCacheTypePolicies.payrolls?.fields,
      }
    },
    clients: {
      ...existingPolicies.clients,
      ...profileCacheTypePolicies.clients,
      fields: {
        ...existingPolicies.clients?.fields,
        ...profileCacheTypePolicies.clients?.fields,
      }
    }
  };
}