/**
 * Clean API Authentication
 * 
 * Simple authentication wrapper - only checks if user is logged in.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export interface AuthSession {
  userId: string;
  email?: string;
}

/**
 * Simple API authentication wrapper
 */
export function withAuth<T = any>(
  handler: (request: NextRequest, session: AuthSession) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    try {
      const { userId, sessionClaims } = await auth();
      
      if (!userId) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ) as NextResponse<T>;
      }
      
      const session: AuthSession = {
        userId,
        email: sessionClaims?.email as string,
      };
      
      return await handler(request, session);
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      ) as NextResponse<T>;
    }
  };
}

/**
 * API auth with params (for dynamic routes)
 */
export function withAuthParams<T = any>(
  handler: (
    request: NextRequest, 
    context: { params: Promise<any> }, 
    session: AuthSession
  ) => Promise<NextResponse<T>>
) {
  return async (
    request: NextRequest, 
    context: { params: Promise<any> }
  ): Promise<NextResponse<T>> => {
    try {
      const { userId, sessionClaims } = await auth();
      
      if (!userId) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ) as NextResponse<T>;
      }
      
      const session: AuthSession = {
        userId,
        email: sessionClaims?.email as string,
      };
      
      return await handler(request, context, session);
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      ) as NextResponse<T>;
    }
  };
}

// Simple rate limiting for backward compatibility
export function checkRateLimit(userId: string, options: any): boolean {
  return true; // Allow all requests in simplified system
}

// Backward compatibility aliases
export { withAuth as withAdminAuth };
export { withAuth as withManagerAuth };
export { withAuth as withDeveloperAuth };
export { withAuth as withBasicAuth };
export { withAuth as authenticateApiRoute };
export type { AuthSession as AuthenticatedUser };
export type { AuthSession as SimpleSession };