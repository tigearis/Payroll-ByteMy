/**
 * 🌍 TEST ENVIRONMENT SETUP
 * 
 * Sets up environment variables and configuration for testing
 */

// Essential environment variables for tests
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_APP_ENV = 'test';

// Mock authentication secrets
process.env.CLERK_SECRET_KEY = 'test-clerk-secret';
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test-clerk-publishable';

// Mock database configuration
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Mock Hasura configuration
process.env.HASURA_ADMIN_SECRET = 'test-admin-secret';
process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL = 'http://localhost:8080/v1/graphql';

// Mock external service APIs
process.env.RESEND_API_KEY = 'test-resend-key';
process.env.UPSTASH_REDIS_URL = 'test-redis-url';
process.env.UPSTASH_REDIS_TOKEN = 'test-redis-token';

// Mock storage configuration
process.env.MINIO_ENDPOINT = 'localhost';
process.env.MINIO_PORT = '9000';
process.env.MINIO_ACCESS_KEY = 'test-access-key';
process.env.MINIO_SECRET_KEY = 'test-secret-key';
process.env.MINIO_BUCKET_NAME = 'test-bucket';

// Mock JWT configuration  
process.env.JWT_SECRET = 'test-jwt-secret';

// Suppress console warnings in tests unless explicitly testing them
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (process.env.JEST_VERBOSE === 'true') {
    originalWarn(...args);
  }
};

export {};