"use client";

import { useAuth, useUser, useSession } from "@clerk/nextjs";
import { useState } from "react";

/**
 * Authentication Debug Panel
 * 
 * Add this component to any page to debug authentication issues
 * Usage: <AuthDebugPanel />
 */
export function AuthDebugPanel() {
  const { userId, isLoaded, sessionClaims, getToken } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { session } = useSession();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeToken = async () => {
    setLoading(true);
    try {
      const token = await getToken({ template: "hasura", leewayInSeconds: 60 });
      
      if (token) {
        // Decode JWT token to see claims
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        
        setTokenInfo({
          hasToken: true,
          token: token.substring(0, 50) + '...',
          payload,
          hasuraClaims: payload['https://hasura.io/jwt/claims'],
          exp: new Date(payload.exp * 1000).toISOString(),
        });
      } else {
        setTokenInfo({ hasToken: false, error: 'No token available' });
      }
    } catch (error) {
      setTokenInfo({ hasToken: false, error: (error as Error).message });
    }
    setLoading(false);
  };

  const testGraphQLQuery = async () => {
    try {
      const token = await getToken({ template: "hasura", leewayInSeconds: 60 });
      
      const response = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: 'query { usersAggregate { aggregate { count } } }'
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        alert(`GraphQL Error: ${result.errors[0]?.message}`);
      } else {
        alert(`GraphQL Success: ${result.data.usersAggregate.aggregate.count} users`);
      }
    } catch (error) {
      alert(`Test failed: ${(error as Error).message}`);
    }
  };

  if (!isLoaded || !userLoaded) {
    return <div className="p-4 bg-yellow-100 rounded">🔄 Loading authentication...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
      <h3 className="font-bold text-lg mb-2">🔍 Auth Debug Panel</h3>
      
      <div className="space-y-2 text-sm">
        <div><strong>Clerk User ID:</strong> {userId || 'None'}</div>
        <div><strong>Role:</strong> {user?.publicMetadata?.role as string || 'Not set'}</div>
        <div><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</div>
        <div><strong>Session Status:</strong> {session?.status || 'No session'}</div>
        
        <div className="mt-4 space-y-2">
          <button 
            onClick={analyzeToken}
            disabled={loading}
            className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze JWT Token'}
          </button>
          
          <button 
            onClick={testGraphQLQuery}
            className="w-full bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
          >
            Test usersAggregate Query
          </button>
        </div>
        
        {tokenInfo && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <div><strong>Has Token:</strong> {tokenInfo.hasToken ? '✅' : '❌'}</div>
            {tokenInfo.hasToken && (
              <>
                <div><strong>Token:</strong> {tokenInfo.token}</div>
                <div><strong>Expires:</strong> {tokenInfo.exp}</div>
                <div><strong>Hasura Claims:</strong></div>
                <pre className="mt-1 text-xs">
                  {JSON.stringify(tokenInfo.hasuraClaims, null, 2)}
                </pre>
              </>
            )}
            {tokenInfo.error && (
              <div className="text-red-600"><strong>Error:</strong> {tokenInfo.error}</div>
            )}
          </div>
        )}
        
        <div className="mt-4">
          <details className="text-xs">
            <summary className="cursor-pointer font-semibold">Session Claims</summary>
            <pre className="mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(sessionClaims, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}