// Lightweight performance benchmark helper used by various modules

// Minimal shim object to support existing `.startOperation/.endOperation` usages
// This intentionally performs no logging; it just computes durations safely.
type PerformanceRecordOptions = {
  success?: boolean;
  cacheHit?: boolean;
  dataSize?: number;
  metadata?: Record<string, unknown>;
};

function now(): number {
  return typeof performance !== "undefined" && performance.now
    ? performance.now()
    : Date.now();
}

export const performanceBenchmark = {
  startOperation(operationId: string, _label?: string): number {
    // Return a timestamp to be reused by endOperation
    return now();
  },
  endOperation(
    _operationId: string,
    startTime: number,
    _label: string,
    _options?: PerformanceRecordOptions
  ): { durationMs: number } {
    const durationMs = Math.max(0, now() - startTime);
    return { durationMs };
  },
};
