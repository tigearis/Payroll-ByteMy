export class ReportCacheService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getCachedReport(hash: string): Promise<any | null> {
    const cached = this.cache.get(hash);
    if (!cached) return null;

    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(hash);
      return null;
    }

    return cached.data;
  }

  async cacheReport(hash: string, data: any): Promise<void> {
    this.cache.set(hash, {
      data,
      timestamp: Date.now(),
    });

    // Implement cleanup of old cache entries
    this.cleanup();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [hash, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.CACHE_TTL) {
        this.cache.delete(hash);
      }
    }
  }

  async invalidateCache(hash: string): Promise<void> {
    this.cache.delete(hash);
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
  }
}
