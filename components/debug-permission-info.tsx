"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuthContext } from "@/lib/auth";

export function DebugPermissionInfo() {
  const { isLoaded: authLoaded, userId, has } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const permissions = useUserRole();
  const authContext = useAuthContext();

  // Test a few key permissions
  const testPermissions = [
    "staff:read",
    "payroll:read", 
    "client:read"
  ];

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2 text-xs">
      <h3 className="font-bold">Permission Debug Info</h3>
      
      <div className="space-y-1">
        <div>Auth Loaded: {authLoaded ? "✅" : "❌"}</div>
        <div>User Loaded: {userLoaded ? "✅" : "❌"}</div>
        <div>User ID: {userId || "None"}</div>
        <div>User Role (metadata): {user?.publicMetadata?.role as string || "None"}</div>
        <div>Database ID: {user?.publicMetadata?.databaseId as string || "None"}</div>
      </div>

      <div className="space-y-1">
        <div>Enhanced Permissions Loaded: {permissions.isLoaded ? "✅" : "❌"}</div>
        <div>Enhanced User Role: {permissions.userRole || "None"}</div>
        <div>Can Access Dashboard: {permissions.canAccessDashboard ? "✅" : "❌"}</div>
      </div>

      <div className="space-y-1">
        <div>Navigation Permissions:</div>
        <div className="ml-2">Dashboard: {permissions.navigation.canAccess.dashboard ? "✅" : "❌"}</div>
        <div className="ml-2">Staff: {permissions.navigation.canAccess.staff ? "✅" : "❌"}</div>
        <div className="ml-2">Payrolls: {permissions.navigation.canAccess.payrolls ? "✅" : "❌"}</div>
        <div className="ml-2">Clients: {permissions.navigation.canAccess.clients ? "✅" : "❌"}</div>
      </div>

      <div className="space-y-1">
        <div>Clerk Permission Tests:</div>
        {testPermissions.map(perm => (
          <div key={perm} className="ml-2">
            {perm}: {has ? (has({ permission: perm as any }) ? "✅" : "❌") : "No has function"}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <div>Auth Context:</div>
        <div className="ml-2">Is Authenticated: {authContext.isAuthenticated ? "✅" : "❌"}</div>
        <div className="ml-2">Is Loading: {authContext.isLoading ? "⏳" : "✅"}</div>
        <div className="ml-2">User Role: {authContext.userRole || "None"}</div>
      </div>
    </div>
  );
}