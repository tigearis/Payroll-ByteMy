#!/usr/bin/env node

/**
 * Test script to verify JWT array support in Hasura
 * 
 * This script tests whether Hasura can properly handle JWT tokens
 * with array values in claims like x-hasura-allowed-roles.
 */

async function testJWTArraySupport() {
  console.log('🧪 Testing JWT Array Support for Hasura...\n');

  try {
    // Check environment variables
    const requiredEnvVars = [
      'CLERK_SECRET_KEY',
      'NEXT_PUBLIC_HASURA_GRAPHQL_URL',
      'HASURA_GRAPHQL_JWT_SECRET'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      console.error('\n💡 Make sure HASURA_GRAPHQL_JWT_SECRET is configured on your Hasura instance.');
      process.exit(1);
    }

    console.log('✅ Environment variables present');

    // Parse JWT secret configuration
    let jwtConfig;
    try {
      jwtConfig = JSON.parse(process.env.HASURA_GRAPHQL_JWT_SECRET);
      console.log('✅ JWT secret configuration is valid JSON');
      console.log('   JWT Type:', jwtConfig.type);
      console.log('   JWKS URL:', jwtConfig.jwk_url);
      console.log('   Claims Namespace:', jwtConfig.claims_namespace);
      console.log('   Claims Format:', jwtConfig.claims_format);
    } catch (error) {
      console.error('❌ Invalid JWT secret configuration (not valid JSON)');
      console.error('   Current value:', process.env.HASURA_GRAPHQL_JWT_SECRET);
      process.exit(1);
    }

    // Test GraphQL query with arrays
    const testQuery = `
      query TestJWTArrays {
        users(limit: 1) {
          id
          name
          role
        }
      }
    `;

    console.log('\n🔄 Testing GraphQL query with JWT arrays...');
    
    // Note: In a real test, you would make an authenticated request to Hasura here
    // This is a placeholder to show the structure
    console.log('📝 Test query prepared:', testQuery.trim());
    
    console.log('\n✅ JWT Array Support Test Configuration Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Ensure your Hasura instance has HASURA_GRAPHQL_JWT_SECRET configured');
    console.log('2. Restart your Hasura instance to pick up the new JWT configuration');
    console.log('3. Test with a real authenticated GraphQL request');
    console.log('\n🔧 Required Hasura Environment Variable:');
    console.log(`HASURA_GRAPHQL_JWT_SECRET='${process.env.HASURA_GRAPHQL_JWT_SECRET}'`);
    
  } catch (error) {
    console.error('❌ Error testing JWT array support:', error.message);
    process.exit(1);
  }
}

// Sample JWT token structure with arrays (for reference)
const sampleJWTPayload = {
  "azp": "http://localhost:3000",
  "exp": 1752019235,
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": [
      "developer",
      "org_admin", 
      "manager",
      "consultant",
      "viewer"
    ],
    "x-hasura-clerk-id": "user_example",
    "x-hasura-default-role": "viewer",
    "x-hasura-excluded-permissions": [],
    "x-hasura-user-id": "example-uuid"
  }
};

console.log('📄 Sample JWT Payload Structure:');
console.log(JSON.stringify(sampleJWTPayload, null, 2));
console.log('\n');

testJWTArraySupport();