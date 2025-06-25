"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActorTokens } from "@/hooks/use-actor-tokens";
import { GetUsersWithFilteringDocument } from "@/domains/users/graphql/generated/graphql";
import { clientApolloClient } from "@/lib/apollo/unified-client";
import { useQuery } from "@apollo/client";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  clerkUserId?: string | null;
}

/**
 * Actor Token Manager Component
 *
 * Provides a UI for developers to create and manage actor tokens for user impersonation.
 * This is useful for testing different user roles and debugging user-specific issues.
 */
export function ActorTokenManager() {
  const { isSignedIn, userId } = useAuth();
  const {
    createActorToken,
    revokeActorToken,
    impersonateUser,
    isLoading,
    error,
    isDevelopment,
    canUseActorTokens,
  } = useActorTokens();

  // Form state
  const [selectedUserId, setSelectedUserId] = useState("");
  const [expiresInMinutes, setExpiresInMinutes] = useState(10);
  const [purpose, setPurpose] = useState("");
  const [activeTokens, setActiveTokens] = useState<any[]>([]);
  const [isLoadingQuickImpersonate, setIsLoading] = useState(false);

  // Fetch users for selection
  const { data: usersData, loading: usersLoading } = useQuery(
    GetUsersWithFilteringDocument,
    {
      client: clientApolloClient,
      variables: {
        limit: 50,
        offset: 0,
      },
      skip: !canUseActorTokens,
    }
  );

  const users = usersData?.users || [];

  // Don't render if not in development or not signed in
  if (!isDevelopment) {
    return (
      <Alert>
        <AlertDescription>
          Actor tokens are only available in development environment.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isSignedIn) {
    return (
      <Alert>
        <AlertDescription>
          You must be signed in to use actor tokens.
        </AlertDescription>
      </Alert>
    );
  }

  const handleCreateToken = async () => {
    if (!selectedUserId) {
      alert("Please select a user to impersonate");
      return;
    }

    const tokenResponse = await createActorToken({
      targetUserId: selectedUserId,
      expiresInSeconds: expiresInMinutes * 60,
      purpose: purpose || "manual_testing",
    });

    if (tokenResponse) {
      // Add to active tokens list
      setActiveTokens(prev => [...prev, tokenResponse.actorToken]);

      // Reset form
      setSelectedUserId("");
      setPurpose("");

      // Show success message with options
      const shouldOpenNow = confirm(
        `Actor token created successfully!\n\nClick OK to open the impersonation URL now, or Cancel to copy the URL to clipboard.`
      );

      if (shouldOpenNow) {
        window.open(tokenResponse.usage.consumeUrl, "_blank");
      } else {
        navigator.clipboard.writeText(tokenResponse.usage.consumeUrl);
        alert("URL copied to clipboard!");
      }
    }
  };

  const handleRevokeToken = async (tokenId: string) => {
    const confirmed = confirm("Are you sure you want to revoke this token?");
    if (!confirmed) return;

    const result = await revokeActorToken(tokenId);
    if (result) {
      // Remove from active tokens list
      setActiveTokens(prev => prev.filter(token => token.id !== tokenId));
    }
  };

  const handleQuickImpersonate = async (user: User) => {
    if (!user.clerkUserId) {
      toast.error("User doesn't have a Clerk ID");
      return;
    }

    const confirmed = confirm(
      `Impersonate ${user.name} (${user.email}) as ${user.role}?\n\nThis will open a new tab where you'll be signed in as this user.`
    );

    if (confirmed) {
      await impersonateUser(
        user.clerkUserId,
        `quick_impersonate_${user.role}`,
        true
      );
    }
  };

  const predefinedPurposes = [
    "manual_testing",
    "ai_testing_permissions",
    "debugging_user_issue",
    "role_testing_consultant",
    "role_testing_manager",
    "role_testing_org_admin",
    "payroll_workflow_testing",
    "client_management_testing",
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎭 Actor Token Manager
            <Badge variant="outline">Development Only</Badge>
          </CardTitle>
          <CardDescription>
            Create actor tokens to impersonate users for testing and debugging
            purposes. Actor tokens allow you to sign in as different users to
            test role-based permissions and user-specific workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-select">Select User to Impersonate</Label>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {usersLoading ? (
                      <SelectItem value="" disabled>
                        Loading users...
                      </SelectItem>
                    ) : (
                      users.map(user => (
                        <SelectItem
                          key={user.id}
                          value={user.clerkUserId || ""}
                        >
                          {user.name} ({user.email}) - {user.role}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expires">Expires In (minutes)</Label>
                <Input
                  id="expires"
                  type="number"
                  min="1"
                  max="60"
                  value={expiresInMinutes}
                  onChange={e => setExpiresInMinutes(Number(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="purpose">Purpose (optional)</Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose or type custom..." />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedPurposes.map(p => (
                      <SelectItem key={p} value={p}>
                        {p.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  className="mt-2"
                  placeholder="Or enter custom purpose..."
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                />
              </div>

              <Button
                onClick={handleCreateToken}
                disabled={!selectedUserId || isLoading}
                className="w-full"
              >
                {isLoading ? "Creating Token..." : "Create Actor Token"}
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Quick Impersonate</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {usersLoading ? (
                  <div>Loading users...</div>
                ) : (
                  users.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickImpersonate(user)}
                        disabled={isLoadingQuickImpersonate}
                      >
                        Impersonate
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeTokens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Tokens</CardTitle>
            <CardDescription>
              Tokens you've created in this session. Remember to revoke them
              when done testing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeTokens.map(token => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {token.target.email} ({token.target.role})
                    </div>
                    <div className="text-sm text-gray-500">
                      Purpose: {token.purpose} | Expires:{" "}
                      {new Date(token.expiresAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(token.url, "_blank")}
                    >
                      Use Token
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRevokeToken(token.id)}
                      disabled={isLoading}
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>
            For programmatic use (AI systems, automated testing, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Create Actor Token</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`POST /api/dev/actor-tokens
Content-Type: application/json

{
  "targetUserId": "user_2a...",
  "expiresInSeconds": 600,
  "purpose": "ai_testing_consultant_role"
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold">Revoke Actor Token</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`POST /api/dev/actor-tokens/{tokenId}/revoke`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold">Using with Playwright/Testing</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`// In your test
const actorToken = await createActorToken('user_2a...', 'test_consultant_permissions');
await page.goto(actorToken.usage.consumeUrl);
// Now you're signed in as that user`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
