"use client";

/**
 * Simple Permission Override Manager
 * 
 * Simplified version that just shows role management.
 * Complex permission overrides have been moved to legacy system.
 */

import { useState } from "react";
import { AlertCircle, User, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthContext, type SimpleRole, getRoleDisplayName, getAssignableRoles } from "@/lib/auth";

interface PermissionOverrideManagerProps {
  userId: string;
  userEmail: string;
  userName: string;
}

export function PermissionOverrideManager({
  userId,
  userEmail,
  userName,
}: PermissionOverrideManagerProps) {
  const { userRole } = useAuthContext();
  const [selectedRole, setSelectedRole] = useState<SimpleRole>("viewer");
  const [isUpdating, setIsUpdating] = useState(false);

  const assignableRoles = getAssignableRoles(userRole);

  const handleRoleUpdate = async () => {
    setIsUpdating(true);
    try {
      // In a real implementation, this would call an API to update the user's role
      console.log(`Updating user ${userId} role to ${selectedRole}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message or refresh data
      alert(`Role updated successfully for ${userName}`);
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update role. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
          <CardDescription>
            Managing permissions for {userName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div className="text-lg">{userName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="text-lg">{userEmail}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Management
          </CardTitle>
          <CardDescription>
            Update the user's role to change their access level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as SimpleRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center justify-between w-full">
                        <span>{getRoleDisplayName(role)}</span>
                        <Badge variant="outline" className="ml-2">
                          {role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleRoleUpdate} 
              disabled={isUpdating}
              className="min-w-[100px]"
            >
              {isUpdating ? "Updating..." : "Update Role"}
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> The complex permission override system has been simplified. 
              Users now inherit permissions based on their role in the hierarchy: 
              Developer → Admin → Manager → Consultant → Viewer.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Permission Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Summary</CardTitle>
          <CardDescription>
            What the user can do with the selected role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getPermissionSummary(selectedRole).map((permission, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{permission}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getPermissionSummary(role: SimpleRole): string[] {
  const permissions: Record<SimpleRole, string[]> = {
    developer: [
      "Full system access",
      "Debug and development tools",
      "All administrative functions",
      "User and role management",
      "System configuration",
    ],
    org_admin: [
      "Organization administration",
      "User and role management", 
      "Security and audit access",
      "System settings",
      "All business operations",
    ],
    manager: [
      "Staff management",
      "Invitation management",
      "Payroll operations",
      "Client management",
      "Dashboard access",
    ],
    consultant: [
      "Client access",
      "Payroll viewing",
      "Dashboard access",
      "Basic business operations",
    ],
    viewer: [
      "Dashboard access",
      "Read-only access to assigned data",
    ],
  };

  return permissions[role] || [];
}