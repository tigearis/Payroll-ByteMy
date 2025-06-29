"use client";

import { useQuery } from '@apollo/client';
import { Users, Shield, Search, Settings } from "lucide-react";
import React, { useState } from 'react';
import { PermissionOverrideManager } from '@/components/admin/permission-override-manager';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GetUsersDocument } from '@/domains/users/graphql/generated/graphql';
import { useAuthContext, migration } from '@/lib/auth';

export default function PermissionsAdminPage() {
  const { userRole } = useAuthContext();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get users for selection
  const { data: usersData, loading: usersLoading } = useQuery(GetUsersDocument, {
    variables: {
      where: searchTerm ? {
        _or: [
          { name: { _ilike: `%${searchTerm}%` } },
          { email: { _ilike: `%${searchTerm}%` } }
        ]
      } : {},
      limit: 50
    },
    errorPolicy: 'all'
  });

  const users = usersData?.users || [];
  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <PermissionGuard role="org_admin" fallback={
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              You don't have permission to access the permissions admin panel.
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Permission Management</h1>
            <p className="text-muted-foreground">
              Manage individual user permission overrides and role assignments
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Enhanced Permissions
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Active users in the system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permission System</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Role + Override</div>
              <p className="text-xs text-muted-foreground">
                Hierarchical with individual overrides
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Driven</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">
                Using database permission system
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select User to Manage
            </CardTitle>
            <CardDescription>
              Choose a user to view and manage their permission overrides
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {users.length > 0 ? (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user to manage permissions" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{user.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                {usersLoading ? 'Loading users...' : 'No users found'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permission Override Manager */}
        {selectedUser && (
          <PermissionOverrideManager
            userId={selectedUser.id}
            userEmail={selectedUser.email}
            userName={selectedUser.name}
          />
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>How Permission Overrides Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Role-Based Permissions</h4>
                <p className="text-sm text-muted-foreground">
                  Users inherit permissions from their assigned role (developer, org_admin, manager, consultant, viewer).
                  Higher roles inherit permissions from lower roles.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Individual Overrides</h4>
                <p className="text-sm text-muted-foreground">
                  Grant additional permissions beyond the user's role, or restrict specific permissions.
                  Overrides can be temporary with expiration dates.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Permission Priority</h4>
                <p className="text-sm text-muted-foreground">
                  Individual grants override role permissions. Individual restrictions override both role permissions and grants.
                  This allows fine-grained control when needed.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Audit Trail</h4>
                <p className="text-sm text-muted-foreground">
                  All permission changes are logged with timestamps, reasons, and the administrator who made the change.
                  This ensures compliance and accountability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}