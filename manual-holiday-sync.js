// Manual holiday sync using Node.js directly
// This bypasses the API route and calls the service function directly

console.log('🚀 Starting manual holiday sync...');

// Mock the required modules for the TypeScript service
require('ts-node/register');

// Environment variables should be loaded from .env.local or shell environment
// NEVER hardcode secrets in source files!
if (!process.env.HASURA_GRAPHQL_ADMIN_SECRET) {
  console.error('❌ HASURA_GRAPHQL_ADMIN_SECRET environment variable is required');
  console.log('💡 Make sure to set your environment variables or run: source .env.local');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL) {
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL = 'https://hasura.bytemy.com.au/v1/graphql';
}

async function runSync() {
  try {
    // Import the service
    const { syncAustralianHolidays } = await import('./domains/external-systems/services/holiday-sync-service.ts');
    
    console.log('📅 Calling syncAustralianHolidays with force=true...');
    const result = await syncAustralianHolidays(true);
    
    console.log('✅ Holiday sync completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Holiday sync failed:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

runSync();