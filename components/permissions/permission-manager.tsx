"use client";

/**
 * Permission Manager Component
 * 
 * Provides UI for managing user permissions including:
 * - Viewing current permissions
 * - Adding/removing permission overrides
 * - Setting expiry dates for temporary permissions
 */

import { Trash2, Plus, Clock, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHierarchicalPermissions } from '@/hooks/use-hierarchical-permissions';
import { usePermissions } from '@/hooks/use-permissions';
import { type UserRole } from '@/lib/permissions/hierarchical-permissions';

// Define resources and actions for permission management
const RESOURCES = [
  'dashboard', 'clients', 'payrolls', 'schedule', 'workschedule',
  'staff', 'leave', 'ai', 'bulkupload', 'reports', 'billing',
  'email', 'invitations', 'settings', 'security', 'developer'
] as const;

const ACTIONS = [
  'read', 'create', 'update', 'delete', 'archive', 
  'approve', 'export', 'list', 'manage', 'process',
  'assign', 'configure', 'audit', 'override', 'execute'
] as const;

// Helper function to format permission string
function formatPermission(resource: string, action: string): string {
  return `${resource}.${action}`;
}

interface PermissionManagerProps {
  userId?: string;
  userRole?: UserRole;
  userName?: string;
  onPermissionChange?: () => void;
}

export function PermissionManager({ 
  userId, 
  userRole = 'viewer',
  userName = 'Current User',
  onPermissionChange 
}: PermissionManagerProps) {
  const { permissions, role, refreshPermissions, isRefreshing } = usePermissions();
  const { effectivePermissions } = useHierarchicalPermissions();
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [grantType, setGrantType] = useState<'grant' | 'revoke'>('grant');
  const [reason, setReason] = useState('');
  const [expiryDays, setExpiryDays] = useState<number | ''>('');

  // Use current user's permissions if no userId provided
  const displayPermissions = userId ? [] : permissions; // TODO: Fetch user permissions from API
  const displayRole = userId ? userRole : role;
  const basePermissions = userId ? [] : effectivePermissions;

  const handleAddOverride = async () => {
    if (!selectedResource || !selectedAction || !reason.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const permission = `${selectedResource}.${selectedAction}`;
    const expiryDate = expiryDays ? new Date(Date.now() + (Number(expiryDays) * 24 * 60 * 60 * 1000)) : null;

    try {
      // TODO: Implement API call to add permission override
      const response = await fetch('/api/permissions/overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'current',
          resource: selectedResource,
          action: selectedAction,
          granted: grantType === 'grant',
          reason,
          expiresAt: expiryDate?.toISOString()
        })
      });

      if (response.ok) {
        // Reset form
        setSelectedResource('');
        setSelectedAction('');
        setReason('');
        setExpiryDays('');
        
        // Refresh permissions
        if (!userId) {
          await refreshPermissions();
        }
        
        onPermissionChange?.();
      } else {
        const error = await response.json();
        alert(`Failed to ${grantType} permission: ${error.message}`);
      }
    } catch (error) {
      alert('An error occurred while managing permissions');
    }
  };

  const getPermissionStatus = (permission: string) => {
    const hasBase = basePermissions.includes(permission);
    const hasCurrent = displayPermissions.includes(permission);
    
    if (hasBase && hasCurrent) return 'role';
    if (!hasBase && hasCurrent) return 'granted';
    if (hasBase && !hasCurrent) return 'revoked';
    return 'none';
  };

  const groupPermissionsByResource = () => {
    const grouped: Record<string, Array<{ action: string; status: string }>> = {};
    
    RESOURCES.forEach(resource => {
      grouped[resource] = ACTIONS.map(action => ({
        action,
        status: getPermissionStatus(`${resource}.${action}`)
      })).filter(item => item.status !== 'none');
    });
    
    return grouped;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Permission Management</h2>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {userName}
          </CardTitle>
          <CardDescription>
            Role: <Badge variant="outline">{displayRole}</Badge>
            {!userId && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Current User)
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Current Permissions</CardTitle>
            <CardDescription>
              Permissions from role and overrides ({displayPermissions.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(groupPermissionsByResource()).map(([resource, actions]) => (
                actions.length > 0 && (
                  <div key={resource} className="space-y-2">
                    <h4 className="font-medium capitalize">{resource}</h4>
                    <div className="flex flex-wrap gap-1">
                      {actions.map(({ action, status }) => (
                        <Badge 
                          key={action}
                          variant={status === 'role' ? 'default' : status === 'granted' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {action}
                          {status === 'granted' && <Plus className="h-3 w-3 ml-1" />}
                          {status === 'revoked' && <Trash2 className="h-3 w-3 ml-1" />}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Permission Override */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Permissions</CardTitle>
            <CardDescription>
              Grant or revoke specific permissions for this user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resource">Resource</Label>
                <select
                  id="resource"
                  className="w-full p-2 border rounded-md"
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                >
                  <option value="">Select Resource</option>
                  {RESOURCES.map(resource => (
                    <option key={resource} value={resource}>
                      {resource.charAt(0).toUpperCase() + resource.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="action">Action</Label>
                <select
                  id="action"
                  className="w-full p-2 border rounded-md"
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                >
                  <option value="">Select Action</option>
                  {ACTIONS.map(action => (
                    <option key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="grant-type">Permission Type</Label>
              <select
                id="grant-type"
                className="w-full p-2 border rounded-md"
                value={grantType}
                onChange={(e) => setGrantType(e.target.value as 'grant' | 'revoke')}
              >
                <option value="grant">Grant (Add Permission)</option>
                <option value="revoke">Revoke (Remove Permission)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="expiry">Expiry (Optional)</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="expiry"
                  type="number"
                  placeholder="Days until expiry"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value ? Number(e.target.value) : '')}
                  min="1"
                  max="365"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty for permanent override
              </p>
            </div>

            <div>
              <Label htmlFor="reason">Reason *</Label>
              <Input
                id="reason"
                placeholder="Reason for this permission change"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleAddOverride}
              disabled={!selectedResource || !selectedAction || !reason.trim() || isRefreshing}
              className="w-full"
            >
              {isRefreshing ? 'Processing...' : `${grantType === 'grant' ? 'Grant' : 'Revoke'} Permission`}
            </Button>

            {selectedResource && selectedAction && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Preview:</strong> {grantType === 'grant' ? 'Grant' : 'Revoke'} 
                  {' '}<code>{selectedResource}.{selectedAction}</code>
                  {expiryDays && ` for ${expiryDays} days`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Permissions Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="default">role permission</Badge>
              <span className="text-sm">From user's role</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">granted <Plus className="h-3 w-3" /></Badge>
              <span className="text-sm">Explicitly granted</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">revoked <Trash2 className="h-3 w-3" /></Badge>
              <span className="text-sm">Explicitly revoked</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}