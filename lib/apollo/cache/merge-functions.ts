/**
 * Reusable Apollo Client Cache Merge Functions
 * 
 * Collection of merge functions for common caching patterns:
 * - Pagination handling
 * - Real-time updates
 * - Chronological sorting
 * - Version management
 */

/**
 * Creates a pagination-aware merge function
 * Handles offset-based pagination by merging data at correct positions
 */
export function createPaginationMerge() {
  return function merge(existing: any[] = [], incoming: any[], { args }: any) {
    const offset = args?.offset || 0;
    
    // Replace all data on fresh query (offset = 0)
    if (offset === 0) {
      return incoming;
    }
    
    // Merge paginated data at correct offset
    const merged = existing ? existing.slice() : [];
    for (let i = 0; i < incoming.length; ++i) {
      merged[offset + i] = incoming[i];
    }
    return merged;
  };
}

/**
 * Creates a chronological merge function that sorts by creation date
 * Used for notes, comments, and other time-ordered content
 */
export function createChronologicalMerge() {
  return function merge(existing: any[] = [], incoming: any[]) {
    if (!incoming) return existing;
    
    // For new items, merge and deduplicate
    if (existing.length > 0) {
      const existingIds = new Set(existing.map((item: any) => item.id));
      const newItems = incoming.filter((item: any) => !existingIds.has(item.id));
      
      return [...existing, ...newItems].sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    // Fresh data - just sort
    return [...incoming].sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };
}

/**
 * Creates a real-time log merge function for audit trails
 * Handles both query results and subscription updates
 */
export function createRealTimeLogMerge(timeField: string = "eventTime") {
  return function merge(existing: any[] = [], incoming: any[], { args }: any) {
    const offset = args?.offset || 0;
    
    // For subscriptions (single new events), prepend to existing
    if (incoming.length === 1 && existing.length > 0) {
      const newEvent = incoming[0];
      const existingIds = new Set(existing.map((log: any) => log.id));
      
      // Only add if not already present (prevent duplicates)
      if (!existingIds.has(newEvent.id)) {
        return [newEvent, ...existing];
      }
      return existing;
    }
    
    // For queries with pagination
    if (offset > 0) {
      return [...existing, ...incoming];
    }
    
    // For fresh queries (offset = 0), check if data actually changed
    if (existing.length > 0 && incoming.length > 0) {
      const latestExisting = existing[0]?.[timeField];
      const latestIncoming = incoming[0]?.[timeField];
      
      // If the latest event time is the same, no new data
      if (latestExisting === latestIncoming && existing.length === incoming.length) {
        return existing; // No change, keep existing cache
      }
    }
    
    // Replace with incoming data
    return incoming;
  };
}

/**
 * Creates a temporal sort merge function
 * Sorts by a specified date field in ascending order
 */
export function createTemporalSort(dateField: string) {
  return function merge(_existing: any, incoming: any) {
    if (!incoming) return _existing;
    
    return [...incoming].sort((a: any, b: any) => 
      new Date(a[dateField]).getTime() - new Date(b[dateField]).getTime()
    );
  };
}

/**
 * Creates a version sort merge function
 * Sorts by version number in descending order (newest first)
 */
export function createVersionSort() {
  return function merge(_existing: any, incoming: any) {
    if (!incoming) return _existing;
    
    return [...incoming].sort((a: any, b: any) => b.versionNumber - a.versionNumber);
  };
}

/**
 * Simple replace merge - always use incoming data
 * Useful for reference data that should always be fresh
 */
export function createReplaceMerge() {
  return function merge(_existing: any, incoming: any) {
    return incoming;
  };
}

/**
 * Identity merge - preserve existing unless incoming is provided
 * Useful for fields that shouldn't be overwritten accidentally
 */
export function createIdentityMerge() {
  return function merge(existing: any, incoming: any) {
    return incoming !== undefined ? incoming : existing;
  };
}