/**
 * Apollo Client Query Optimization Utilities
 *
 * Provides utilities for eliminating query waterfalls and optimizing GraphQL performance
 */

import { DocumentNode, OperationVariables } from '@apollo/client';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export interface OptimizedQueryConfig<TData = any, TVariables = OperationVariables> {
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
  fetchPolicy?: 'cache-first' | 'cache-only' | 'network-only' | 'no-cache' | 'cache-and-network';
  errorPolicy?: 'none' | 'ignore' | 'all';
  notifyOnNetworkStatusChange?: boolean;
  skip?: boolean;
  dependsOn?: string[]; // Other query keys this depends on
  priority?: 'high' | 'medium' | 'low';
}

export interface QueryBatchConfig {
  queries: OptimizedQueryConfig[];
  maxConcurrent?: number;
  timeoutMs?: number;
  fallbackToSequential?: boolean;
}

/**
 * Query optimization utility for eliminating waterfalls
 */
export class QueryOptimizer {
  private static readonly DEFAULT_MAX_CONCURRENT = 6;
  private static readonly DEFAULT_TIMEOUT = 10000;

  /**
   * Execute multiple queries in parallel with dependency resolution
   */
  static async executeParallelQueries(
    apolloClient: any,
    config: QueryBatchConfig
  ): Promise<{ results: any[]; errors: any[] }> {
    const {
      queries,
      maxConcurrent = this.DEFAULT_MAX_CONCURRENT,
      timeoutMs = this.DEFAULT_TIMEOUT,
      fallbackToSequential = true
    } = config;

    const results: any[] = [];
    const errors: any[] = [];

    try {
      // Group queries by dependencies
      const { independent, dependent } = this.groupQueriesByDependencies(queries);

      // Execute independent queries first in parallel
      if (independent.length > 0) {
        const independentResults = await this.executeBatch(
          apolloClient,
          independent,
          maxConcurrent,
          timeoutMs
        );
        results.push(...independentResults.results);
        errors.push(...independentResults.errors);
      }

      // Execute dependent queries in dependency order
      if (dependent.length > 0) {
        const dependentResults = await this.executeWithDependencies(
          apolloClient,
          dependent,
          maxConcurrent,
          timeoutMs
        );
        results.push(...dependentResults.results);
        errors.push(...dependentResults.errors);
      }

      return { results, errors };
    } catch (error) {
      if (fallbackToSequential) {
        console.warn('Parallel execution failed, falling back to sequential:', error);
        return this.executeSequential(apolloClient, queries);
      }
      throw error;
    }
  }

  /**
   * Group queries by their dependencies
   */
  private static groupQueriesByDependencies(queries: OptimizedQueryConfig[]) {
    const independent: OptimizedQueryConfig[] = [];
    const dependent: OptimizedQueryConfig[] = [];

    for (const query of queries) {
      if (!query.dependsOn || query.dependsOn.length === 0) {
        independent.push(query);
      } else {
        dependent.push(query);
      }
    }

    return { independent, dependent };
  }

  /**
   * Execute a batch of queries with concurrency control
   */
  private static async executeBatch(
    apolloClient: any,
    queries: OptimizedQueryConfig[],
    maxConcurrent: number,
    timeoutMs: number
  ): Promise<{ results: any[]; errors: any[] }> {
    const results: any[] = [];
    const errors: any[] = [];

    // Sort by priority (high > medium > low)
    const sortedQueries = [...queries].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
    });

    // Execute in batches
    for (let i = 0; i < sortedQueries.length; i += maxConcurrent) {
      const batch = sortedQueries.slice(i, i + maxConcurrent);
      
      const batchPromises = batch.map(async (queryConfig, index) => {
        try {
          if (queryConfig.skip) {
            return { data: null, skipped: true };
          }

          const startTime = Date.now();
          const result = await Promise.race([
            apolloClient.query({
              query: queryConfig.query,
              variables: queryConfig.variables,
              fetchPolicy: queryConfig.fetchPolicy || 'cache-first',
              errorPolicy: queryConfig.errorPolicy || 'all',
              notifyOnNetworkStatusChange: queryConfig.notifyOnNetworkStatusChange || false,
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
            )
          ]);

          const duration = Date.now() - startTime;
          
          // Log slow queries for monitoring
          if (duration > 3000) {
            console.warn(`Slow query detected (${duration}ms):`, {
              query: queryConfig.query.definitions[0],
              variables: queryConfig.variables,
              duration
            });
          }

          return result;
        } catch (error) {
          console.error('Query execution error:', error);
          return { error, queryConfig };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (result.value.error) {
            errors.push(result.value.error);
          } else {
            results.push(result.value);
          }
        } else {
          errors.push(result.reason);
        }
      });
    }

    return { results, errors };
  }

  /**
   * Execute queries with dependency resolution
   */
  private static async executeWithDependencies(
    apolloClient: any,
    queries: OptimizedQueryConfig[],
    maxConcurrent: number,
    timeoutMs: number
  ): Promise<{ results: any[]; errors: any[] }> {
    const results: any[] = [];
    const errors: any[] = [];
    const completed = new Set<string>();

    // Simple dependency resolution - execute in order for now
    // TODO: Implement proper topological sort for complex dependencies
    for (const query of queries) {
      try {
        const result = await apolloClient.query({
          query: query.query,
          variables: query.variables,
          fetchPolicy: query.fetchPolicy || 'cache-first',
          errorPolicy: query.errorPolicy || 'all',
        });
        
        results.push(result);
        completed.add(query.query.definitions[0]?.name?.value || 'unknown');
      } catch (error) {
        errors.push(error);
      }
    }

    return { results, errors };
  }

  /**
   * Fallback sequential execution
   */
  private static async executeSequential(
    apolloClient: any,
    queries: OptimizedQueryConfig[]
  ): Promise<{ results: any[]; errors: any[] }> {
    const results: any[] = [];
    const errors: any[] = [];

    for (const query of queries) {
      try {
        if (query.skip) {
          results.push({ data: null, skipped: true });
          continue;
        }

        const result = await apolloClient.query({
          query: query.query,
          variables: query.variables,
          fetchPolicy: query.fetchPolicy || 'cache-first',
          errorPolicy: query.errorPolicy || 'all',
        });
        
        results.push(result);
      } catch (error) {
        errors.push(error);
      }
    }

    return { results, errors };
  }

  /**
   * Create optimized query configuration for detail pages
   */
  static createDetailPageQueries<T extends Record<string, any>>(
    queries: T,
    variables: Record<keyof T, any>,
    options?: {
      prioritizeMain?: keyof T;
      timeoutMs?: number;
      maxConcurrent?: number;
    }
  ): QueryBatchConfig {
    const optimizedQueries: OptimizedQueryConfig[] = [];

    for (const [key, query] of Object.entries(queries)) {
      optimizedQueries.push({
        query,
        variables: variables[key as keyof T],
        priority: key === options?.prioritizeMain ? 'high' : 'medium',
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      });
    }

    return {
      queries: optimizedQueries,
      maxConcurrent: options?.maxConcurrent || this.DEFAULT_MAX_CONCURRENT,
      timeoutMs: options?.timeoutMs || this.DEFAULT_TIMEOUT,
      fallbackToSequential: true,
    };
  }

  /**
   * Performance monitoring utility
   */
  static monitorQueryPerformance() {
    const performanceData = {
      slowQueries: [] as any[],
      averageQueryTime: 0,
      totalQueries: 0,
      failedQueries: 0,
    };

    return {
      logQuery: (queryName: string, duration: number, success: boolean) => {
        performanceData.totalQueries++;
        performanceData.averageQueryTime = 
          (performanceData.averageQueryTime * (performanceData.totalQueries - 1) + duration) / 
          performanceData.totalQueries;

        if (!success) {
          performanceData.failedQueries++;
        }

        if (duration > 2000) {
          performanceData.slowQueries.push({
            queryName,
            duration,
            timestamp: new Date(),
            success,
          });
        }
      },
      getStats: () => ({ ...performanceData }),
      getSlowQueries: () => performanceData.slowQueries,
    };
  }
}

/**
 * React hook for optimized parallel queries
 */
export function useOptimizedQueries(
  apolloClient: any,
  config: QueryBatchConfig,
  dependencies: any[] = []
) {
  const [state, setState] = React.useState({
    loading: true,
    data: null as any,
    errors: [] as any[],
  });

  React.useEffect(() => {
    let cancelled = false;

    const executeQueries = async () => {
      setState(prev => ({ ...prev, loading: true }));

      try {
        const { results, errors } = await QueryOptimizer.executeParallelQueries(
          apolloClient,
          config
        );

        if (!cancelled) {
          setState({
            loading: false,
            data: results,
            errors,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            loading: false,
            data: null,
            errors: [error],
          });
        }
      }
    };

    executeQueries();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return state;
}

// Re-export React for the hook
import React from 'react';