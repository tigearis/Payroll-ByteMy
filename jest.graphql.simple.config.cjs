/**
 * Simple Jest Configuration for GraphQL Testing
 */

module.exports = {
  displayName: 'GraphQL Tests',
  testMatch: ['**/__tests__/graphql/**/*.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/__tests__/graphql/setup.ts'],
  
  // Transform configuration
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        target: 'es2020',
        module: 'commonjs',
        lib: ['es2020'],
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        skipLibCheck: true,
        strict: false,
        exactOptionalPropertyTypes: false,
        strictNullChecks: false,
      },
    }],
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
};