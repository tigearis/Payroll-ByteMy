"use client";

/**
 * Permission Debug Component
 * 
 * Development tool for debugging permissions.
 * Shows current user permissions and provides testing interface.
 */

import { RefreshCw, Bug, CheckCircle, XCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePermissions, useRole } from '@/hooks/use-permissions';
// Legacy enhanced permissions removed - using hierarchical system
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

export function PermissionDebug() {
  const { 
    permissions, 
    role, 
    isLoaded, 
    isRefreshing, 
    can, 
    canAny, 
    canAll,
    refreshPermissions 
  } = usePermissions();
  
  const { 
    isDeveloper, 
    isOrgAdmin, 
    isManager, 
    isConsultant, 
    isViewer 
  } = useRole();

  const [testResource, setTestResource] = useState('');
  const [testAction, setTestAction] = useState('');
  const [testPermissions, setTestPermissions] = useState('');
  const [testResults, setTestResults] = useState<Array<{ test: string; result: boolean }>>([]);

  const runPermissionTest = () => {
    const results = [];
    
    // Single permission test
    if (testResource && testAction) {
      results.push({
        test: `can('${testResource}', '${testAction}')`,
        result: can(testResource, testAction)
      });
    }
    
    // Multiple permissions test
    if (testPermissions) {
      const permList = testPermissions.split(',').map(p => p.trim()).filter(Boolean);
      if (permList.length > 1) {
        results.push({
          test: `canAny([${permList.map(p => `'${p}'`).join(', ')}])`,
          result: canAny(permList)
        });
        results.push({
          test: `canAll([${permList.map(p => `'${p}'`).join(', ')}])`,
          result: canAll(permList)
        });
      }
    }
    
    setTestResults(results);
  };

  const clearTests = () => {
    setTestResource('');
    setTestAction('');
    setTestPermissions('');
    setTestResults([]);
  };

  const groupPermissionsByResource = () => {
    const grouped: Record<string, string[]> = {};
    
    permissions.forEach(permission => {
      const [resource, action] = permission.split('.');
      if (!grouped[resource]) {
        grouped[resource] = [];
      }
      grouped[resource].push(action);
    });
    
    return grouped;
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading permissions...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bug className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Permission Debug</h2>
        </div>
        <Button 
          onClick={refreshPermissions}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Status */}
        <Card>
          <CardHeader>
            <CardTitle>User Status</CardTitle>
            <CardDescription>Current user role and permission count</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Badge variant="default" className="text-sm">
                {role}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Label>Role Checks</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant={isDeveloper ? "default" : "secondary"}>
                  Developer: {isDeveloper ? '✓' : '✗'}
                </Badge>
                <Badge variant={isOrgAdmin ? "default" : "secondary"}>
                  Org Admin: {isOrgAdmin ? '✓' : '✗'}
                </Badge>
                <Badge variant={isManager ? "default" : "secondary"}>
                  Manager: {isManager ? '✓' : '✗'}
                </Badge>
                <Badge variant={isConsultant ? "default" : "secondary"}>
                  Consultant: {isConsultant ? '✓' : '✗'}
                </Badge>
                <Badge variant={isViewer ? "default" : "secondary"}>
                  Viewer: {isViewer ? '✓' : '✗'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Permission Count</Label>
              <div className="text-2xl font-bold">{permissions.length}</div>
              <p className="text-sm text-muted-foreground">
                Total permissions granted
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Permission Tester */}
        <Card>
          <CardHeader>
            <CardTitle>Permission Tester</CardTitle>
            <CardDescription>Test permission checks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test-resource">Resource</Label>
                <select
                  id="test-resource"
                  className="w-full p-2 border rounded-md"
                  value={testResource}
                  onChange={(e) => setTestResource(e.target.value)}
                >
                  <option value="">Select Resource</option>
                  {RESOURCES.map(resource => (
                    <option key={resource} value={resource}>
                      {resource}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="test-action">Action</Label>
                <select
                  id="test-action"
                  className="w-full p-2 border rounded-md"
                  value={testAction}
                  onChange={(e) => setTestAction(e.target.value)}
                >
                  <option value="">Select Action</option>
                  {ACTIONS.map(action => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="test-permissions">Multiple Permissions</Label>
              <Textarea
                id="test-permissions"
                placeholder="Enter comma-separated permissions (e.g., clients.read, payrolls.create)"
                value={testPermissions}
                onChange={(e) => setTestPermissions(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={runPermissionTest} className="flex-1">
                Run Test
              </Button>
              <Button onClick={clearTests} variant="outline">
                Clear
              </Button>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-2">
                <Label>Test Results</Label>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      {result.result ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <code className="text-sm">{result.test}</code>
                      <Badge variant={result.result ? "default" : "destructive"}>
                        {result.result ? 'PASS' : 'FAIL'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>All Permissions</CardTitle>
          <CardDescription>
            Complete list of permissions by resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(groupPermissionsByResource()).map(([resource, actions]) => (
              <div key={resource} className="space-y-2">
                <h4 className="font-medium capitalize flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {resource} ({actions.length})
                </h4>
                <div className="flex flex-wrap gap-1 ml-6">
                  {actions.sort().map(action => (
                    <Badge key={action} variant="outline" className="text-xs">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Raw Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Permissions Array</CardTitle>
          <CardDescription>
            Complete permissions list for debugging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
            {JSON.stringify(permissions, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}