/**
 * Seed Feature Flags
 * 
 * Creates initial feature flags in the database
 */

const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client/core');
const fetch = require('cross-fetch');

// Create Apollo Client for seeding
const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql',
    fetch,
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET || '',
    },
  }),
  cache: new InMemoryCache(),
});

const CREATE_FEATURE_FLAGS = gql`
  mutation CreateFeatureFlags($featureFlags: [feature_flags_insert_input!]!) {
    insert_feature_flags(objects: $featureFlags) {
      affected_rows
      returning {
        id
        feature_name
        is_enabled
        allowed_roles
      }
    }
  }
`;

const defaultFeatureFlags = [
  // AI Assistant Features (disabled by default for security)
  {
    feature_name: 'ai_assistant',
    is_enabled: false,
    allowed_roles: ['developer', 'org_admin'],
  },
  {
    feature_name: 'ai_data_assistant',
    is_enabled: false,
    allowed_roles: ['developer', 'org_admin'],
  },
  {
    feature_name: 'ai_float',
    is_enabled: false,
    allowed_roles: ['developer', 'org_admin'],
  },
  {
    feature_name: 'ai_debug',
    is_enabled: false,
    allowed_roles: ['developer'],
  },
  {
    feature_name: 'ollama_integration',
    is_enabled: false,
    allowed_roles: ['developer'],
  },

  // Security Features (enabled by default)
  {
    feature_name: 'mfa_enabled',
    is_enabled: true,
    allowed_roles: [], // All users
  },
  {
    feature_name: 'step_up_auth',
    is_enabled: true,
    allowed_roles: [], // All users
  },
  {
    feature_name: 'enhanced_permissions',
    is_enabled: true,
    allowed_roles: [], // All users
  },
  {
    feature_name: 'permission_debug',
    is_enabled: false,
    allowed_roles: ['developer'],
  },
  {
    feature_name: 'audit_logging',
    is_enabled: true,
    allowed_roles: [], // All users
  },
  {
    feature_name: 'session_monitoring',
    is_enabled: true,
    allowed_roles: [], // All users
  },
  {
    feature_name: 'security_reporting',
    is_enabled: true,
    allowed_roles: ['developer', 'org_admin', 'manager'],
  },

  // Developer Tools (dev only)
  {
    feature_name: 'dev_tools',
    is_enabled: process.env.NODE_ENV === 'development',
    allowed_roles: ['developer'],
  },
  {
    feature_name: 'debug_panels',
    is_enabled: process.env.NODE_ENV === 'development',
    allowed_roles: ['developer'],
  },
  {
    feature_name: 'auth_debug',
    is_enabled: process.env.NODE_ENV === 'development',
    allowed_roles: ['developer'],
  },

  // Financial & Billing (enabled by default)
  {
    feature_name: 'billing_access',
    is_enabled: true,
    allowed_roles: ['developer', 'org_admin', 'manager'],
  },
  {
    feature_name: 'financial_reporting',
    is_enabled: true,
    allowed_roles: ['developer', 'org_admin', 'manager'],
  },

  // Tax Calculator (disabled by default in production)
  {
    feature_name: 'tax_calculator',
    is_enabled: process.env.NODE_ENV === 'development',
    allowed_roles: ['developer', 'org_admin', 'manager', 'consultant'],
  },
  {
    feature_name: 'tax_calculator_prod',
    is_enabled: false,
    allowed_roles: ['developer', 'org_admin'],
  },

  // Advanced Features (enabled by default)
  {
    feature_name: 'bulk_operations',
    is_enabled: true,
    allowed_roles: ['developer', 'org_admin', 'manager'],
  },
  {
    feature_name: 'data_export',
    is_enabled: true,
    allowed_roles: ['developer', 'org_admin', 'manager'],
  },
  {
    feature_name: 'user_management',
    is_enabled: true,
    allowed_roles: ['developer', 'org_admin'],
  },
];

async function seedFeatureFlags() {
  try {
    console.log('🌱 Seeding feature flags...');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
    const result = await client.mutate({
      mutation: CREATE_FEATURE_FLAGS,
      variables: {
        featureFlags: defaultFeatureFlags,
      },
    });

    console.log(`✅ Created ${result.data.insert_feature_flags.affected_rows} feature flags`);
    
    // Log the created flags
    result.data.insert_feature_flags.returning.forEach(flag => {
      const rolesText = flag.allowed_roles.length > 0 
        ? `[${flag.allowed_roles.join(', ')}]` 
        : '[All Users]';
      console.log(`  ${flag.feature_name}: ${flag.is_enabled ? '✅' : '❌'} ${rolesText}`);
    });

  } catch (error) {
    console.error('❌ Error seeding feature flags:', error);
    
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
    
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach(err => {
        console.error('GraphQL Error:', err.message);
      });
    }
    
    process.exit(1);
  }
}

// Check if feature flags table exists
async function checkTable() {
  try {
    const INTROSPECTION_QUERY = gql`
      query {
        __schema {
          mutationType {
            fields {
              name
            }
          }
        }
      }
    `;
    
    const result = await client.query({
      query: INTROSPECTION_QUERY,
    });
    
    const hasFeatureFlagMutation = result.data.__schema.mutationType.fields
      .some(field => field.name === 'insert_feature_flags');
    
    if (!hasFeatureFlagMutation) {
      console.error('❌ Feature flags table not found in GraphQL schema');
      console.log('Make sure the feature_flags table exists and is tracked in Hasura');
      process.exit(1);
    }
    
    console.log('✅ Feature flags table found in schema');
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Feature Flags Seeding Script');
  
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL) {
    console.error('❌ NEXT_PUBLIC_HASURA_GRAPHQL_URL not set');
    process.exit(1);
  }
  
  if (!process.env.HASURA_GRAPHQL_ADMIN_SECRET) {
    console.error('❌ HASURA_GRAPHQL_ADMIN_SECRET not set');
    process.exit(1);
  }
  
  await checkTable();
  await seedFeatureFlags();
  
  console.log('🎉 Feature flags seeding complete!');
}

main().catch(console.error);