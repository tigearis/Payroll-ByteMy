// Quick script to check user metadata in Clerk
// Run this in your browser console on any page with Clerk loaded

(async () => {
  if (typeof window !== 'undefined' && window.Clerk) {
    try {
      const user = window.Clerk.user;
      const session = window.Clerk.session;
      
      console.log("=== CURRENT USER DEBUG ===");
      console.log("User ID:", user?.id);
      console.log("Email:", user?.emailAddresses?.[0]?.emailAddress);
      
      console.log("\n=== PUBLIC METADATA ===");
      console.log("Full publicMetadata:", user?.publicMetadata);
      console.log("Role:", user?.publicMetadata?.role);
      console.log("Database ID:", user?.publicMetadata?.databaseId);
      console.log("Permissions:", user?.publicMetadata?.permissions);
      
      console.log("\n=== JWT TOKEN CLAIMS ===");
      const token = await session?.getToken({ template: "hasura" });
      console.log("Token exists:", !!token);
      
      if (token) {
        // Decode JWT (unsafe decode for debugging)
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        console.log("JWT Payload:", payload);
        console.log("Hasura Claims:", payload["https://hasura.io/jwt/claims"]);
      } else {
        console.error("❌ No token received!");
      }
      
    } catch (error) {
      console.error("Debug error:", error);
    }
  } else {
    console.error("Clerk not available");
  }
})();