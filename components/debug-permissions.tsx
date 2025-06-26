"use client";

import { useUser } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/use-user-role";

export function DebugPermissions() {
  const permissions = useUserRole();
  const { user, isLoaded } = useUser();

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded m-2">
      <h3 className="font-bold text-sm mb-2">Debug: Permissions</h3>
      <div className="text-xs space-y-1">
        <div>User Loaded: {isLoaded ? "✅" : "❌"}</div>
        <div>Permissions Loaded: {permissions.isLoaded ? "✅" : "❌"}</div>
        <div>User Role: {permissions.userRole || "None"}</div>
        <div>User ID: {permissions.userId || "None"}</div>
        <div>Can Access Dashboard: {permissions.navigation.canAccess.dashboard ? "✅" : "❌"}</div>
        <div>Can Access Clients: {permissions.navigation.canAccess.clients ? "✅" : "❌"}</div>
        <div>Can Access Staff: {permissions.navigation.canAccess.staff ? "✅" : "❌"}</div>
        <div>Can Access Payrolls: {permissions.navigation.canAccess.payrolls ? "✅" : "❌"}</div>
        <div>Can Access Settings: {permissions.navigation.canAccess.settings ? "✅" : "❌"}</div>
        {user && (
          <div className="mt-2 pt-2 border-t border-yellow-400">
            <div>User Email: {user.primaryEmailAddress?.emailAddress}</div>
            <div>Public Metadata: {JSON.stringify(user.publicMetadata)}</div>
          </div>
        )}
      </div>
    </div>
  );
}