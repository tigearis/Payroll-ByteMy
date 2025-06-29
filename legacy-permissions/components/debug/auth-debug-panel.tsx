"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { extractJWTClaims } from "@/lib/auth/client-token-utils";
import { DeveloperOnly } from "@/components/auth/developer-only";

/**
 * Temporary debugging component to help diagnose authentication issues
 * Add this to your layout temporarily to see what's happening
 */
function AuthDebugPanelInner() {
  const { userId, isLoaded, sessionClaims, isSignedIn } = useAuth();
  const { user } = useUser();
  const { currentUser, loading, error, databaseUserId } = useCurrentUser();

  // Use centralized client-side token utilities
  const claimsResult = extractJWTClaims(sessionClaims);
  const { claims: hasuraClaims, role: extractedRole, userId: extractedUserId, hasCompleteData, error: claimsError } = claimsResult;

  if (!isSignedIn) {
    return null; // Don't show debug panel if not signed in
  }

  return (
    <div className="fixed top-0 right-0 bg-red-100 border border-red-300 p-4 m-4 rounded max-w-md text-xs z-50">
      <h3 className="font-bold text-red-800 mb-2">🔍 Auth Debug Panel</h3>

      <div className="space-y-2">
        <div>
          <strong>Clerk Auth:</strong>
          <ul className="ml-2">
            <li>✅ Signed In: {isSignedIn ? "Yes" : "No"}</li>
            <li>✅ Loaded: {isLoaded ? "Yes" : "No"}</li>
            <li>✅ User ID: {userId || "None"}</li>
            <li>✅ Email: {user?.emailAddresses[0]?.emailAddress || "None"}</li>
          </ul>
        </div>

        <div>
          <strong>JWT Claims (Enhanced):</strong>
          <ul className="ml-2">
            <li>Has Session Claims: {sessionClaims ? "✅" : "❌"}</li>
            <li>Has Hasura Claims: {hasuraClaims ? "✅" : "❌"}</li>
            <li>Extracted Role: {extractedRole || "❌ None"}</li>
            <li>Extracted DB ID: {extractedUserId || "❌ None"}</li>
            <li>Complete Data: {hasCompleteData ? "✅" : "❌"}</li>
            <li>Claims Error: {claimsError || "None"}</li>
            <li>Expected DB ID: d9ac8a7b-f679-49a1-8c99-837eb977578b</li>
            <li>
              IDs Match:{" "}
              {extractedUserId === "d9ac8a7b-f679-49a1-8c99-837eb977578b"
                ? "✅"
                : "❌"}
            </li>
          </ul>
        </div>

        <div>
          <strong>Database User:</strong>
          <ul className="ml-2">
            <li>Loading: {loading ? "Yes" : "No"}</li>
            <li>Error: {error ? "❌ Yes" : "✅ No"}</li>
            <li>User Found: {currentUser ? "✅ Yes" : "❌ No"}</li>
            <li>DB User ID: {currentUser?.id || "None"}</li>
            <li>Role: {currentUser?.role || "None"}</li>
          </ul>
        </div>

        <div>
          <strong>Debug Info:</strong>
          <ul className="ml-2">
            <li>Hook DB ID: {databaseUserId || "None"}</li>
            <li>
              JWT Default Role:{" "}
              {hasuraClaims?.["x-hasura-default-role"] || "None"}
            </li>
            <li>
              JWT Allowed Roles:{" "}
              {hasuraClaims?.["x-hasura-allowed-roles"]?.join(", ") || "None"}
            </li>
          </ul>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-200 rounded">
            <strong>Error Details:</strong>
            <pre className="text-xs mt-1 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-3 space-y-1">
          <button
            onClick={async () => {
              try {
                const response = await fetch("/api/sync-current-user", {
                  method: "POST",
                });
                const result = await response.json();
                console.log("Sync result:", result);
                if (response.ok) {
                  alert("Sync successful! Refreshing page...");
                  window.location.reload();
                } else {
                  alert(`Sync failed: ${result.error}`);
                }
              } catch (error) {
                console.error("Sync error:", error);
                alert(`Sync error: ${error}`);
              }
            }}
            className="block w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
          >
            🔄 Try Manual Sync
          </button>

          <button
            onClick={() => {
              console.log("Full debug info:", {
                userId,
                user,
                sessionClaims,
                hasuraClaims,
                currentUser,
                error,
                loading,
              });
            }}
            className="block w-full bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
          >
            🖨️ Log Full Debug Info
          </button>
        </div>
      </div>
    </div>
  );
}

export function AuthDebugPanel() {
  return (
    <DeveloperOnly>
      <AuthDebugPanelInner />
    </DeveloperOnly>
  );
}
