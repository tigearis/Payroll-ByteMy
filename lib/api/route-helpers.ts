import { NextRequest, NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export function createApiResponse<T>(
  data?: T,
  message?: string,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data, message }, { status });
}

export function createErrorResponse(
  error: string,
  status = 400
): NextResponse<ApiResponse> {
  return NextResponse.json({ error }, { status });
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return createErrorResponse(error.message, 500);
  }
  
  return createErrorResponse('Internal server error', 500);
}

export async function validateRequest(
  request: NextRequest,
  schema?: any
): Promise<{ isValid: boolean; data?: any; error?: string }> {
  try {
    const body = await request.json();
    
    if (schema) {
      const result = schema.safeParse(body);
      if (!result.success) {
        return { 
          isValid: false, 
          error: result.error.issues.map((i: any) => i.message).join(', ') 
        };
      }
      return { isValid: true, data: result.data };
    }
    
    return { isValid: true, data: body };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Invalid JSON body' 
    };
  }
}