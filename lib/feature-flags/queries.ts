// Feature flags GraphQL operations - now using generated types from shared GraphQL files
// All operations moved to shared/graphql/queries.graphql and shared/graphql/mutations.graphql

import {
  GetFeatureFlagsDocument,
  GetFeatureFlagByNameDocument,
  UpdateFeatureFlagDocument,
  CreateFeatureFlagDocument,
  DeleteFeatureFlagDocument
} from "../../shared/types/generated/graphql";

// Re-export generated GraphQL operations and types
export {
  GetFeatureFlagsDocument,
  GetFeatureFlagByNameDocument,
  UpdateFeatureFlagDocument,
  CreateFeatureFlagDocument,
  DeleteFeatureFlagDocument
} from "../../shared/types/generated/graphql";

// Re-export types
export type {
  GetFeatureFlagsQuery,
  GetFeatureFlagByNameQuery,
  GetFeatureFlagByNameQueryVariables,
  UpdateFeatureFlagMutation,
  UpdateFeatureFlagMutationVariables,
  CreateFeatureFlagMutation,
  CreateFeatureFlagMutationVariables,
  DeleteFeatureFlagMutation,
  DeleteFeatureFlagMutationVariables
} from "../../shared/types/generated/graphql";

// Legacy exports for backward compatibility
export const GET_FEATURE_FLAGS = GetFeatureFlagsDocument;
export const GET_FEATURE_FLAG_BY_NAME = GetFeatureFlagByNameDocument;
export const UPDATE_FEATURE_FLAG = UpdateFeatureFlagDocument;
export const CREATE_FEATURE_FLAG = CreateFeatureFlagDocument;
export const DELETE_FEATURE_FLAG = DeleteFeatureFlagDocument;