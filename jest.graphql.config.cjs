/**
 * Enhanced Jest Configuration for Comprehensive GraphQL Testing
 * 
 * Supports comprehensive GraphQL testing including:
 * - Operation discovery and validation
 * - Permission boundary testing  
 * - UI integration testing
 * - Performance benchmarking
 * - Data integrity testing
 * - End-to-end workflow testing
 */

module.exports = {
  displayName: 'GraphQL Comprehensive Tests',
  testMatch: ['**/__tests__/graphql/**/*.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/__tests__/graphql/setup.ts'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'domains/**/graphql/**/*.graphql',
    'shared/graphql/**/*.graphql',
    'domains/**/components/**/*.tsx',
    'lib/apollo/**/*.ts',
    'lib/auth/**/*.ts',
    '!**/*.generated.ts',
    '!**/node_modules/**',
    '!**/*.d.ts',
  ],
  
  // Extended test timeouts for comprehensive testing
  testTimeout: 60000, // 60 seconds for complex integration tests
  
  // Globals for test configuration
  globals: {
    // Test environment flags
    GRAPHQL_TESTING: true,
    COMPREHENSIVE_TESTING: true,
  },
  
  // Transform configuration
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
    '^.+\\.tsx$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
    '^.+\\.graphql$': '<rootDir>/__tests__/graphql/graphql-transformer.js',
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'graphql'],
  
  // Enhanced test environment
  setupFiles: ['<rootDir>/__tests__/graphql/test-env-setup.js'],
  
  // Test execution configuration
  maxWorkers: '50%', // Use half of available cores for parallel execution
  
  // Verbose output for debugging
  verbose: true,
  
  // Error handling
  errorOnDeprecated: true,
  bail: false, // Continue running tests even if some fail
  
  // Enhanced reporters for comprehensive testing
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '__tests__/reports',
        outputName: 'graphql-comprehensive-results.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
    [
      'jest-html-reporters',
      {
        publicDir: '__tests__/reports',
        filename: 'graphql-test-report.html',
        expand: true,
      },
    ],
  ],
  
  // Test categorization for selective running
  projects: [
    {
      displayName: 'GraphQL Operations',
      testMatch: ['**/__tests__/graphql/domain-operations.test.ts'],
      testTimeout: 30000,
    },
    {
      displayName: 'Permission Testing',
      testMatch: ['**/__tests__/graphql/permission-boundaries.test.ts'],
      testTimeout: 45000,
    },
    {
      displayName: 'UI Integration',
      testMatch: ['**/__tests__/graphql/ui-integration.test.ts'],
      testTimeout: 30000,
    },
    {
      displayName: 'Performance Testing',
      testMatch: ['**/__tests__/graphql/*performance*.test.ts'],
      testTimeout: 120000, // 2 minutes for performance tests
    },
    {
      displayName: 'Data Integrity',
      testMatch: ['**/__tests__/graphql/data-integrity.test.ts'],
      testTimeout: 45000,
    },
    {
      displayName: 'End-to-End Workflows',
      testMatch: ['**/__tests__/graphql/end-to-end-workflows.test.ts'],
      testTimeout: 90000, // 1.5 minutes for complex workflows
    },
    {
      displayName: 'Schema Validation',
      testMatch: ['**/__tests__/graphql/schema-validation.test.ts'],
      testTimeout: 20000,
    },
  ],
  
  // Cache configuration for faster subsequent runs
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Memory management
  logHeapUsage: true,
  detectOpenHandles: true,
  forceExit: true, // Ensure tests don't hang
  
  // Test result processing
  collectCoverage: process.env.CI === 'true', // Only collect coverage in CI
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageDirectory: '__tests__/coverage',
  
  // Environment variables for testing
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
};