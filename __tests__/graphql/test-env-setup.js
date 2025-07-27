/**
 * Test Environment Setup for Comprehensive GraphQL Testing
 * 
 * Sets up the testing environment with necessary configurations
 * and environment variables for comprehensive GraphQL testing.
 */

// Set testing environment variables
process.env.NODE_ENV = 'test';
process.env.GRAPHQL_TESTING = 'true';
process.env.COMPREHENSIVE_TESTING = 'true';

// Ensure test database configuration
if (!process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL) {
  console.warn('⚠️  NEXT_PUBLIC_HASURA_GRAPHQL_URL not set - GraphQL tests may fail');
}

if (!process.env.HASURA_GRAPHQL_ADMIN_SECRET) {
  console.warn('⚠️  HASURA_GRAPHQL_ADMIN_SECRET not set - Admin operations may fail');
}

// Configure test timeouts
const originalSetTimeout = global.setTimeout;
global.setTimeout = (fn, delay) => {
  // Increase timeouts in test environment
  const testDelay = process.env.CI ? delay * 2 : delay;
  return originalSetTimeout(fn, testDelay);
};

// Global test configuration
global.testConfig = {
  timeout: {
    short: 5000,
    medium: 15000,
    long: 30000,
    integration: 60000,
    workflow: 90000
  },
  
  // Test user IDs for consistent testing
  testUsers: {
    developer: '550e8400-e29b-41d4-a716-446655440000',
    org_admin: '550e8400-e29b-41d4-a716-446655440001',
    manager: '550e8400-e29b-41d4-a716-446655440002',
    consultant: '550e8400-e29b-41d4-a716-446655440003',
    viewer: '550e8400-e29b-41d4-a716-446655440004'
  },
  
  // Test entity IDs for consistent testing
  testEntities: {
    clientAlpha: '550e8400-e29b-41d4-a716-446655440100',
    clientBeta: '550e8400-e29b-41d4-a716-446655440101',
    payrollAlpha: '550e8400-e29b-41d4-a716-446655440200',
    payrollBeta: '550e8400-e29b-41d4-a716-446655440201',
    weeklyCycle: '550e8400-e29b-41d4-a716-446655440300',
    fortnightlyCycle: '550e8400-e29b-41d4-a716-446655440301'
  },
  
  // Performance thresholds
  performance: {
    queryMaxTime: 30000,      // 30 seconds
    mutationMaxTime: 15000,   // 15 seconds
    complexQueryMaxTime: 60000, // 1 minute
    maxComplexity: 500,
    maxDepth: 8
  },
  
  // Test flags
  flags: {
    skipSlowTests: process.env.SKIP_SLOW_TESTS === 'true',
    skipPerformanceTests: process.env.SKIP_PERFORMANCE_TESTS === 'true',
    verboseLogging: process.env.VERBOSE_TESTING === 'true'
  }
};

// Configure console logging for tests
if (!global.testConfig.flags.verboseLogging) {
  // Reduce console noise during testing
  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;
  
  console.log = (...args) => {
    // Only log test-related messages
    if (args.some(arg => typeof arg === 'string' && (
      arg.includes('✅') || 
      arg.includes('❌') || 
      arg.includes('⚠️') ||
      arg.includes('🔍') ||
      arg.includes('📊')
    ))) {
      originalConsoleLog(...args);
    }
  };
  
  console.warn = (...args) => {
    // Always show warnings
    originalConsoleWarn(...args);
  };
}

// Graceful error handling for async operations
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process in tests
});

// Memory usage monitoring
if (process.env.MONITOR_MEMORY === 'true') {
  const monitorMemory = () => {
    const usage = process.memoryUsage();
    console.log(`🧠 Memory: ${Math.round(usage.heapUsed / 1024 / 1024)}MB heap, ${Math.round(usage.rss / 1024 / 1024)}MB RSS`);
  };
  
  // Monitor memory every 30 seconds during testing
  setInterval(monitorMemory, 30000);
}

console.log('🧪 GraphQL Test Environment Setup Complete');
console.log(`📊 Test Configuration:`);
console.log(`  - Environment: ${process.env.NODE_ENV}`);
console.log(`  - GraphQL Endpoint: ${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ? '✅' : '❌'}`);
console.log(`  - Admin Secret: ${process.env.HASURA_GRAPHQL_ADMIN_SECRET ? '✅' : '❌'}`);
console.log(`  - Verbose Logging: ${global.testConfig.flags.verboseLogging ? '✅' : '❌'}`);
console.log(`  - Skip Slow Tests: ${global.testConfig.flags.skipSlowTests ? '✅' : '❌'}`);
console.log(`  - Memory Monitoring: ${process.env.MONITOR_MEMORY === 'true' ? '✅' : '❌'}`);