// components/user-sync-fallback.tsx
"use client";

import { AlertTriangle } from "lucide-react";

import { SyncUserButton } from "./sync-user-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserSyncFallbackProps {
  clerkUserId?: string;
}

export function UserSyncFallback({ clerkUserId }: UserSyncFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-yellow-600">User Sync Required</CardTitle>
          <CardDescription>
            Your account needs to be synchronized with our database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-sm text-gray-600">
            <p>
              Your Clerk account is authenticated, but we need to sync your
              profile with our database.
            </p>
            {clerkUserId && (
              <p className="mt-2 font-mono text-xs bg-gray-100 p-2 rounded">
                Clerk ID: {clerkUserId}
              </p>
            )}
          </div>

          <div className="pt-4">
            <SyncUserButton />
          </div>

          <div className="text-xs text-gray-500">
            <p>
              This should happen automatically via webhooks. If you continue to
              see this message, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
