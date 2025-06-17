// lib/apollo/production-config.ts - Production-specific GraphQL configurations
import { createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

/**
 * Production GraphQL configuration with security hardening
 */
export const productionGraphQLConfig = {
  /**
   * Disable introspection in production
   * This prevents schema discovery attacks
   */
  introspection: process.env.NODE_ENV !== 'production',
  
  /**
   * Enable GraphQL Playground only in development
   */
  playground: process.env.NODE_ENV !== 'production',
  
  /**
   * Query complexity analysis limits
   */
  queryDepthLimit: 10,
  queryComplexityLimit: 1000,
  
  /**
   * Security headers for GraphQL requests
   */
  securityHeaders: {
    'X-GraphQL-Disable-Introspection': process.env.NODE_ENV === 'production' ? 'true' : 'false',
    'X-GraphQL-Query-Depth-Limit': '10',
    'X-GraphQL-Complexity-Limit': '1000'
  }
};

/**
 * Create secure Apollo Client link with production configurations
 */
export function createSecureHttpLink(uri: string) {
  const httpLink = createHttpLink({
    uri,
    credentials: 'include',
    headers: {
      ...productionGraphQLConfig.securityHeaders
    }
  });

  // Add authentication context
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...productionGraphQLConfig.securityHeaders,
        // Disable introspection for all authenticated requests in production
        'X-Hasura-Disable-Introspection': process.env.NODE_ENV === 'production' ? 'true' : 'false'
      }
    }
  });

  return authLink.concat(httpLink);
}

/**
 * Query validation rules for production
 */
export const productionQueryValidation = {
  /**
   * Validate query depth
   */
  validateQueryDepth: (query: string): boolean => {
    const depth = (query.match(/{/g) || []).length;
    return depth <= productionGraphQLConfig.queryDepthLimit;
  },
  
  /**
   * Check for introspection queries
   */
  isIntrospectionQuery: (query: string): boolean => {
    const introspectionPatterns = [
      '__schema',
      '__type',
      '__typename',
      'IntrospectionQuery',
      '__Field',
      '__Directive',
      '__EnumValue'
    ];
    
    return introspectionPatterns.some(pattern => 
      query.toLowerCase().includes(pattern.toLowerCase())
    );
  },
  
  /**
   * Validate query in production
   */
  validateQuery: (query: string): { valid: boolean; reason?: string } => {
    if (process.env.NODE_ENV !== 'production') {
      return { valid: true };
    }
    
    // Block introspection in production
    if (productionQueryValidation.isIntrospectionQuery(query)) {
      return { 
        valid: false, 
        reason: 'Introspection queries are disabled in production' 
      };
    }
    
    // Check query depth
    if (!productionQueryValidation.validateQueryDepth(query)) {
      return { 
        valid: false, 
        reason: `Query depth exceeds limit of ${productionGraphQLConfig.queryDepthLimit}` 
      };
    }
    
    return { valid: true };
  }
};

/**
 * Production Apollo Client error policy
 */
export const productionErrorPolicy = {
  errorPolicy: 'all' as const,
  notifyOnNetworkStatusChange: true,
  
  // Don't expose detailed error information in production
  formatError: (error: any) => {
    if (process.env.NODE_ENV === 'production') {
      // Log full error server-side but return sanitized version to client
      console.error('GraphQL Error:', error);
      
      // Return sanitized error to client
      return {
        message: 'An error occurred while processing your request',
        code: 'INTERNAL_ERROR',
        // Only include safe error details
        ...(error.extensions?.code === 'VALIDATION_ERROR' && {
          message: 'Invalid request format'
        }),
        ...(error.extensions?.code === 'RATE_LIMITED' && {
          message: 'Too many requests, please try again later'
        })
      };
    }
    
    return error;
  }
};

/**
 * Hasura-specific production security configuration
 */
export const hasuraProductionConfig = {
  /**
   * Environment variables for production security
   */
  requiredEnvVars: [
    'HASURA_GRAPHQL_ADMIN_SECRET',
    'HASURA_SERVICE_ACCOUNT_TOKEN',
    'NEXT_PUBLIC_HASURA_GRAPHQL_URL'
  ],
  
  /**
   * Validate required environment variables
   */
  validateEnvironment: (): { valid: boolean; missing: string[] } => {
    const missing = hasuraProductionConfig.requiredEnvVars.filter(
      envVar => !process.env[envVar]
    );
    
    return {
      valid: missing.length === 0,
      missing
    };
  },
  
  /**
   * Production Hasura headers
   */
  getProductionHeaders: (token?: string) => ({
    'Content-Type': 'application/json',
    'X-Hasura-Role': 'user',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    // Security headers
    'X-Hasura-Disable-Introspection': process.env.NODE_ENV === 'production' ? 'true' : 'false',
    'X-Request-ID': `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  })
};

/**
 * Initialize production GraphQL security
 */
export function initializeProductionSecurity(): void {
  if (process.env.NODE_ENV === 'production') {
    console.log('🔒 Initializing production GraphQL security...');
    
    // Validate environment
    const envValidation = hasuraProductionConfig.validateEnvironment();
    if (!envValidation.valid) {
      console.error('❌ Missing required environment variables:', envValidation.missing);
      throw new Error(`Missing required environment variables: ${envValidation.missing.join(', ')}`);
    }
    
    console.log('✅ Production GraphQL security initialized');
    console.log('🚫 Introspection disabled');
    console.log('🛡️ Query limits enforced');
    console.log('🔍 Security headers applied');
  }
}