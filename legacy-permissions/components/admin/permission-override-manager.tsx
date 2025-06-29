"use client";

import { useQuery, useMutation } from '@apollo/client';
import { format } from "date-fns";
import { Calendar, Plus, Trash2, Edit, Clock, User, Shield } from "lucide-react";
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  GetUserPermissionOverridesDocument,
  GrantUserPermissionDocument,
  RestrictUserPermissionDocument,
  RemovePermissionOverrideDocument,
  ExtendPermissionExpirationDocument
} from '@/domains/permissions/graphql/generated/graphql';
import { useAuthContext } from '@/lib/auth/enhanced-auth-context';
import { PERMISSION_CATEGORIES, ALL_PERMISSIONS } from '@/lib/auth/permissions';

interface PermissionOverrideManagerProps {
  userId: string;
  userEmail: string;
  userName: string;
}

export function PermissionOverrideManager({ 
  userId, 
  userEmail, 
  userName 
}: PermissionOverrideManagerProps) {
  const { hasPermission, refreshPermissions } = useAuthContext();
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
  const [selectedOverride, setSelectedOverride] = useState<any>(null);

  // Form state
  const [newPermission, setNewPermission] = useState({
    resource: '',
    operation: '',
    granted: true,
    reason: '',
    expiresAt: '',
    conditions: ''
  });

  // GraphQL operations
  const { data, loading, refetch } = useQuery(GetUserPermissionOverridesDocument, {
    variables: { userId },
    errorPolicy: 'all'
  });

  const [grantPermission, { loading: granting }] = useMutation(GrantUserPermissionDocument);
  const [restrictPermission, { loading: restricting }] = useMutation(RestrictUserPermissionDocument);
  const [removeOverride, { loading: removing }] = useMutation(RemovePermissionOverrideDocument);
  const [extendExpiration, { loading: extending }] = useMutation(ExtendPermissionExpirationDocument);

  // Check if user can manage permissions
  const canManage = hasPermission('admin:manage') || hasPermission('staff:write');

  if (!canManage) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            You don't have permission to manage user permissions.
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleGrantPermission = async () => {
    if (!newPermission.resource || !newPermission.operation) return;

    try {
      const variables: any = {
        userId,
        resource: newPermission.resource,
        operation: newPermission.operation,
        reason: newPermission.reason,
      };
      
      if (newPermission.expiresAt) {
        variables.expiresAt = newPermission.expiresAt;
      }
      
      if (newPermission.conditions) {
        variables.conditions = JSON.parse(newPermission.conditions);
      }

      if (newPermission.granted) {
        await grantPermission({ variables });
      } else {
        await restrictPermission({ variables });
      }

      // Reset form and refresh data
      setNewPermission({
        resource: '',
        operation: '',
        granted: true,
        reason: '',
        expiresAt: '',
        conditions: ''
      });
      
      await refetch();
      await refreshPermissions();
      setIsGrantDialogOpen(false);
    } catch (error) {
      console.error('Failed to grant permission:', error);
    }
  };

  const handleRemoveOverride = async (overrideId: string) => {
    try {
      await removeOverride({ variables: { id: overrideId } });
      await refetch();
      await refreshPermissions();
    } catch (error) {
      console.error('Failed to remove override:', error);
    }
  };

  const handleExtendExpiration = async (overrideId: string, newDate: string) => {
    try {
      await extendExpiration({
        variables: {
          id: overrideId,
          newExpiresAt: newDate,
          reason: 'Extended via admin interface'
        }
      });
      await refetch();
    } catch (error) {
      console.error('Failed to extend expiration:', error);
    }
  };

  const overrides = data?.permissionOverrides || [];
  const activeOverrides = overrides.filter(o => 
    !o.expiresAt || new Date(o.expiresAt) > new Date()
  );
  const expiredOverrides = overrides.filter(o => 
    o.expiresAt && new Date(o.expiresAt) <= new Date()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Overrides for {userName}
          </CardTitle>
          <CardDescription>
            Manage individual permission grants and restrictions for {userEmail}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {activeOverrides.length} active overrides, {expiredOverrides.length} expired
            </div>
            <Button 
              onClick={() => setIsGrantDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Override
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Permission Override Dialog */}
      {isGrantDialogOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Add Permission Override</CardTitle>
            <CardDescription>
              Grant or restrict a specific permission for this user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resource">Resource</Label>
                <Select value={newPermission.resource} onValueChange={(value) => 
                  setNewPermission(prev => ({ ...prev, resource: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payroll">Payroll</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="settings">Settings</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="operation">Operation</Label>
                <Select value={newPermission.operation} onValueChange={(value) => 
                  setNewPermission(prev => ({ ...prev, operation: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="assign">Assign</SelectItem>
                    <SelectItem value="invite">Invite</SelectItem>
                    <SelectItem value="manage">Manage</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newPermission.granted}
                onCheckedChange={(checked) => 
                  setNewPermission(prev => ({ ...prev, granted: checked }))
                }
              />
              <Label>
                {newPermission.granted ? 'Grant Permission' : 'Restrict Permission'}
              </Label>
            </div>

            <div>
              <Label htmlFor="reason">Reason (Required)</Label>
              <Textarea
                value={newPermission.reason}
                onChange={(e) => setNewPermission(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Explain why this permission override is needed..."
                required
              />
            </div>

            <div>
              <Label htmlFor="expiresAt">Expires At (Optional)</Label>
              <Input
                type="datetime-local"
                value={newPermission.expiresAt}
                onChange={(e) => setNewPermission(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleGrantPermission}
                disabled={granting || restricting || !newPermission.resource || !newPermission.operation || !newPermission.reason}
              >
                {granting || restricting ? 'Saving...' : 'Add Override'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsGrantDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Overrides */}
      {activeOverrides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Permission Overrides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeOverrides.map((override) => (
                <div key={override.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={override.granted ? "default" : "destructive"}>
                        {override.granted ? 'GRANTED' : 'RESTRICTED'}
                      </Badge>
                      <span className="font-medium">
                        {override.resource}:{override.operation}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mt-1">
                      {override.reason}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {override.createdByUser?.name || 'System'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(override.createdAt), 'MMM d, yyyy')}
                      </div>
                      {override.expiresAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires {format(new Date(override.expiresAt), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {override.expiresAt && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date();
                          newDate.setMonth(newDate.getMonth() + 1);
                          handleExtendExpiration(override.id, newDate.toISOString());
                        }}
                        disabled={extending}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Extend
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveOverride(override.id)}
                      disabled={removing}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expired Overrides */}
      {expiredOverrides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expired Permission Overrides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiredOverrides.map((override) => (
                <div key={override.id} className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        EXPIRED
                      </Badge>
                      <span className="font-medium">
                        {override.resource}:{override.operation}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mt-1">
                      {override.reason}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Expired {format(new Date(override.expiresAt!), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveOverride(override.id)}
                    disabled={removing}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clean up
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {overrides.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              No permission overrides found for this user.
              <br />
              This user inherits permissions from their assigned role.
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Loading permission overrides...
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}