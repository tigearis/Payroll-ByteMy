"use client";

import {
  Key,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/lib/auth";

interface APIKey {
  apiKey: string;
  fullKey: string;
  permissions: string[];
}

interface NewKey {
  apiKey: string;
  apiSecret: string;
  permissions: string[];
  warning: string;
}

const AVAILABLE_PERMISSIONS = [
  "payroll:read",
  "payroll:write",
  "payroll:approve",
  "reports:export",
  "staff:write",
  "staff:delete",
  "audit:read",
  "admin:manage",
];

export function APIKeyManager() {
  return (
    <PermissionGuard permission="admin:manage">
      <APIKeyManagerInner />
    </PermissionGuard>
  );
}

function APIKeyManagerInner() {
  const { hasAdminAccess } = useAuthContext();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newKey, setNewKey] = useState<NewKey | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    if (hasAdminAccess) {
      loadAPIKeys();
    }
  }, [hasAdminAccess]);

  const loadAPIKeys = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/api-keys");

      if (!response.ok) {
        throw new Error("Failed to load API keys");
      }

      const data = await response.json();
      setApiKeys(data.keys || []);
    } catch (error) {
      console.error("Error loading API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const createAPIKey = async () => {
    try {
      setIsCreating(true);

      const response = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permissions: selectedPermissions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create API key");
      }

      const data = await response.json();
      setNewKey(data);
      setShowCreateForm(false);
      setSelectedPermissions([]);

      // Reload the keys list
      await loadAPIKeys();

      toast.success("API key created successfully");
    } catch (error) {
      console.error("Error creating API key:", error);
      toast.error("Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  };

  const revokeAPIKey = async (apiKey: string) => {
    if (
      !confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/api-keys?apiKey=${encodeURIComponent(apiKey)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to revoke API key");
      }

      toast.success("API key revoked successfully");
      await loadAPIKeys();
    } catch (error) {
      console.error("Error revoking API key:", error);
      toast.error("Failed to revoke API key");
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  if (!hasAdminAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need admin access to manage API keys.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Key Display */}
      {newKey && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Check className="h-5 w-5" />
              API Key Created Successfully
            </CardTitle>
            <CardDescription className="text-green-700">
              {newKey.warning}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new-api-key">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="new-api-key"
                  value={newKey.apiKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(newKey.apiKey, "API Key")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="new-api-secret">API Secret</Label>
              <div className="flex gap-2">
                <Input
                  id="new-api-secret"
                  type={showSecret ? "text" : "password"}
                  value={newKey.apiSecret}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(newKey.apiSecret, "API Secret")
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Permissions</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {newKey.permissions.map(permission => (
                  <Badge key={permission} variant="default">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setNewKey(null)}
              className="w-full"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage API keys for signed requests to sensitive endpoints
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No API keys found. Create one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {key.apiKey}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(key.fullKey, "API Key")
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {key.permissions.map(permission => (
                          <Badge
                            key={permission}
                            variant="secondary"
                            className="text-xs"
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => revokeAPIKey(key.fullKey)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create API Key Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
            <CardDescription>
              Select permissions for the new API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {AVAILABLE_PERMISSIONS.map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={permission} className="text-sm">
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={createAPIKey}
                disabled={isCreating || selectedPermissions.length === 0}
                className="flex items-center gap-2"
              >
                {isCreating ? "Creating..." : "Create API Key"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setSelectedPermissions([]);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Making Signed Requests</h4>
            <Textarea
              readOnly
              value={`// Example: Node.js/JavaScript
import { SignedAPIClient } from '@/lib/security/api-signing';

const client = new SignedAPIClient(apiKey, apiSecret);
const response = await client.post('/api/signed/payroll-operations', {
  operation: 'process_batch',
  payload: {
    payrollIds: ['uuid1', 'uuid2'],
    processedBy: 'user123'
  }
});`}
              rows={8}
              className="font-mono text-xs"
            />
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> API secrets should be stored
              securely and never exposed in client-side code. Use environment
              variables or secure secret management systems.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

export default APIKeyManager;
