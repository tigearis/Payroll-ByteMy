"use client";

import { useQuery, useMutation } from "@apollo/client";
import { Shield, Search, Save, AlertTriangle, CheckCircle, X } from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  GetAllResourcesWithPermissionsDocument,
  GetUserEffectivePermissionsDocument,
  CreatePermissionOverrideDocument,
  DeletePermissionOverrideDocument,
  CreatePermissionAuditLogDocument,
} from "@/domains/users/graphql/generated/graphql";
import { 
  type UserRole 
} from "@/lib/permissions/hierarchical-permissions";
import { useHierarchicalPermissions } from "@/hooks/use-hierarchical-permissions";
import { ResourcePermissionRow } from "./resource-permission-row";

// Helper functions for API calls
async function createPermissionOverride(
  userId: string,
  clerkUserId: string,
  userRole: UserRole,
  resource: string,
  operation: string,
  granted: boolean,
  reason: string
): Promise<void> {
  const response = await fetch('/api/permissions/overrides', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'create',
      userId,
      clerkUserId,
      userRole,
      resource,
      operation,
      granted,
      reason,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create permission override');
  }
}

async function deletePermissionOverride(
  overrideId: string,
  userId: string,
  clerkUserId: string,
  userRole: UserRole
): Promise<void> {
  const response = await fetch('/api/permissions/overrides', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'delete',
      overrideId,
      userId,
      clerkUserId,
      userRole,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete permission override');
  }
}

interface PermissionEditorProps {
  userId: string;
  clerkUserId: string;
  userRole: string;
  userName: string;
  onPermissionChange?: (hasChanges: boolean) => void;
}

interface PermissionOverride {
  id?: string;
  resource: string;
  operation: string;
  granted: boolean;
  reason: string;
}

interface PendingChange {
  resource: string;
  operation: string;
  granted: boolean;
  reason: string;
  isNew?: boolean;
  originalOverrideId?: string;
}

export function PermissionEditor({
  userId,
  clerkUserId,
  userRole,
  userName,
  onPermissionChange,
}: PermissionEditorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [currentChange, setCurrentChange] = useState<PendingChange | null>(null);
  const [changeReason, setChangeReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { userRole: currentUserRole, canAccessRole } = useHierarchicalPermissions();

  // Check if current user can edit this user's permissions
  const canEditPermissions = useMemo(() => {
    // Users cannot edit their own permissions
    if (!currentUserRole) return false;
    
    // Check if current user can access the target user's role level
    return canAccessRole(userRole as any);
  }, [currentUserRole, canAccessRole, userRole]);

  // Fetch all resources and permissions
  const { data: resourcesData, loading: resourcesLoading, error: resourcesError } = useQuery(
    GetAllResourcesWithPermissionsDocument
  );

  // Fetch user's current effective permissions
  const { 
    data: userPermissionsData, 
    loading: userPermissionsLoading,
    error: userPermissionsError,
    refetch: refetchUserPermissions 
  } = useQuery(GetUserEffectivePermissionsDocument, {
    variables: { userId },
    skip: !userId,
  });

  // Debug logging
  console.log('🔍 PermissionEditor Debug:', {
    userId,
    resourcesLoading,
    userPermissionsLoading,
    resourcesError: resourcesError?.message,
    userPermissionsError: userPermissionsError?.message,
    resourcesData: resourcesData ? `${resourcesData.resources?.length || 0} resources` : 'no data',
    userPermissionsData: userPermissionsData ? 
      `${userPermissionsData.users?.length || 0} users, ${userPermissionsData.permissionOverrides?.length || 0} overrides` : 
      'no data',
    rawUserPermissionsData: userPermissionsData
  });

  // Mutations
  const [createOverride] = useMutation(CreatePermissionOverrideDocument);
  const [deleteOverride] = useMutation(DeletePermissionOverrideDocument);
  const [createAuditLog] = useMutation(CreatePermissionAuditLogDocument);

  // Calculate effective permissions
  const effectivePermissions = useMemo(() => {
    console.log('🧮 Calculating effectivePermissions:', {
      hasResourcesData: !!resourcesData?.resources,
      hasUserPermissionsData: !!userPermissionsData,
      resourcesCount: resourcesData?.resources?.length || 0,
      usersCount: userPermissionsData?.users?.length || 0,
      userPermissionsData: userPermissionsData
    });

    if (!resourcesData?.resources || !userPermissionsData) {
      console.log('❌ Missing data for effectivePermissions calculation');
      return {};
    }

    const permissions: Record<string, Record<string, {
      hasPermission: boolean;
      source: 'role' | 'override_granted' | 'override_denied';
      overrideId?: string;
    }>> = {};

    // Get role permissions
    const rolePermissions = new Set<string>();
    
    console.log('🔍 UserPermissionsData structure:', {
      hasUsers: !!userPermissionsData.users,
      usersLength: userPermissionsData.users?.length,
      usersArray: userPermissionsData.users,
      targetUserId: userId,
      fullData: userPermissionsData
    });
    
    const user = userPermissionsData.users[0];
    console.log('👤 Processing user:', {
      user: user?.id,
      roleAssignments: user?.roleAssignments?.length || 0,
      foundUser: !!user,
      searchedUserId: userId
    });

    user?.roleAssignments?.forEach((roleAssignment: any) => {
      console.log('🎭 Processing role assignment:', {
        roleId: roleAssignment.roleId,
        roleName: roleAssignment.role?.name,
        rolePermissionsCount: roleAssignment.role?.rolePermissions?.length || 0
      });
      
      roleAssignment.role?.rolePermissions?.forEach((rolePermission: any) => {
        const permission = rolePermission.permission;
        if (permission?.resource?.name && permission?.action) {
          const permissionKey = `${permission.resource.name}.${permission.action}`;
          rolePermissions.add(permissionKey);
        }
      });
    });

    console.log('✅ Role permissions extracted:', {
      count: rolePermissions.size,
      sample: Array.from(rolePermissions).slice(0, 5)
    });

    // Process each resource
    resourcesData.resources.forEach(resource => {
      permissions[resource.name] = {};
      
      resource.permissions?.forEach((permission: any) => {
        const permissionKey = `${resource.name}.${permission.action}`;
        const hasRolePermission = rolePermissions.has(permissionKey);
        
        // Check for overrides
        const override = userPermissionsData.permissionOverrides?.find(
          o => o.resource === resource.name && o.operation === permission.action
        );

        if (override) {
          permissions[resource.name][permission.action] = {
            hasPermission: override.granted,
            source: override.granted ? 'override_granted' : 'override_denied',
            overrideId: override.id,
          };
        } else {
          permissions[resource.name][permission.action] = {
            hasPermission: hasRolePermission,
            source: 'role',
          };
        }
      });
    });

    console.log('✅ Final effectivePermissions calculated:', {
      resourcesCount: Object.keys(permissions).length,
      totalPermissions: Object.values(permissions).reduce((acc, resource) => acc + Object.keys(resource).length, 0),
      sample: Object.keys(permissions).slice(0, 3).map(resource => ({
        resource,
        permissions: Object.keys(permissions[resource]).length
      }))
    });

    return permissions;
  }, [resourcesData, userPermissionsData]);

  // Filter resources based on search
  const filteredResources = useMemo(() => {
    if (!resourcesData?.resources) return [];
    
    if (!searchTerm) return resourcesData.resources;
    
    return resourcesData.resources.filter(resource =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resourcesData?.resources, searchTerm]);

  // Handle permission change
  const handlePermissionChange = (
    resource: string,
    operation: string,
    granted: boolean,
    currentSource: string,
    overrideId?: string
  ) => {
    const change: PendingChange = {
      resource,
      operation,
      granted,
      reason: "",
    };
    
    if (overrideId !== undefined) {
      change.originalOverrideId = overrideId;
    }

    // Determine if this is a new override or removing an existing one
    const currentPermission = effectivePermissions[resource]?.[operation];
    const hasRolePermission = currentPermission?.source === 'role' && currentPermission.hasPermission;
    
    if (currentSource === 'role') {
      // Creating new override (different from role default)
      change.isNew = true;
    } else {
      // Modifying or removing existing override
      if (granted === hasRolePermission) {
        // Returning to role default - remove override
        change.granted = hasRolePermission;
        change.isNew = false;
      } else {
        // Changing override value
        change.isNew = false;
      }
    }

    setCurrentChange(change);
    setChangeReason("");
    setShowReasonDialog(true);
  };

  // Apply pending change with reason
  const applyChangeWithReason = () => {
    if (!currentChange || !changeReason.trim()) {
      toast.error("Please provide a reason for this permission change");
      return;
    }

    const changeWithReason = { ...currentChange, reason: changeReason.trim() };
    setPendingChanges(prev => {
      const existing = prev.findIndex(
        p => p.resource === changeWithReason.resource && p.operation === changeWithReason.operation
      );
      
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = changeWithReason;
        return updated;
      } else {
        return [...prev, changeWithReason];
      }
    });

    onPermissionChange?.(true);
    setShowReasonDialog(false);
    setCurrentChange(null);
    setChangeReason("");
  };

  // Remove pending change
  const removePendingChange = (resource: string, operation: string) => {
    setPendingChanges(prev => 
      prev.filter(p => !(p.resource === resource && p.operation === operation))
    );
    onPermissionChange?.(pendingChanges.length <= 1);
  };

  // Save all changes
  const saveAllChanges = async () => {
    if (pendingChanges.length === 0) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      let successCount = 0;
      const changeCount = pendingChanges.length;

      for (const change of pendingChanges) {
        const currentPermission = effectivePermissions[change.resource]?.[change.operation];
        const hasRolePermission = currentPermission?.source === 'role' && currentPermission.hasPermission;

        try {
          if (change.granted === hasRolePermission && change.originalOverrideId) {
            // Remove override (returning to role default) with Clerk sync
            console.log(`🔄 Removing override for ${change.resource}.${change.operation}`);
            await deletePermissionOverride(
              change.originalOverrideId,
              userId,
              clerkUserId,
              userRole as UserRole
            );
            console.log(`✅ Successfully removed override for ${change.resource}.${change.operation}`);
          } else if (change.granted !== hasRolePermission) {
            // Create new override with Clerk sync
            console.log(`🔄 Creating override for ${change.resource}.${change.operation} = ${change.granted}`);
            await createPermissionOverride(
              userId,
              clerkUserId,
              userRole as UserRole,
              change.resource,
              change.operation,
              change.granted,
              change.reason
            );
            console.log(`✅ Successfully created override for ${change.resource}.${change.operation}`);
          }

          // Create audit log entry
          await createAuditLog({
            variables: {
              input: {
                changeType: change.granted ? 'GRANT_PERMISSION' : 'DENY_PERMISSION',
                permissionType: `${change.resource}.${change.operation}`,
                targetUserId: userId,
                changedByUserId: '00000000-0000-0000-0000-000000000000', // TODO: Get from session
                changedAt: new Date().toISOString(),
              }
            }
          });

          successCount++;
        } catch (changeError: any) {
          console.error(`❌ Failed to process permission change for ${change.resource}.${change.operation}:`, changeError);
          
          // Continue with other changes but track the error
          const errorMessage = changeError.message || 'Unknown error';
          setSaveError(`Failed to update ${change.resource}.${change.operation}: ${errorMessage}`);
          
          // Don't break the loop - try to process remaining changes
          continue;
        }
      }

      // Refetch user permissions to reflect changes
      try {
        await refetchUserPermissions();
      } catch (refetchError) {
        console.warn("Failed to refetch user permissions:", refetchError);
        // Don't fail the entire operation for refetch errors
      }
      
      // Update UI state
      setPendingChanges([]);
      onPermissionChange?.(false);

      // Show appropriate success/partial success message
      if (successCount === changeCount) {
        toast.success(`Successfully updated ${successCount} permission(s) for ${userName}. Changes synced to Clerk.`);
        setSaveError(null);
      } else if (successCount > 0) {
        toast.success(`Updated ${successCount} of ${changeCount} permissions. Some changes failed - see details above.`);
      } else {
        toast.error("Failed to update any permissions. Please check the error details and try again.");
      }
      
    } catch (error: any) {
      console.error("❌ Critical error saving permission changes:", error);
      const errorMessage = error.message || 'Unknown error occurred';
      setSaveError(`Critical error: ${errorMessage}`);
      toast.error("Failed to save permission changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!canEditPermissions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Permission Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Shield className="w-12 h-12 mx-auto mb-4 text-amber-500" />
            <h3 className="text-lg font-medium mb-2 text-amber-800">
              Access Restricted
            </h3>
            <p className="text-amber-600 mb-4">
              You don't have permission to edit this user's permissions.
            </p>
            <Badge className="bg-blue-100 text-blue-800">
              Current Role: {userRole?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (resourcesLoading || userPermissionsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Permission Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-blue-600">
              Loading permissions... (Resources: {resourcesLoading ? "loading" : "loaded"}, User: {userPermissionsLoading ? "loading" : "loaded"})
            </div>
            <Skeleton className="h-10 w-full" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (resourcesError || userPermissionsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Permission Management - Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">Failed to Load Permissions</span>
              </div>
              {resourcesError && (
                <p className="text-sm text-red-700 mt-1">Resources Error: {resourcesError.message}</p>
              )}
              {userPermissionsError && (
                <p className="text-sm text-red-700 mt-1">User Permissions Error: {userPermissionsError.message}</p>
              )}
              <div className="mt-2 text-xs text-red-600">
                Debug Info: userId={userId}, resourcesData={!!resourcesData}, userPermissionsData={!!userPermissionsData}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Permission Management
            </CardTitle>
            {pendingChanges.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {pendingChanges.length} Pending Changes
                </Badge>
                <Button onClick={saveAllChanges} size="sm" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save All Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search resources or permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Base Role: {userRole?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
          {saveError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">Permission Update Error</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{saveError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => setSaveError(null)}
              >
                Dismiss
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
              Debug: {filteredResources.length} resources, {Object.keys(effectivePermissions).length} permission resources, 
              userId: {userId}, search: "{searchTerm}"
            </div>
            {filteredResources.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No resources found matching your search.</p>
                <div className="text-xs text-gray-400 mt-2">
                  Available resources: {resourcesData?.resources?.length || 0}, 
                  Effective permissions: {Object.keys(effectivePermissions).length}
                </div>
              </div>
            ) : (
              filteredResources.map((resource) => (
                <ResourcePermissionRow
                  key={resource.id}
                  resource={resource}
                  effectivePermissions={effectivePermissions[resource.name] || {}}
                  pendingChanges={pendingChanges.filter(p => p.resource === resource.name)}
                  onPermissionChange={handlePermissionChange}
                  onRemovePendingChange={removePendingChange}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reason Dialog */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
              Permission Change Reason
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for this permission change. This will be recorded for audit purposes.
            </DialogDescription>
          </DialogHeader>
          
          {currentChange && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">
                  {currentChange.resource}.{currentChange.operation}
                </div>
                <div className="text-sm text-gray-600">
                  {currentChange.granted ? (
                    <span className="text-green-600">✓ Granting access</span>
                  ) : (
                    <span className="text-red-600">✗ Denying access</span>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="reason">Reason for Change *</Label>
                <Textarea
                  id="reason"
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="Explain why this permission change is needed..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowReasonDialog(false);
              setCurrentChange(null);
              setChangeReason("");
            }}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={applyChangeWithReason}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}