/**
 * Test billing queries to identify null value issues
 * Run with: node scripts/test-billing-queries.js
 */

const { createUnifiedClient } = require('../lib/apollo/unified-client');

async function testBillingQueries() {
  console.log('🔍 Testing billing queries for null value issues...\n');
  
  const client = createUnifiedClient({ context: 'server' });

  // Test queries that might fail
  const queries = [
    {
      name: 'GetServiceCatalog',
      query: `
        query GetServiceCatalog {
          billingPlans(limit: 5) {
            id
            name
            description
            standardRate
            billingUnit
            category
            isActive
            currency
            createdAt
            updatedAt
          }
        }
      `
    },
    {
      name: 'GetClientServiceAgreements (sample)',
      query: `
        query GetClientServiceAgreements {
          clientBillingAssignments(limit: 5) {
            id
            clientId
            billingPlanId
            customRate
            billingFrequency
            effectiveDate
            isEnabled
            isActive
            startDate
            endDate
            assignedBillingPlan {
              id
              name
              description
              standardRate
              billingUnit
              category
              isActive
            }
          }
        }
      `
    },
    {
      name: 'Test specific fields for nulls',
      query: `
        query TestFieldNulls {
          billingPlans(where: {name: {_is_null: true}}) {
            id
            name
          }
          clientBillingAssignments(where: {billingFrequency: {_is_null: true}}) {
            id
            billingFrequency
          }
        }
      `
    }
  ];

  for (const { name, query } of queries) {
    try {
      console.log(`\n📊 Testing: ${name}`);
      console.log('='.repeat(50));
      
      const result = await client.query({
        query: client.gql(query),
        errorPolicy: 'all'
      });

      if (result.errors && result.errors.length > 0) {
        console.log('❌ Errors found:');
        result.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error.message}`);
          if (error.locations) {
            console.log(`      Location: line ${error.locations[0].line}, column ${error.locations[0].column}`);
          }
        });
      } else {
        console.log('✅ Query executed successfully');
      }

      if (result.data) {
        // Check for null values in critical fields
        Object.keys(result.data).forEach(key => {
          const items = result.data[key];
          if (Array.isArray(items)) {
            console.log(`   📈 Found ${items.length} records in ${key}`);
            
            // Check for null values in string fields
            const nullChecks = [
              'name', 'billingUnit', 'category', 'billingFrequency', 
              'effectiveDate', 'startDate'
            ];
            
            items.forEach((item, index) => {
              nullChecks.forEach(field => {
                if (item.hasOwnProperty(field) && item[field] === null) {
                  console.log(`   ⚠️  Record ${index + 1}: ${field} is null`);
                }
              });
              
              // Check nested objects
              if (item.assignedBillingPlan) {
                nullChecks.forEach(field => {
                  if (item.assignedBillingPlan.hasOwnProperty(field) && item.assignedBillingPlan[field] === null) {
                    console.log(`   ⚠️  Record ${index + 1}: assignedBillingPlan.${field} is null`);
                  }
                });
              }
            });
          }
        });
      }

    } catch (error) {
      console.log(`❌ Query failed: ${error.message}`);
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((gqlError, index) => {
          console.log(`   GraphQL Error ${index + 1}: ${gqlError.message}`);
        });
      }
    }
  }

  console.log('\n✨ Testing complete!');
}

// Run the test
testBillingQueries().catch(console.error);