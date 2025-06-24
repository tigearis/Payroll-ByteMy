/**
 * Apollo Client Type Policies Configuration
 * 
 * Defines how Apollo Client's cache handles different GraphQL types:
 * - Entity identification and normalization
 * - Data merging strategies for queries and subscriptions
 * - Pagination handling
 * - Real-time update optimization
 * - Relationship management
 */

import type { TypePolicies } from "@apollo/client";
import { 
  createPaginationMerge, 
  createChronologicalMerge, 
  createRealTimeLogMerge,
  createTemporalSort,
  createVersionSort
} from "./merge-functions";

/**
 * Query-level field policies for list operations
 */
const queryFieldPolicies = {
  // Users pagination and caching
  users: {
    keyArgs: ["where", "order_by"],
    merge: createPaginationMerge(),
  },
  
  // Clients with optimized caching
  clients: {
    keyArgs: ["where", "order_by"],
    merge: createPaginationMerge(),
  },
  
  // Payrolls with relationship handling
  payrolls: {
    keyArgs: ["where", "order_by"],
    merge: createPaginationMerge(),
  },
  
  // Payroll dates for calendar views
  payrollDates: {
    keyArgs: ["where", "order_by"],
    merge: (_existing: any, incoming: any) => {
      // Always return fresh data for calendar accuracy
      return incoming;
    },
  },
  
  // Notes with chronological ordering
  notes: {
    keyArgs: ["where", "order_by"],
    merge: createChronologicalMerge(),
  },
  
  // Audit logs with smart real-time updates
  auditLogs: {
    keyArgs: ["where", "order_by"],
    merge: createRealTimeLogMerge("eventTime"),
  },
  
  // Data access logs with real-time updates
  dataAccessLogs: {
    keyArgs: ["where", "order_by"],
    merge: createRealTimeLogMerge("accessedAt"),
  },
};

/**
 * Entity-level type policies for individual objects
 */
const entityTypePolicies = {
  // User entities
  users: { 
    keyFields: ["id"],
    fields: {
      userRoles: {
        merge: (_existing: any, incoming: any) => incoming,
      },
      teamMembers: {
        merge: (_existing: any, incoming: any) => incoming,
      },
      workSchedules: {
        merge: (_existing: any, incoming: any) => incoming,
      },
    },
  },
  
  // Client entities
  clients: {
    keyFields: ["id"],
    fields: {
      payrolls: {
        keyArgs: ["where", "order_by"],
        merge: (_existing: any, incoming: any) => incoming,
      },
      notes: {
        merge: createChronologicalMerge(),
      },
    },
  },
  
  // Payroll entities
  payrolls: {
    keyFields: ["id"],
    fields: {
      payrollDates: {
        merge: createTemporalSort("adjustedEftDate"),
      },
      childPayrolls: {
        merge: createVersionSort(),
      },
      notes: {
        merge: createChronologicalMerge(),
      },
    },
  },
  
  // Audit and compliance entities
  auditAuditLog: {
    keyFields: ["id"],
    fields: {
      eventTime: {
        merge: (_existing: any, incoming: any) => incoming,
      },
      metadata: {
        merge: (_existing: any, incoming: any) => incoming,
      },
    },
  },
  
  auditDataAccessLog: {
    keyFields: ["id"],
    fields: {
      accessedAt: {
        merge: (_existing: any, incoming: any) => incoming,
      },
      dataClassification: {
        merge: (_existing: any, incoming: any) => incoming,
      },
    },
  },
  
  auditAuthEvents: {
    keyFields: ["id"],
    fields: {
      eventTime: {
        merge: (_existing: any, incoming: any) => incoming,
      },
    },
  },
  
  permissionAuditLog: {
    keyFields: ["id"],
  },
  
  // Reference data (cached longer)
  payrollCycles: {
    keyFields: ["id"],
  },
  
  payrollDateTypes: {
    keyFields: ["id"],
  },
  
  holidays: {
    keyFields: ["date", "countryCode"],
  },
  
  // Role and permission entities
  roles: {
    keyFields: ["id"],
    fields: {
      rolePermissions: {
        merge: (_existing: any, incoming: any) => incoming,
      },
    },
  },
  
  permissions: {
    keyFields: ["id"],
  },
  
  resources: {
    keyFields: ["id"],
  },
};

/**
 * Complete type policies configuration
 */
export const typePolicies: TypePolicies = {
  Query: {
    fields: queryFieldPolicies,
  },
  ...entityTypePolicies,
};

/**
 * Custom data ID generation for better normalization
 */
export function generateDataId(object: any): string | undefined {
  switch (object.__typename) {
    case "users":
      return `users:${object.id}`;
    case "clients":
      return object.id ? `clients:${object.id}` : undefined;
    case "payrolls":
      return `payrolls:${object.id}`;
    case "payrollDates":
      return `payrollDates:${object.id}`;
    case "notes":
      return `notes:${object.id}`;
    case "auditAuditLog":
      return `auditAuditLog:${object.id}`;
    case "holidays":
      return `holidays:${object.date}:${object.countryCode}`;
    default:
      return object.id ? `${object.__typename}:${object.id}` : undefined;
  }
}