/**
 * 🛡️ PROTECTION SUITE JEST CONFIGURATION
 * 
 * Specialized Jest config for critical component protection tests.
 * Optimized for testing React components during refactoring phases.
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Custom Jest configuration for protection tests
const customJestConfig = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Only run protection tests
  testMatch: [
    '<rootDir>/tests/protection-suites/**/*.test.{js,jsx,ts,tsx}',
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/protection-suites/setup.ts',
  ],
  
  // Module name mapping for absolute imports
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/domains/(.*)$': '<rootDir>/domains/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/shared/(.*)$': '<rootDir>/shared/$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Coverage configuration (focused on protection)
  collectCoverageFrom: [
    'domains/payrolls/components/advanced-payroll-scheduler.tsx',
    'domains/*/components/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: '<rootDir>/coverage/protection',
  
  // Timeout for tests (generous for complex components)
  testTimeout: 30000,
  
  // Globals
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output for protection tests
  verbose: true,
  
  // Fail fast on protection test failures
  bail: 1,
  
  // Error on deprecated features
  errorOnDeprecated: true,
  
  // Max workers for parallel execution
  maxWorkers: '50%',
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/'],
  
  // Transform ignore patterns (allow ES modules)
  transformIgnorePatterns: [
    'node_modules/(?!(date-fns|@apollo/client|graphql-tag)/)',
  ],
  
  // Test results processor
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage/protection',
        filename: 'protection-report.html',
        openReport: false,
        pageTitle: '🛡️ Component Protection Test Results',
      },
    ],
  ],
};

// Create the Jest config
module.exports = createJestConfig(customJestConfig);