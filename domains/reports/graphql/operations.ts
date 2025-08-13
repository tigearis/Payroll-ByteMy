// Re-export generated GraphQL operations from the generated files
// This file now serves as a convenience re-export for backward compatibility
// All actual GraphQL operations are defined in .graphql files and generated via codegen

// Runtime exports (DocumentNodes for Apollo Client)
export {
  GetClientsForDropdownDocument,
  GetPayrollsForDropdownDocument,
  GetStaffForDropdownDocument,
  LogQueryAuditDocument,
} from "./generated/graphql";

// Type exports (for TypeScript typing)
export type {
  GetClientsForDropdownQuery,
  GetPayrollsForDropdownQuery,
  GetStaffForDropdownQuery,
  LogQueryAuditMutation,
  LogQueryAuditMutationVariables
} from "./generated/graphql";

// Note: Report metadata, templates, and job operations were removed as they
// don't correspond to actual Hasura schema tables. If these are needed,
// they should be implemented as custom resolvers or separate API endpoints.
