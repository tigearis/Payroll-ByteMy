import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message
  } as ApiResponse<T>);
}

export function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json({
    success: false,
    error
  } as ApiResponse, { status });
}

export function validationErrorResponse(errors: string[]): NextResponse {
  return NextResponse.json({
    success: false,
    error: 'Validation failed',
    details: errors
  } as ApiResponse, { status: 400 });
}