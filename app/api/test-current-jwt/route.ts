import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing current JWT after template fix...');
    
    const { userId, sessionClaims, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json({
        error: 'No authenticated user',
        authenticated: false
      }, { status: 401 });
    }
    
    // Get fresh token
    const token = await getToken({ template: "hasura" });
    console.log('Fresh token received:', !!token);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const hasuraClaims = payload["https://hasura.io/jwt/claims"];
        
        console.log('Fresh JWT Claims:', hasuraClaims);
        
        return NextResponse.json({
          authenticated: true,
          userId,
          hasToken: !!token,
          tokenClaims: hasuraClaims,
          hasValidClaims: !!(hasuraClaims?.["x-hasura-user-id"] && hasuraClaims?.["x-hasura-role"]),
          sessionClaims: sessionClaims?.["https://hasura.io/jwt/claims"],
          debug: {
            role: hasuraClaims?.["x-hasura-role"],
            defaultRole: hasuraClaims?.["x-hasura-default-role"],
            databaseUserId: hasuraClaims?.["x-hasura-user-id"],
            allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"]
          }
        });
      } catch (e) {
        return NextResponse.json({
          error: 'Could not parse JWT token',
          hasToken: !!token,
          parseError: e instanceof Error ? e.message : 'Unknown parse error'
        });
      }
    } else {
      return NextResponse.json({
        error: 'No JWT token received',
        authenticated: true,
        userId
      });
    }
    
  } catch (error: any) {
    console.error('❌ JWT test error:', error);
    return NextResponse.json({
      error: 'JWT test failed',
      details: error.message
    }, { status: 500 });
  }
}