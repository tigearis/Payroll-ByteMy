import { gql } from '@apollo/client';

export const GET_FEATURE_FLAGS = gql`
  query GetFeatureFlags {
    featureFlags {
      featureName
      isEnabled
      allowedRoles
    }
  }
`;

export const GET_FEATURE_FLAG_BY_NAME = gql`
  query GetFeatureFlagByName($featureName: String!) {
    featureFlags(where: { featureName: { _eq: $featureName } }) {
      featureName
      isEnabled
      allowedRoles
    }
  }
`;

export const UPDATE_FEATURE_FLAG = gql`
  mutation UpdateFeatureFlag(
    $id: uuid!
    $isEnabled: Boolean!
    $allowedRoles: jsonb = []
  ) {
    updateFeatureFlagById(
      id: $id
      _set: {
        isEnabled: $isEnabled
        allowedRoles: $allowedRoles
        updatedAt: "now()"
      }
    ) {
      id
      featureName
      isEnabled
      allowedRoles
      updatedAt
    }
  }
`;

export const CREATE_FEATURE_FLAG = gql`
  mutation CreateFeatureFlag(
    $featureName: String!
    $isEnabled: Boolean!
    $allowedRoles: jsonb = []
  ) {
    insertFeatureFlag(
      object: {
        featureName: $featureName
        isEnabled: $isEnabled
        allowedRoles: $allowedRoles
      }
    ) {
      id
      featureName
      isEnabled
      allowedRoles
      updatedAt
    }
  }
`;

export const DELETE_FEATURE_FLAG = gql`
  mutation DeleteFeatureFlag($id: uuid!) {
    deleteFeatureFlagById(id: $id) {
      id
      featureName
    }
  }
`;