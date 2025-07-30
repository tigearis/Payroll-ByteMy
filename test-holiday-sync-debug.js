#!/usr/bin/env node

// Test script to debug holiday sync issues
const { syncAustralianHolidays } = require('./domains/external-systems/services/holiday-sync-service.ts');

async function testHolidaySync() {
  try {
    console.log('🧪 Testing holiday sync with force=true...');
    
    const result = await syncAustralianHolidays(true);
    
    console.log('✅ Holiday sync test completed successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Holiday sync test failed:');
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Check if it's a GraphQL error
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', JSON.stringify(error.graphQLErrors, null, 2));
    }
    
    // Check if it's a network error
    if (error.networkError) {
      console.error('Network Error:', JSON.stringify(error.networkError, null, 2));
    }
  }
}

// Run the test
testHolidaySync().catch(console.error);