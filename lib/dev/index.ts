/**
 * Development Utilities Index
 *
 * Comprehensive development and debugging toolkit
 * Accessible in production for authorized developers
 */

// Export all test components
export * from './test-components';

// Export all examples
export * from './examples';

// Export unified dashboard
export { UnifiedDevDashboard } from './dev-dashboard';

// Development toolkit for programmatic access
export const DevTools = {
  authentication: {
    name: 'JWT Test Panel',
    description: 'Complete JWT and authentication testing dashboard',
    component: 'JWTTestPanel'
  },
  websocket: {
    name: 'WebSocket Testing',
    description: 'Hasura WebSocket connectivity and real-time testing',
    component: 'HasuraWebSocketTest'
  },
  directWebSocket: {
    name: 'Direct WebSocket',
    description: 'Low-level WebSocket debugging and protocol testing',
    component: 'DirectWebSocketTest'
  },
  subscriptions: {
    name: 'Apollo Subscriptions',
    description: 'GraphQL subscriptions through Apollo Client testing',
    component: 'SubscriptionTest'
  },
  examples: {
    name: 'Reference Examples',
    description: 'Error handling patterns and best practices',
    components: ['EnhancedUsersList', 'GracefulClientsList']
  }
};

// Development categories for UI organization
export const DevCategories = {
  critical: ['authentication', 'websocket'],
  debugging: ['directWebSocket', 'subscriptions'],
  reference: ['examples']
} as const;
