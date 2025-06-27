/**
 * Jest Configuration for GraphQL Tests
 * Priority 3 Technical Debt: GraphQL operation testing setup
 */

module.exports = {
  displayName: 'GraphQL Tests',
  testMatch: ['**/__tests__/graphql/**/*.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Module resolution
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/__tests__/graphql/setup.ts'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'domains/**/graphql/**/*.graphql',
    'shared/graphql/**/*.graphql',
    '!**/*.generated.ts',
    '!**/node_modules/**',
  ],
  
  // Test timeouts
  testTimeout: 10000,
  
  // Globals
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  
  // Transform configuration
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.graphql$': '<rootDir>/__tests__/graphql/graphql-transformer.js',
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'js', 'json', 'graphql'],
  
  // Verbose output for debugging
  verbose: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '__tests__/reports',
        outputName: 'graphql-test-results.xml',
      },
    ],
  ],
};