// lib/debug-auth.ts - Debug utilities for authentication issues

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
        // Decode JWT payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("🔍 JWT Payload:", payload);
        
        // Check claims
        const claims = payload["https://hasura.io/jwt/claims"] || payload.metadata;
        console.log("🔍 Hasura Claims:", claims);
        
        // Check user ID
        const userIdFromClaims = claims?.["x-hasura-user-id"] || payload.sub;
        console.log("🔍 User ID from claims:", userIdFromClaims);
        
        // Try to query user directly
        if (userIdFromClaims) {
          try {
            const userQuery = `
              query GetDebugUser($userId: uuid!) {
                users_by_pk(id: $userId) {
                  id
                  name
                  email
                  role
                  clerk_user_id
                }
              }
            `;
            
            const graphqlResponse = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                query: userQuery,
                variables: { userId: userIdFromClaims }
              }),
            });
            
            const graphqlData = await graphqlResponse.json();
            console.log("🔍 Direct GraphQL query result:", graphqlData);
            
            if (graphqlData.data?.users_by_pk) {
              console.log("✅ User found in database:", graphqlData.data.users_by_pk);
            } else {
              console.log("❌ User NOT found in database");
              console.log("🔍 GraphQL errors:", graphqlData.errors);
            }
            
          } catch (gqlError) {
            console.error("❌ GraphQL query failed:", gqlError);
          }
        }
        
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