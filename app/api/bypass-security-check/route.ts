import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Security bypass check...');
    
    const { userId, sessionClaims, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json({
        error: 'No authenticated user',
        authenticated: false
      }, { status: 401 });
    }
    
    // Get fresh token to check current claims
    const token = await getToken({ template: "hasura" });
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const hasuraClaims = payload["https://hasura.io/jwt/claims"];
        
        const isValidAdmin = hasuraClaims?.["x-hasura-role"] === "developer" && 
                            hasuraClaims?.["x-hasura-user-id"];
        
        return NextResponse.json({
          authenticated: true,
          userId,
          isValidAdmin,
          canBypassSecurity: isValidAdmin,
          claims: hasuraClaims,
          message: isValidAdmin 
            ? "Admin user with valid JWT claims - security bypass allowed"
            : "User does not have valid admin claims"
        });
      } catch (e) {
        return NextResponse.json({
          error: 'Could not parse JWT token',
          canBypassSecurity: false
        });
      }
    }
    
    return NextResponse.json({
      authenticated: true,
      userId,
      canBypassSecurity: false,
      message: "No JWT token available"
    });
    
  } catch (error: any) {
    console.error('❌ Security bypass check error:', error);
    return NextResponse.json({
      error: 'Security bypass check failed',
      canBypassSecurity: false,
      details: error.message
    }, { status: 500 });
  }
}