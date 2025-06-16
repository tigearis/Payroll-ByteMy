import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing authentication...');
    
    const { userId, sessionClaims } = await auth();
    
    console.log('Auth result:', {
      userId: userId?.substring(0, 8) + '...',
      hasSessionClaims: !!sessionClaims
    });
    
    if (!userId) {
      return NextResponse.json({
        error: 'No authenticated user',
        authenticated: false
      }, { status: 401 });
    }
    
    // Extract JWT claims
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    
    console.log('JWT Claims:', hasuraClaims);
    
    return NextResponse.json({
      authenticated: true,
      userId,
      claims: hasuraClaims,
      hasValidClaims: !!(hasuraClaims?.["x-hasura-user-id"] && hasuraClaims?.["x-hasura-role"]),
      debug: {
        role: hasuraClaims?.["x-hasura-role"],
        defaultRole: hasuraClaims?.["x-hasura-default-role"],
        databaseUserId: hasuraClaims?.["x-hasura-user-id"],
        allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"]
      }
    });
    
  } catch (error: any) {
    console.error('❌ Auth test error:', error);
    return NextResponse.json({
      error: 'Auth test failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}