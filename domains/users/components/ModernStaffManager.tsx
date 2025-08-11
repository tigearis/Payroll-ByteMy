"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersTableUnified } from "./users-table-unified";

// Staff member interface matching what's passed from staff page
interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  computedName?: string | null;
  email: string;
  role: string;
  position?: string;
  isActive: boolean;
  isStaff: boolean;
  managerId?: string;
  clerkUserId?: string;
  createdAt: string;
  updatedAt: string;
  managerUser?: {
    id: string;
    firstName: string;
    lastName: string;
    computedName?: string | null;
    email: string;
    role: string;
  } | null;
}

interface ModernStaffManagerProps {
  staff: StaffMember[];
  loading?: boolean;
  onRefetch?: () => void;
  onRoleUpdate?: (userId: string, newRole: string) => void;
  onStatusUpdate?: (userId: string, status: string, reason: string) => void;
  showHeader?: boolean;
  showLocalActions?: boolean;
}

export function ModernStaffManager({
  staff = [],
  loading = false,
  onRefetch,
  onRoleUpdate,
  onStatusUpdate,
  showHeader = true,
  showLocalActions = true,
}: ModernStaffManagerProps) {
  
  // Handle user edit actions
  const handleEditUser = (user: StaffMember) => {
    // TODO: Implement edit user functionality
    console.log("Edit user:", user.id);
  };

  // Handle user view actions
  const handleViewUser = (user: StaffMember) => {
    // Navigate to user detail page
    window.location.href = `/staff/${user.id}`;
  };

  // Transform staff data to match users table interface
  const transformedUsers = staff.map(member => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    computedName: member.computedName,
    email: member.email,
    role: member.role,
    position: member.position,
    isActive: member.isActive,
    isStaff: member.isStaff,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
    manager: member.managerUser ? {
      id: member.managerUser.id,
      firstName: member.managerUser.firstName,
      lastName: member.managerUser.lastName,
      computedName: member.managerUser.computedName,
      email: member.managerUser.email,
    } : undefined,
  }));

  const content = (
    <UsersTableUnified
      users={transformedUsers}
      loading={loading}
      onRefresh={onRefetch}
      onEditUser={handleEditUser}
      onViewUser={handleViewUser}
    />
  );

  // If showHeader is false, just return the table content
  if (!showHeader) {
    return content;
  }

  // Otherwise, wrap in a card with header
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Management
          </CardTitle>
          {showLocalActions && (
            <div className="flex items-center gap-2">
              {onRefetch && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefetch}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
              <Button variant="default" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {content}
      </CardContent>
    </Card>
  );
}

export default ModernStaffManager;