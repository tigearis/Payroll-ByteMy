/** @type {import('jest').Config} */
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Custom Jest configuration
const customJestConfig = {
  // Use our test-specific TypeScript configuration
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  displayName: 'Payroll Matrix Test Suite',
  
  // Use jsdom test environment for React component testing
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  setupFiles: ['<rootDir>/tests/env.setup.ts'],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.{ts,tsx,js,jsx}',
    '<rootDir>/domains/**/tests/**/*.test.{ts,tsx,js,jsx}',
    '<rootDir>/components/**/__tests__/**/*.test.{ts,tsx,js,jsx}',
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
    '<rootDir>/tests/baseline/',
  ],
  
  // Module name mapping for aliases
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    
    // Handle CSS imports (import from CSS/SCSS/SASS files)
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
    
    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|ico|bmp|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'domains/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/tests/**',
    '!**/__tests__/**',
    '!**/generated/**',
    '!**/*.config.{js,ts}',
    '!**/*.stories.{ts,tsx}',
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  
  // Reporters
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: '<rootDir>/coverage/html-report',
        filename: 'report.html',
        expand: true,
        pageTitle: 'Payroll Matrix Test Results',
      },
    ],
  ],
  
  // Note: Removed projects configuration temporarily to simplify setup
  // Will re-add organized projects once basic testing is working
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);