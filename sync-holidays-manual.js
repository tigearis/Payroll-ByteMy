// Manual holiday sync script
// This runs the holiday sync service directly without requiring the Next.js server

const { syncAustralianHolidays } = require('./domains/external-systems/services/holiday-sync-service.ts');

async function runHolidaySync() {
  try {
    console.log('🚀 Starting manual holiday sync...');
    
    // Force sync to ensure we get fresh data
    const result = await syncAustralianHolidays(true);
    
    console.log('✅ Holiday sync completed!');
    console.log('Results:', JSON.stringify(result, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Holiday sync failed:', error);
    process.exit(1);
  }
}

// Set required environment variables
process.env.HASURA_GRAPHQL_ADMIN_SECRET = '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';
process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL = 'https://hasura.bytemy.com.au/v1/graphql';

runHolidaySync();