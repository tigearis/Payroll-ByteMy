// Direct test of the holiday sync service
import pkg from '@apollo/client';
const { gql } = pkg;

// First test if we can query holidays at all
async function testHolidaysQuery() {
  try {
    console.log('🔍 Testing basic holidays GraphQL query...');
    
    // Dynamic import to handle ES modules
    const { adminApolloClient } = await import('./lib/apollo/unified-client.js');
    
    const { data, errors } = await adminApolloClient.query({
      query: gql`
        query TestBasicHolidays {
          holidays(limit: 1) {
            id
            date
            name
          }
        }
      `,
      fetchPolicy: 'network-only'
    });
    
    if (errors && errors.length > 0) {
      console.error('❌ GraphQL errors:', errors);
      return false;
    }
    
    console.log('✅ Basic holidays query works');
    console.log('Sample data:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Basic query failed:', error.message);
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
    return false;
  }
}

// Test the aggregation query
async function testHolidaysAggregateQuery() {
  try {
    console.log('🔍 Testing holidays aggregate query...');
    
    const { adminApolloClient } = await import('./lib/apollo/unified-client.js');
    
    const { data, errors } = await adminApolloClient.query({
      query: gql`
        query TestHolidaysAggregate {
          holidaysAggregate {
            aggregate {
              count
            }
          }
        }
      `,
      fetchPolicy: 'network-only'
    });
    
    if (errors && errors.length > 0) {
      console.error('❌ Aggregate GraphQL errors:', errors);
      return false;
    }
    
    console.log('✅ Holidays aggregate query works');
    console.log('Count:', data.holidaysAggregate.aggregate.count);
    return true;
    
  } catch (error) {
    console.error('❌ Aggregate query failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting holiday service tests...\n');
  
  const basicTest = await testHolidaysQuery();
  const aggregateTest = await testHolidaysAggregateQuery();
  
  console.log('\n📊 Test Results:');
  console.log('Basic Query:', basicTest ? '✅ PASS' : '❌ FAIL');
  console.log('Aggregate Query:', aggregateTest ? '✅ PASS' : '❌ FAIL');
  
  if (basicTest && aggregateTest) {
    console.log('\n🎉 All GraphQL queries work! Holiday sync should work via the UI.');
    console.log('👉 Open http://localhost:3001/developer and try the sync button');
  } else {
    console.log('\n❌ GraphQL queries are failing. Check Hasura permissions.');
  }
}

runTests();