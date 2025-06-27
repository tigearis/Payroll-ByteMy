/**
 * DataLoader Link - Implements DataLoader pattern for N+1 query prevention
 * 
 * This link batches identical queries made within a short time window
 * to prevent N+1 query problems commonly seen with GraphQL.
 * 
 * Features:
 * - Automatic request batching for identical queries
 * - Configurable batch window (default: 10ms)
 * - Smart cache deduplication
 * - TypeScript support with proper error handling
 */

import { ApolloLink, Observable, Operation, NextLink, FetchResult } from "@apollo/client";
import { print } from "graphql";

interface BatchedRequest {
  operation: Operation;
  forward: NextLink;
  observer: {
    next: (result: FetchResult) => void;
    error: (error: any) => void;
    complete: () => void;
  };
}

interface RequestBatch {
  requests: BatchedRequest[];
  timeoutId: NodeJS.Timeout;
}

/**
 * Configuration for DataLoader Link
 */
export interface DataLoaderLinkOptions {
  /**
   * Time window in milliseconds to batch requests
   * @default 10
   */
  batchWindowMs?: number;
  
  /**
   * Maximum number of requests to batch together
   * @default 50
   */
  maxBatchSize?: number;
  
  /**
   * Whether to enable request deduplication
   * @default true
   */
  enableDeduplication?: boolean;
  
  /**
   * Custom function to determine if requests can be batched
   */
  shouldBatch?: (operation: Operation) => boolean;
}

/**
 * Generate a cache key for an operation
 */
function generateCacheKey(operation: Operation): string {
  const query = print(operation.query);
  const variables = JSON.stringify(operation.variables || {});
  const context = JSON.stringify({
    headers: operation.getContext().headers || {},
    // Only include cacheable context properties
  });
  
  return `${query}:${variables}:${context}`;
}

/**
 * Check if an operation should be batched (only queries by default)
 */
function defaultShouldBatch(operation: Operation): boolean {
  return operation.query.definitions.some(
    def => def.kind === "OperationDefinition" && def.operation === "query"
  );
}

/**
 * DataLoader Link for preventing N+1 queries through intelligent batching
 */
export class DataLoaderLink extends ApolloLink {
  private batches = new Map<string, RequestBatch>();
  private activeRequests = new Map<string, Promise<FetchResult>>();
  private options: Required<DataLoaderLinkOptions>;

  constructor(options: DataLoaderLinkOptions = {}) {
    super();
    
    this.options = {
      batchWindowMs: options.batchWindowMs ?? 10,
      maxBatchSize: options.maxBatchSize ?? 50,
      enableDeduplication: options.enableDeduplication ?? true,
      shouldBatch: options.shouldBatch ?? defaultShouldBatch,
    };
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    // Skip batching for operations that shouldn't be batched
    if (!this.options.shouldBatch(operation)) {
      return forward(operation);
    }

    const cacheKey = generateCacheKey(operation);

    return new Observable(observer => {
      // If deduplication is enabled and we have an active request, reuse it
      if (this.options.enableDeduplication && this.activeRequests.has(cacheKey)) {
        const activeRequest = this.activeRequests.get(cacheKey)!;
        
        activeRequest
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(error => {
            observer.error(error);
          });
        
        return;
      }

      // Create the batched request
      const batchedRequest: BatchedRequest = {
        operation,
        forward,
        observer: {
          next: (result) => observer.next(result),
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        },
      };

      // Add to batch or create new batch
      this.addToBatch(cacheKey, batchedRequest);

      // Return cleanup function
      return () => {
        this.removeFromBatch(cacheKey, batchedRequest);
      };
    });
  }

  private addToBatch(cacheKey: string, request: BatchedRequest): void {
    let batch = this.batches.get(cacheKey);

    if (!batch) {
      // Create new batch
      batch = {
        requests: [],
        timeoutId: setTimeout(() => {
          this.executeBatch(cacheKey);
        }, this.options.batchWindowMs),
      };
      this.batches.set(cacheKey, batch);
    }

    batch.requests.push(request);

    // Execute immediately if batch is full
    if (batch.requests.length >= this.options.maxBatchSize) {
      clearTimeout(batch.timeoutId);
      this.executeBatch(cacheKey);
    }
  }

  private removeFromBatch(cacheKey: string, request: BatchedRequest): void {
    const batch = this.batches.get(cacheKey);
    if (!batch) return;

    const index = batch.requests.indexOf(request);
    if (index > -1) {
      batch.requests.splice(index, 1);
    }

    // Clean up empty batch
    if (batch.requests.length === 0) {
      clearTimeout(batch.timeoutId);
      this.batches.delete(cacheKey);
    }
  }

  private async executeBatch(cacheKey: string): Promise<void> {
    const batch = this.batches.get(cacheKey);
    if (!batch || batch.requests.length === 0) {
      this.batches.delete(cacheKey);
      return;
    }

    // Remove batch from map
    this.batches.delete(cacheKey);

    // Use the first request as the representative
    const firstRequest = batch.requests[0];
    
    try {
      // Create shared promise for all requests
      const resultPromise = new Promise<FetchResult>((resolve, reject) => {
        const observable = firstRequest.forward(firstRequest.operation);
        
        observable.subscribe({
          next: resolve,
          error: reject,
          complete: () => {},
        });
      });

      // Store active request for deduplication
      if (this.options.enableDeduplication) {
        this.activeRequests.set(cacheKey, resultPromise);
      }

      // Execute and share result with all requests
      const result = await resultPromise;

      // Send result to all batched requests
      batch.requests.forEach(request => {
        try {
          request.observer.next(result);
          request.observer.complete();
        } catch (error) {
          request.observer.error(error);
        }
      });

    } catch (error) {
      // Send error to all batched requests
      batch.requests.forEach(request => {
        try {
          request.observer.error(error);
        } catch (e) {
          console.error("Error in DataLoader Link observer:", e);
        }
      });
    } finally {
      // Clean up active request
      if (this.options.enableDeduplication) {
        this.activeRequests.delete(cacheKey);
      }
    }
  }

  /**
   * Clear all pending batches (useful for testing or cleanup)
   */
  public clearBatches(): void {
    this.batches.forEach(batch => {
      clearTimeout(batch.timeoutId);
    });
    this.batches.clear();
    this.activeRequests.clear();
  }
}

/**
 * Create DataLoader Link with default configuration optimized for the payroll system
 */
export function createDataLoaderLink(options?: DataLoaderLinkOptions): DataLoaderLink {
  return new DataLoaderLink({
    batchWindowMs: 10, // Very short window for UI responsiveness
    maxBatchSize: 25,  // Reasonable batch size for our queries
    enableDeduplication: true,
    ...options,
  });
}

/**
 * Create DataLoader Link with aggressive batching for background operations
 */
export function createAggressiveDataLoaderLink(): DataLoaderLink {
  return new DataLoaderLink({
    batchWindowMs: 50,   // Longer window for better batching
    maxBatchSize: 100,   // Larger batches for efficiency
    enableDeduplication: true,
  });
}