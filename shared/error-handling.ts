import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export function handleApiError(error: unknown, operation: string): NextResponse {
  console.error(`❌ Error ${operation}:`, error);
  
  if (isApiError(error) && error.statusCode) {
    return NextResponse.json({
      error: `Failed to ${operation}`,
      details: error.message
    }, { status: error.statusCode });
  }
  
  return NextResponse.json({
    error: `Failed to ${operation}`,
    details: error instanceof Error ? error.message : "Unknown error"
  }, { status: 500 });
}

export function createSuccessResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message
  });
}

export function createErrorResponse(message: string, statusCode: number = 400) {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: statusCode });
}