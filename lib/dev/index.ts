/**
 * Development Utilities Index
 * 
 * Development and debugging utilities - only used in dev mode
 */

export * from './debug-auth';
export * from './middleware';

// Note: These utilities should only be used in development
if (process.env.NODE_ENV === 'production') {
  console.warn('Dev utilities should not be used in production');
}