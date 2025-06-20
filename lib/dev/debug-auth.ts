// lib/dev/debug-auth.ts - Debug utilities for authentication issues
// import { extractJWTClaims, extractDatabaseUserIdFromJWT, extractUserRoleFromJWT } from "@/lib/auth/soc2-auth";

export async function debugAuthState() {
  try {
    console.log("🔍 Starting auth debug...");
    
    // Check if we can get a token
    const tokenResponse = await fetch("/api/auth/token", {
      credentials: "include",
    });
    
    console.log("🔍 Token response status:", tokenResponse.status);
    
    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();
      const token = tokenData.token;
      
      if (token) {
        // Decode JWT payload using standardized function
        // const payload = extractJWTClaims(token);
        // console.log("🔍 JWT Payload:", payload);
        
        // Extract database user ID using standardized function
        // const userIdFromClaims = extractDatabaseUserIdFromJWT(payload);
        // console.log("🔍 User ID from claims:", userIdFromClaims);
        
        // Extract role using standardized function
        // const roleFromClaims = extractUserRoleFromJWT(payload);
        // console.log("🔍 Role from claims:", roleFromClaims);
        
        console.log("🔍 JWT Token available:", !!token);
        
        // Try to query user directly - commented out due to missing dependencies
        // TODO: Implement proper user query when auth utilities are available
        
      } else {
        console.log("❌ No token in response");
      }
    } else {
      console.log("❌ Token request failed:", await tokenResponse.text());
    }
    
  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
}

// Add to window for easy console access
if (typeof window !== "undefined") {
  (window as any).debugAuth = debugAuthState;
  console.log("🔧 Debug utility loaded. Run 'debugAuth()' in console to debug authentication.");
}