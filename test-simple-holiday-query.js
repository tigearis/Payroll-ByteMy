// Simple test to check if holidays GraphQL query works
import { gql } from '@apollo/client';
import { adminApolloClient } from './lib/apollo/unified-client.js';

async function testSimpleQuery() {
  try {
    console.log('Testing simple holidays query...');
    
    const { data, errors } = await adminApolloClient.query({
      query: gql`
        query TestHolidays {
          holidays(limit: 1) {
            id
            date
            name
            countryCode
          }
        }
      `,
      fetchPolicy: 'network-only'
    });
    
    console.log('✅ Query succeeded');
    console.log('Data:', data);
    
    if (errors) {
      console.log('Errors:', errors);
    }
    
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
    
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
  }
}

testSimpleQuery();