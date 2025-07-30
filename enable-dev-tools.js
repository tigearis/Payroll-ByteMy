#!/usr/bin/env node

/**
 * Enable Dev Tools Feature Flag
 * This script enables the dev_tools feature flag in the database
 */

const { adminApolloClient } = require('./lib/apollo/unified-client');
const { gql } = require('@apollo/client');

const UPSERT_FEATURE_FLAG = gql`
  mutation UpsertFeatureFlag(
    $featureName: String!
    $isEnabled: Boolean!
    $allowedRoles: jsonb!
  ) {
    insert_feature_flags(
      objects: [{
        feature_name: $featureName
        is_enabled: $isEnabled
        allowed_roles: $allowedRoles
        updated_at: "now()"
      }]
      on_conflict: {
        constraint: feature_flags_feature_name_key
        update_columns: [is_enabled, allowed_roles, updated_at]
      }
    ) {
      returning {
        id
        feature_name
        is_enabled
        allowed_roles
        updated_at
      }
    }
  }
`;

async function enableDevTools() {
  console.log('🔧 Enabling dev_tools feature flag...');
  
  try {
    const result = await adminApolloClient.mutate({
      mutation: UPSERT_FEATURE_FLAG,
      variables: {
        featureName: 'dev_tools',
        isEnabled: true,
        allowedRoles: ['developer'] // Only developers can access
      }
    });

    const featureFlag = result.data.insert_feature_flags.returning[0];
    console.log('✅ Dev tools feature flag enabled successfully!');
    console.log(`   Feature: ${featureFlag.feature_name}`);
    console.log(`   Enabled: ${featureFlag.is_enabled}`);
    console.log(`   Allowed Roles: ${JSON.stringify(featureFlag.allowed_roles)}`);
    console.log(`   Updated: ${featureFlag.updated_at}`);
    
    console.log('\n🎉 You can now access the developer tools at /developer');
    console.log('   The Holiday Sync panel will be available in the "External Systems" section');
    
  } catch (error) {
    console.error('❌ Failed to enable dev tools feature flag:', error);
    console.error('Error details:', error.message);
    
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach((gqlError, index) => {
        console.error(`GraphQL Error ${index + 1}:`, gqlError.message);
      });
    }
    
    process.exit(1);
  }
}

// Run the script
enableDevTools().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});