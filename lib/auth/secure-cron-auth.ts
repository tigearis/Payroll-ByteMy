/**
 * Minimal cron auth for backward compatibility
 */

import { NextRequest, NextResponse } from "next/server";

export function validateCronAuth(request: NextRequest): boolean {
  // Simple validation - in a real implementation this would be more secure
  return true; // Allow all cron requests for now
}

export function createCronSignature(operation: string): string {
  // Placeholder for cron signature
  return "simplified";
}

export function withSecureCronAuth<T = any>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    // Simplified - just call the handler
    return await handler(request);
  };
}