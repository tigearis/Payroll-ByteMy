/**
 * GraphQL Test Setup
 * Priority 3 Technical Debt: GraphQL testing environment setup
 */

import { beforeAll, afterAll } from '@jest/globals';

// Global test configuration
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.GRAPHQL_TESTING = 'true';
  
  // Configure console for test output
  console.log('🧪 GraphQL Test Suite Starting...');
  console.log('📊 Schema validation, performance, and operation testing enabled');
});

afterAll(() => {
  console.log('✅ GraphQL Test Suite Completed');
});

// Global test utilities
global.testUtils = {
  /**
   * Helper to measure query execution time
   */
  measureQueryTime: async (queryFn: () => Promise<any>): Promise<{ result: any; duration: number }> => {
    const start = Date.now();
    const result = await queryFn();
    const duration = Date.now() - start;
    return { result, duration };
  },

  /**
   * Helper to validate GraphQL response structure
   */
  validateResponse: (response: any, expectedShape: any): boolean => {
    const validateShape = (obj: any, shape: any): boolean => {
      if (typeof shape !== 'object' || shape === null) {
        return typeof obj === typeof shape;
      }

      for (const key in shape) {
        if (!(key in obj)) {
          return false;
        }
        if (!validateShape(obj[key], shape[key])) {
          return false;
        }
      }
      return true;
    };

    return validateShape(response, expectedShape);
  },

  /**
   * Helper to generate test data
   */
  generateTestData: {
    user: () => ({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Test User',
      email: 'test@example.com',
      role: 'consultant',
      isActive: true,
    }),
    client: () => ({
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Test Client',
      active: true,
      contactPerson: 'John Doe',
    }),
    payroll: () => ({
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Test Payroll',
      status: 'Active',
      employeeCount: 100,
    }),
  },
};

// Extend Jest matchers for GraphQL testing
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveValidGraphQLStructure(): R;
      toMeetPerformanceThreshold(maxMs: number): R;
      toHaveComplexityScore(maxScore: number): R;
    }
  }
  
  var testUtils: {
    measureQueryTime: (queryFn: () => Promise<any>) => Promise<{ result: any; duration: number }>;
    validateResponse: (response: any, expectedShape: any) => boolean;
    generateTestData: {
      user: () => any;
      client: () => any;
      payroll: () => any;
    };
  };
}

// Custom Jest matchers
expect.extend({
  toHaveValidGraphQLStructure(received) {
    const hasData = received && typeof received.data === 'object';
    const hasNoErrors = !received.errors || received.errors.length === 0;
    
    const pass = hasData && hasNoErrors;
    
    if (pass) {
      return {
        message: () => `Expected GraphQL response to be invalid`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected GraphQL response to be valid but received: ${JSON.stringify(received, null, 2)}`,
        pass: false,
      };
    }
  },

  toMeetPerformanceThreshold(received, maxMs) {
    const duration = typeof received === 'number' ? received : received.duration;
    const pass = duration <= maxMs;
    
    if (pass) {
      return {
        message: () => `Expected ${duration}ms to exceed ${maxMs}ms`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${duration}ms to be less than or equal to ${maxMs}ms`,
        pass: false,
      };
    }
  },

  toHaveComplexityScore(received, maxScore) {
    const score = typeof received === 'number' ? received : received.complexityScore;
    const pass = score <= maxScore;
    
    if (pass) {
      return {
        message: () => `Expected complexity score ${score} to exceed ${maxScore}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected complexity score ${score} to be less than or equal to ${maxScore}`,
        pass: false,
      };
    }
  },
});