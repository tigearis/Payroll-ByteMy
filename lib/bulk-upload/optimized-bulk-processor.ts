// lib/bulk-upload/optimized-bulk-processor.ts
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import { billingDashboardBenchmark } from "@/lib/performance/billing-dashboard-benchmark";

// ====================================================================
// OPTIMIZED BULK UPLOAD PROCESSOR
// Eliminates N+1 patterns through pre-fetch and lookup optimization
// Performance: 99% query reduction (3N → 3 queries for N records)
// ====================================================================

export interface BulkProcessorOptions {
  batchSize?: number;
  maxConcurrency?: number;
  enableTransactions?: boolean;
  enableProgressTracking?: boolean;
  enableDetailedLogging?: boolean;
}

export interface BulkProcessingResult<T> {
  success: boolean;
  totalProcessed: number;
  successfullyProcessed: number;
  failed: number;
  processingTimeMs: number;
  errors: Array<{
    index: number;
    error: string;
    data: T;
  }>;
  metadata: {
    batchSize: number;
    totalBatches: number;
    averageItemProcessingTime: number;
    queryOptimizationSavings: {
      originalQueryCount: number;
      optimizedQueryCount: number;
      queryReductionPercentage: number;
    };
  };
}

export interface ReferenceDataMaps {
  clients: Map<string, any>;
  users: Map<string, any>;
  cycles: Map<string, any>;
  dateTypes: Map<string, any>;
  [key: string]: Map<string, any>;
}

/**
 * High-performance bulk processing system that eliminates N+1 patterns
 * Pre-fetches reference data and processes in optimized batches
 */
export class OptimizedBulkProcessor<T> {
  private options: Required<BulkProcessorOptions>;
  private referenceDataMaps: ReferenceDataMaps = {
    clients: new Map(),
    users: new Map(),
    cycles: new Map(),
    dateTypes: new Map()
  };

  constructor(options: BulkProcessorOptions = {}) {
    this.options = {
      batchSize: options.batchSize || 50,
      maxConcurrency: options.maxConcurrency || 5,
      enableTransactions: options.enableTransactions ?? true,
      enableProgressTracking: options.enableProgressTracking ?? true,
      enableDetailedLogging: options.enableDetailedLogging ?? true,
      ...options
    };

    if (this.options.enableDetailedLogging) {
      logger.info('Optimized bulk processor initialized', {
        namespace: 'bulk_processor',
        operation: 'initialize',
        classification: DataClassification.INTERNAL,
        metadata: {
          batchSize: this.options.batchSize,
          maxConcurrency: this.options.maxConcurrency,
          enableTransactions: this.options.enableTransactions,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  /**
   * Process bulk data with optimized pre-fetch strategy
   */
  async processBulkData<TProcessed>(
    data: T[],
    processingFunction: (
      item: T, 
      index: number, 
      referenceMaps: ReferenceDataMaps,
      progressCallback?: (progress: number) => void
    ) => Promise<TProcessed>,
    preFetchConfig: {
      clients?: { apolloClient: any; query: any; variables?: any };
      users?: { apolloClient: any; query: any; variables?: any };
      cycles?: { apolloClient: any; query: any; variables?: any };
      dateTypes?: { apolloClient: any; query: any; variables?: any };
      [key: string]: { apolloClient: any; query: any; variables?: any } | undefined;
    }
  ): Promise<BulkProcessingResult<T>> {
    const processingStart = performance.now();
    const originalQueryCount = data.length * Object.keys(preFetchConfig).length; // N * reference_types
    
    if (this.options.enableDetailedLogging) {
      logger.info('Starting optimized bulk processing', {
        namespace: 'bulk_processor',
        operation: 'start_processing',
        classification: DataClassification.INTERNAL,
        metadata: {
          itemCount: data.length,
          batchSize: this.options.batchSize,
          estimatedOriginalQueries: originalQueryCount,
          optimizedQueries: Object.keys(preFetchConfig).length,
          expectedImprovement: `${Math.round((1 - Object.keys(preFetchConfig).length / originalQueryCount) * 100)}%`,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Step 1: Pre-fetch all reference data (eliminates N+1 pattern)
    await this.preFetchReferenceData(preFetchConfig);

    // Step 2: Process data in optimized batches
    const result = await this.processInBatches(data, processingFunction);

    const processingEnd = performance.now();
    const processingTimeMs = processingEnd - processingStart;

    // Step 3: Calculate optimization metrics
    const optimizedQueryCount = Object.keys(preFetchConfig).length;
    const queryReductionPercentage = Math.round((1 - optimizedQueryCount / originalQueryCount) * 100);

    const finalResult: BulkProcessingResult<T> = {
      ...result,
      processingTimeMs,
      metadata: {
        batchSize: this.options.batchSize,
        totalBatches: Math.ceil(data.length / this.options.batchSize),
        averageItemProcessingTime: data.length > 0 ? processingTimeMs / data.length : 0,
        queryOptimizationSavings: {
          originalQueryCount,
          optimizedQueryCount,
          queryReductionPercentage
        }
      }
    };

    // Step 4: Performance logging and benchmarking
    if (this.options.enableDetailedLogging) {
      logger.info('Optimized bulk processing completed', {
        namespace: 'bulk_processor',
        operation: 'processing_completed',
        classification: DataClassification.INTERNAL,
        metadata: {
          totalProcessed: result.totalProcessed,
          successfullyProcessed: result.successfullyProcessed,
          failed: result.failed,
          processingTimeMs: Math.round(processingTimeMs),
          averageItemTime: Math.round(finalResult.metadata.averageItemProcessingTime),
          queryReductionPercentage,
          originalQueryCount,
          optimizedQueryCount,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Step 5: Record performance benchmark
    billingDashboardBenchmark.endOperation(
      `bulk_processing_${Date.now()}`,
      processingStart,
      'bulk_upload_optimization',
      {
        success: result.success,
        dataSize: data.length,
        metadata: {
          queryReductionPercentage,
          processingTimeMs: Math.round(processingTimeMs),
          successRate: Math.round((result.successfullyProcessed / result.totalProcessed) * 100)
        }
      }
    );

    return finalResult;
  }

  /**
   * Pre-fetch all reference data to eliminate N+1 patterns
   */
  private async preFetchReferenceData(
    preFetchConfig: Record<string, { apolloClient: any; query: any; variables?: any } | undefined>
  ): Promise<void> {
    const preFetchStart = performance.now();
    
    // Execute all reference queries in parallel
    const preFetchPromises = Object.entries(preFetchConfig)
      .filter(([_, config]) => config !== undefined)
      .map(async ([key, config]) => {
        try {
          const startTime = performance.now();
          const response = await config!.apolloClient.query({
            query: config!.query,
            variables: config!.variables || {},
            fetchPolicy: 'network-only' // Ensure fresh data for bulk processing
          });

          const duration = performance.now() - startTime;
          const data = this.extractDataFromResponse(response, key);
          
          // Create lookup map based on data type
          const lookupMap = this.createLookupMap(data, key);
          this.referenceDataMaps[key] = lookupMap;

          if (this.options.enableDetailedLogging) {
            logger.debug('Reference data pre-fetched', {
              namespace: 'bulk_processor',
              operation: 'pre_fetch_reference',
              classification: DataClassification.INTERNAL,
              metadata: {
                referenceType: key,
                recordCount: data.length,
                durationMs: Math.round(duration),
                timestamp: new Date().toISOString()
              }
            });
          }

          return { key, success: true, count: data.length };
        } catch (error) {
          logger.error('Reference data pre-fetch failed', {
            namespace: 'bulk_processor',
            operation: 'pre_fetch_reference',
            classification: DataClassification.INTERNAL,
            error: error instanceof Error ? error.message : 'Unknown error',
            metadata: {
              referenceType: key,
              timestamp: new Date().toISOString()
            }
          });
          
          throw new Error(`Failed to pre-fetch ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });

    const preFetchResults = await Promise.all(preFetchPromises);
    const preFetchDuration = performance.now() - preFetchStart;

    if (this.options.enableDetailedLogging) {
      logger.info('All reference data pre-fetched successfully', {
        namespace: 'bulk_processor',
        operation: 'pre_fetch_completed',
        classification: DataClassification.INTERNAL,
        metadata: {
          referenceTypes: preFetchResults.map(r => r.key),
          totalRecords: preFetchResults.reduce((sum, r) => sum + r.count, 0),
          totalQueries: preFetchResults.length,
          durationMs: Math.round(preFetchDuration),
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  /**
   * Process data in optimized batches with concurrency control
   */
  private async processInBatches<TProcessed>(
    data: T[],
    processingFunction: (
      item: T,
      index: number,
      referenceMaps: ReferenceDataMaps,
      progressCallback?: (progress: number) => void
    ) => Promise<TProcessed>
  ): Promise<Omit<BulkProcessingResult<T>, 'processingTimeMs' | 'metadata'>> {
    const totalItems = data.length;
    let totalProcessed = 0;
    let successfullyProcessed = 0;
    let failed = 0;
    const errors: Array<{ index: number; error: string; data: T }> = [];

    // Create batches
    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += this.options.batchSize) {
      batches.push(data.slice(i, i + this.options.batchSize));
    }

    // Process batches with concurrency control
    let activeBatches = 0;
    let batchIndex = 0;

    const processBatch = async (batch: T[], startIndex: number): Promise<void> => {
      activeBatches++;
      
      try {
        const batchStart = performance.now();
        const batchResults = await Promise.allSettled(
          batch.map(async (item, relativeIndex) => {
            const absoluteIndex = startIndex + relativeIndex;
            
            const progressCallback = this.options.enableProgressTracking 
              ? (progress: number) => {
                  // Progress callback implementation
                  const overallProgress = Math.round(((totalProcessed + progress) / totalItems) * 100);
                  if (overallProgress % 10 === 0) { // Log every 10%
                    logger.debug('Bulk processing progress', {
                      namespace: 'bulk_processor',
                      operation: 'progress_update',
                      classification: DataClassification.INTERNAL,
                      metadata: {
                        progressPercent: overallProgress,
                        itemsProcessed: totalProcessed,
                        totalItems,
                        timestamp: new Date().toISOString()
                      }
                    });
                  }
                }
              : undefined;

            return await processingFunction(item, absoluteIndex, this.referenceDataMaps, progressCallback);
          })
        );

        const batchDuration = performance.now() - batchStart;
        let batchSuccesses = 0;
        let batchFailures = 0;

        batchResults.forEach((result, relativeIndex) => {
          const absoluteIndex = startIndex + relativeIndex;
          totalProcessed++;

          if (result.status === 'fulfilled') {
            successfullyProcessed++;
            batchSuccesses++;
          } else {
            failed++;
            batchFailures++;
            errors.push({
              index: absoluteIndex,
              error: result.reason?.message || 'Unknown processing error',
              data: batch[relativeIndex]
            });
          }
        });

        if (this.options.enableDetailedLogging) {
          logger.debug('Batch processing completed', {
            namespace: 'bulk_processor',
            operation: 'batch_completed',
            classification: DataClassification.INTERNAL,
            metadata: {
              batchIndex: Math.floor(startIndex / this.options.batchSize),
              batchSize: batch.length,
              successes: batchSuccesses,
              failures: batchFailures,
              durationMs: Math.round(batchDuration),
              timestamp: new Date().toISOString()
            }
          });
        }
      } finally {
        activeBatches--;
      }
    };

    // Process all batches with concurrency control
    const batchPromises: Promise<void>[] = [];
    
    while (batchIndex < batches.length) {
      if (activeBatches < this.options.maxConcurrency) {
        const batch = batches[batchIndex];
        const startIndex = batchIndex * this.options.batchSize;
        batchPromises.push(processBatch(batch, startIndex));
        batchIndex++;
      } else {
        // Wait for at least one batch to complete before continuing
        await Promise.race(batchPromises.filter(p => p));
      }
    }

    // Wait for all remaining batches to complete
    await Promise.all(batchPromises);

    return {
      success: failed === 0,
      totalProcessed,
      successfullyProcessed,
      failed,
      errors
    };
  }

  /**
   * Extract data array from GraphQL response based on expected structure
   */
  private extractDataFromResponse(response: any, referenceType: string): any[] {
    const dataMapping: Record<string, string> = {
      clients: 'clients',
      users: 'users', 
      cycles: 'payrollCycles',
      dateTypes: 'payrollDateTypes'
    };

    const dataKey = dataMapping[referenceType] || referenceType;
    const data = response.data?.[dataKey];
    
    if (!Array.isArray(data)) {
      logger.warn('Unexpected reference data structure', {
        namespace: 'bulk_processor',
        operation: 'extract_reference_data',
        classification: DataClassification.INTERNAL,
        metadata: {
          referenceType,
          expectedKey: dataKey,
          receivedKeys: Object.keys(response.data || {}),
          timestamp: new Date().toISOString()
        }
      });
      return [];
    }

    return data;
  }

  /**
   * Create optimized lookup maps for O(1) access during processing
   */
  private createLookupMap(data: any[], referenceType: string): Map<string, any> {
    const lookupMap = new Map<string, any>();

    // Create lookup keys based on reference type
    const keyMapping: Record<string, (item: any) => string[]> = {
      clients: (item) => [item.name],
      users: (item) => [item.email],
      cycles: (item) => [item.name],
      dateTypes: (item) => [item.name]
    };

    const getKeys = keyMapping[referenceType] || ((item) => [item.id, item.name].filter(Boolean));

    data.forEach(item => {
      const keys = getKeys(item);
      keys.forEach(key => {
        if (key) {
          lookupMap.set(key, item);
        }
      });
    });

    return lookupMap;
  }

  /**
   * Optimized lookup function for reference data
   */
  lookupReference(referenceType: string, key: string): any | null {
    const map = this.referenceDataMaps[referenceType];
    return map?.get(key) || null;
  }

  /**
   * Get current reference data statistics
   */
  getReferenceDataStats(): Record<string, { count: number; types: string[] }> {
    const stats: Record<string, { count: number; types: string[] }> = {};

    Object.entries(this.referenceDataMaps).forEach(([type, map]) => {
      stats[type] = {
        count: map.size,
        types: Array.from(new Set(Array.from(map.values()).map(item => 
          item.constructor?.name || typeof item
        )))
      };
    });

    return stats;
  }

  /**
   * Clear reference data (for memory management)
   */
  clearReferenceData(): void {
    Object.keys(this.referenceDataMaps).forEach(key => {
      this.referenceDataMaps[key].clear();
    });

    if (this.options.enableDetailedLogging) {
      logger.info('Reference data cleared', {
        namespace: 'bulk_processor',
        operation: 'clear_reference_data',
        classification: DataClassification.INTERNAL,
        metadata: {
          timestamp: new Date().toISOString()
        }
      });
    }
  }
}

/**
 * Factory function for creating optimized bulk processors
 */
export function createOptimizedBulkProcessor<T>(options: BulkProcessorOptions = {}): OptimizedBulkProcessor<T> {
  return new OptimizedBulkProcessor<T>(options);
}

/**
 * Utility function for quick bulk processing with default optimization
 */
export async function processOptimizedBulk<T, TProcessed>(
  data: T[],
  processingFunction: (item: T, index: number, referenceMaps: ReferenceDataMaps) => Promise<TProcessed>,
  preFetchConfig: Record<string, { apolloClient: any; query: any; variables?: any }>,
  options: BulkProcessorOptions = {}
): Promise<BulkProcessingResult<T>> {
  const processor = createOptimizedBulkProcessor<T>(options);
  return await processor.processBulkData(data, processingFunction, preFetchConfig);
}