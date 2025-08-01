// Test script to check holiday sync errors
const { syncAustralianHolidays } = require('./domains/external-systems/services/holiday-sync-service.ts');

async function testHolidaySync() {
  try {
    console.log('Testing holiday sync...');
    const result = await syncAustralianHolidays(false);
    console.log('Success:', result);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      name: error.name
    });
    
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
    
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
  }
}

testHolidaySync();