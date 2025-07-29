"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function DebugClerkPage() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const clerk = useClerk();

  useEffect(() => {
    console.log("🔍 Clerk Debug State:", {
      isLoaded,
      isSignedIn,
      userId,
      clerkLoaded: clerk.loaded,
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + "...",
      domain: window.location.hostname,
    });
  }, [isLoaded, isSignedIn, userId, clerk]);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Clerk Debug Page</h1>
      
      <div className="space-y-2 text-sm">
        <div>Is Loaded: {isLoaded ? "✅ Yes" : "❌ No"}</div>
        <div>Is Signed In: {isSignedIn ? "✅ Yes" : "❌ No"}</div>
        <div>User ID: {userId || "None"}</div>
        <div>Clerk Loaded: {clerk.loaded ? "✅ Yes" : "❌ No"}</div>
        <div>Publishable Key: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20)}...</div>
        <div>Current URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Environment Variables:</h2>
        <div className="text-xs bg-gray-100 p-2 rounded">
          <div>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Missing'}</div>
          <div>NEXT_PUBLIC_CLERK_SIGN_IN_URL: {process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}</div>
          <div>NEXT_PUBLIC_CLERK_SIGN_UP_URL: {process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}</div>
        </div>
      </div>
    </div>
  );
}