"use client";

import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Edit,
  Trash2,
  RefreshCw,
  Users,
  Shield,
  Mail,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  Clock,
  Calculator,
  UserCheck,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { PermissionEditor } from "@/components/permissions/permission-editor";
import { SkillsEditModal } from "@/components/skills-edit-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  GetStaffDetailCompleteDocument,
  UpdateUserDocument,
  GetAllUsersListDocument,
} from "@/domains/users/graphql/generated/graphql";
import { useRole } from "@/hooks/use-permissions";
// Note: Complex permission GraphQL operations removed - using simplified role system
// Note: Complex permissions system simplified - using role-based access control

// Role options
const ROLE_OPTIONS = [
  { value: "viewer", label: "Viewer", description: "Read-only access" },
  {
    value: "consultant",
    label: "Consultant",
    description: "Payroll consultant access",
  },
  { value: "manager", label: "Manager", description: "Team management access" },
  {
    value: "org_admin",
    label: "Org Admin",
    description: "Organization admin access",
  },
  { value: "developer", label: "Developer", description: "Full system access" },
];

// Get status config based on user state
const getUserStatusConfig = (user: any) => {
  if (!user.isActive) {
    return {
      label: "Inactive",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: X,
    };
  }

  if (user.isStaff) {
    return {
      label: "Staff",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    };
  }

  return {
    label: "User",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: User,
  };
};

export default function StaffDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { userId } = useAuth(); // Get current user's Clerk ID
  const { role: currentUserRole, isDeveloper, isAtLeast } = useRole();
  // Permissions removed

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [editedUser, setEditedUser] = useState<any>({});
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string>("");
  const [permissionAction, setPermissionAction] = useState<
    "grant" | "restrict"
  >("grant");
  const [permissionReason, setPermissionReason] = useState("");
  const [permissionExpiration, setPermissionExpiration] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Permission checks now handled by PermissionGuard components

  // Helper function to check if user is viewing their own profile
  const isCurrentUser = (user: any): boolean => {
    return user?.clerkUserId === userId;
  };

  // Function to check if current user can change roles
  const canChangeRole = (targetRole: string): boolean => {
    if (!currentUserRole) return false;

    const roleHierarchy: Record<string, number> = {
      developer: 5,
      org_admin: 4,
      manager: 3,
      consultant: 2,
      viewer: 1,
    };

    const currentLevel = roleHierarchy[currentUserRole] || 0;
    const targetLevel = roleHierarchy[targetRole] || 0;

    // Developers can change anyone's role to anything
    if (currentUserRole === "developer") return true;

    // Org admins can assign roles up to manager level
    if (currentUserRole === "org_admin") return targetLevel <= 3;

    // Managers can assign roles up to consultant level
    if (currentUserRole === "manager") return targetLevel <= 2;

    // Consultants and viewers cannot change roles
    return false;
  };

  // Get available roles for current user
  const getAvailableRoles = () => {
    return ROLE_OPTIONS.filter(role => canChangeRole(role.value));
  };

  // GraphQL queries with hierarchical permission guards
  const { data, loading, error, refetch } = useQuery(
    GetStaffDetailCompleteDocument,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "network-only",
    }
  );

  const { data: usersData } = useQuery(GetAllUsersListDocument, {
    // Permission handled by page-level PermissionGuard
  });

  // Permission queries removed - using simplified auth system

  // Mutations
  const [updateUser] = useMutation(UpdateUserDocument, {
    onCompleted: () => {
      toast.success("User updated successfully");
      setIsEditing(false);
      setShowEditDialog(false);
      refetch();
    },
    onError: error => {
      console.error("Error updating user:", error);
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  // updateUserRole GraphQL mutation removed - now using API route for Clerk sync

  // Permission mutations removed - using simplified auth system

  // Initialize edit state when user data loads
  useEffect(() => {
    if (data?.usersByPk && !editedUser.id) {
      const user = data.usersByPk;
      setEditedUser({
        ...user,
        managerId: (user as any)?.managerId || "",
      });
    }
  }, [data, editedUser.id]);

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setEditedUser((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      const updateData: any = {
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        email: editedUser.email,
        username: editedUser.username || null,
        image: editedUser.image || null,
        isStaff: editedUser.isStaff,
        isActive: editedUser.isActive,
        managerId: editedUser.managerId || null,
      };

      // Update basic user data
      await updateUser({
        variables: {
          id,
          set: updateData,
        },
      });

      // Handle role change separately if role was changed
      if (editedUser.role && editedUser.role !== user?.role) {
        await handleRoleChange(editedUser.role);
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  // Handle role change with validation
  const handleRoleChange = async (newRole: string) => {
    if (isUpdatingRole) return; // Prevent multiple concurrent updates

    try {
      // Validate permission to change role
      if (!canChangeRole(newRole)) {
        toast.error(`You don't have permission to assign the ${newRole} role`);
        return;
      }

      // Prevent users from changing their own role
      if (isCurrentUser(user)) {
        toast.error(
          "You cannot change your own role. Please contact an administrator."
        );
        return;
      }

      setIsUpdatingRole(true);

      // Show immediate feedback
      toast.info(
        `Updating ${user?.computedName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim()}'s role to ${newRole.replace("_", " ")}...`
      );

      // Call the API route instead of GraphQL mutation to ensure Clerk sync
      const response = await fetch(`/api/staff/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
          reason: `Role updated to ${newRole.replace("_", " ")} via staff management interface`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update role");
      }

      // Refetch the user data to reflect changes
      await refetch();

      toast.success(
        result.message || `User role updated to ${newRole.replace("_", " ")}`
      );
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast.error(
        error.message || "Failed to update user role. Please try again."
      );
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    const user = data?.usersByPk;
    if (!user) return;

    // Security check: Prevent users from deleting themselves
    if (isCurrentUser(user)) {
      toast.error(
        "You cannot delete your own account. Please contact an administrator if you need to deactivate your account."
      );
      setShowDeleteDialog(false);
      return;
    }

    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `User "${user.computedName || `${user.firstName} ${user.lastName}`}" has been deleted successfully`
        );
        // Redirect to staff page after successful deletion
        window.location.href = "/staff";
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  // Permission management functions
  const resetPermissionForm = () => {
    setSelectedPermission("");
    setPermissionReason("");
    setPermissionExpiration("");
    setPermissionAction("grant");
  };

  const handlePermissionSubmit = async () => {
    if (!selectedPermission || !permissionReason) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Permission management simplified - using role-based system
    toast.info(
      "Permission management has been simplified to role-based access control"
    );
    setShowPermissionDialog(false);
    resetPermissionForm();
  };

  const handleRemoveOverride = async (overrideId: string) => {
    // Permission overrides simplified - using role-based system
    toast.info(
      "Permission management has been simplified to role-based access control"
    );
  };

  // Get user's role-based permissions
  const getUserRolePermissions = (userRole: string) => {
    // Simplified: In new system, permissions are role-based
    return [`${userRole}:access`];
  };

  // Check if user has permission (simplified role-based)
  const userHasPermission = (permission: string) => {
    const rolePermissions = getUserRolePermissions(user?.role || "");
    return rolePermissions.includes(permission as any);
  };

  // Get permission status for display (simplified)
  const getPermissionStatus = (
    permission: string
  ): {
    hasPermission: boolean;
    source: string;
    override: { id: string } | null;
  } => {
    const rolePermissions = getUserRolePermissions(user?.role || "");

    return {
      hasPermission: rolePermissions.includes(permission as any),
      source: "role",
      override: null,
    };
  };

  // Filter permissions based on search
  const filteredPermissions: string[] = [].filter((permission: string) =>
    permission.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Permission guard removed - handled by layout resource context
  if (false) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Access Denied
        </h3>
        <p className="text-sm text-destructive">
          You need staff management permissions to access this page.
        </p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading User
        </h3>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const user = data?.usersByPk;
  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          User Not Found
        </h3>
        <p className="text-gray-500 mb-4">
          The user you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/staff">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Staff
          </Button>
        </Link>
      </div>
    );
  }

  const statusConfig = getUserStatusConfig(user);
  const StatusIcon = statusConfig.icon;

  // Get manager options for dropdown
  const managerOptions =
    usersData?.users?.filter(
      (u: any) => u.role === "manager" || u.role === "org_admin"
    ) || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PermissionGuard action="read">
        <div className="space-y-6">
          {/* Header */}
          <PageHeader
            title={user.computedName || `${user.firstName} ${user.lastName}`}
            description="Staff Member Details & Management"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Staff", href: "/staff" },
              { label: user.computedName || "User" },
            ]}
            actions={[
              {
                label: "Edit User",
                icon: Edit,
                onClick: () => setShowEditDialog(true),
              },
              {
                label: "Refresh Data",
                icon: RefreshCw,
                onClick: () => refetch(),
              },
            ]}
          />

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Role</p>
                    <p className="text-2xl font-bold text-gray-900 capitalize">
                      {user.role?.replace("_", " ")}
                    </p>
                    {getAvailableRoles().length > 0 && !isCurrentUser(user) && (
                      <p className="text-xs text-green-600 mt-1">
                        Can modify role
                      </p>
                    )}
                    {isCurrentUser(user) && (
                      <p className="text-xs text-gray-500 mt-1">Your role</p>
                    )}
                  </div>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <CheckCircle
                    className={`w-8 h-8 ${user.isActive ? "text-green-600" : "text-red-600"}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Staff Member
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user.isStaff ? "Yes" : "No"}
                    </p>
                  </div>
                  <Users
                    className={`w-8 h-8 ${user.isStaff ? "text-green-600" : "text-gray-400"}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Manager</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user.manager?.computedName ||
                        `${user.manager?.firstName || ""} ${user.manager?.lastName || ""}`.trim() ||
                        "No manager assigned"}
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4 bg-indigo-100 shadow-md rounded-lg">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
              >
                Permissions
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Full Name
                        </p>
                        <p className="text-sm text-gray-900">
                          {user.computedName ||
                            `${user.firstName} ${user.lastName}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-sm text-gray-900">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Username
                        </p>
                        <p className="text-sm text-gray-900">
                          {user.username || "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-orange-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Joined
                        </p>
                        <p className="text-sm text-gray-900">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Role & Permissions Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Role & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            Current Role
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800 capitalize">
                              {user.role?.replace("_", " ")}
                            </Badge>
                            {getAvailableRoles().length > 0 &&
                              !isCurrentUser(user) && (
                                <span className="text-xs text-green-600">
                                  Can be changed
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      {/* Quick role change dropdown */}
                      {getAvailableRoles().length > 0 &&
                        !isCurrentUser(user) && (
                          <div className="flex items-center gap-2">
                            <Select
                              value={user.role}
                              onValueChange={handleRoleChange}
                              disabled={isUpdatingRole}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableRoles().map(role => (
                                  <SelectItem
                                    key={role.value}
                                    value={role.value}
                                  >
                                    {role.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {isUpdatingRole && (
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                                <span className="text-xs text-gray-500">
                                  Updating...
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Account Status
                        </p>
                        <p className="text-sm text-gray-900">
                          {user.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Staff Member
                        </p>
                        <p className="text-sm text-gray-900">
                          {user.isStaff ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-yellow-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Manager
                        </p>
                        <p className="text-sm text-gray-900">
                          {user.manager?.computedName ||
                            `${user.manager?.firstName || ""} ${user.manager?.lastName || ""}`.trim() ||
                            "No manager assigned"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      User Skills
                    </CardTitle>
                    <PermissionGuard fallback={null}>
                      <Button
                        onClick={() => setShowSkillsModal(true)}
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Skills
                      </Button>
                    </PermissionGuard>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.skills && user.skills.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {user.skills.map((skill: any, index: number) => (
                          <div
                            key={`${skill.skillName}-${index}`}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900">
                                {skill.skillName}
                              </h4>
                              <Badge
                                className={
                                  skill.proficiencyLevel === "Expert"
                                    ? "bg-purple-100 text-purple-700"
                                    : skill.proficiencyLevel === "Advanced"
                                      ? "bg-green-100 text-green-700"
                                      : skill.proficiencyLevel ===
                                          "Intermediate"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                }
                              >
                                {skill.proficiencyLevel}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Skills Assigned
                        </h3>
                        <p className="text-gray-500 mb-4">
                          This user hasn't been assigned any skills yet.
                        </p>
                        <PermissionGuard fallback={null}>
                          <Button
                            onClick={() => setShowSkillsModal(true)}
                            variant="outline"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Add Skills
                          </Button>
                        </PermissionGuard>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-6">
              <PermissionEditor
                userId={id}
                clerkUserId={user?.clerkUserId || ""}
                userRole={user?.role}
                userName={
                  user?.computedName ||
                  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                  "Unknown User"
                }
              />
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Activity History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Activity Tracking
                    </h3>
                    <p className="text-gray-500 mb-4">
                      User activity tracking will be available in a future
                      update.
                    </p>
                    <p className="text-sm text-gray-400">
                      Last updated:{" "}
                      {user.updatedAt
                        ? new Date(user.updatedAt).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit User Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Make changes to the user information.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={
                      editedUser.computedName ||
                      `${editedUser.firstName || ""} ${editedUser.lastName || ""}` ||
                      ""
                    }
                    onChange={e => {
                      const fullName = e.target.value;
                      const [firstName, ...lastNameParts] = fullName.split(" ");
                      handleInputChange("firstName", firstName || "");
                      handleInputChange("lastName", lastNameParts.join(" "));
                    }}
                    placeholder="Enter full name..."
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedUser.email || ""}
                    onChange={e => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address..."
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={editedUser.username || ""}
                    onChange={e =>
                      handleInputChange("username", e.target.value)
                    }
                    placeholder="Enter username..."
                  />
                </div>

                <div>
                  <Label htmlFor="manager">Manager</Label>
                  <Select
                    value={editedUser.managerId || "none"}
                    onValueChange={value =>
                      handleInputChange(
                        "managerId",
                        value === "none" ? null : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No manager</SelectItem>
                      {managerOptions.map((manager: any) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.computedName ||
                            `${manager.firstName || ""} ${manager.lastName || ""}`.trim() ||
                            "Unknown Manager"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Role Selection - Only show if user has permission and not editing themselves */}
                {getAvailableRoles().length > 0 && !isCurrentUser(user) && (
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={editedUser.role || user.role}
                      onValueChange={value => handleInputChange("role", value)}
                      disabled={isUpdatingRole}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableRoles().map(role => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{role.label}</span>
                              <span className="text-xs text-gray-500">
                                {role.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Current role:{" "}
                      <span className="font-medium capitalize">
                        {user.role?.replace("_", " ")}
                      </span>
                      {isUpdatingRole && (
                        <span className="text-blue-600"> (Updating...)</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Show current role if user can't change roles or is editing themselves */}
                {(getAvailableRoles().length === 0 || isCurrentUser(user)) && (
                  <div>
                    <Label>Current Role</Label>
                    <div className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex flex-col">
                        <span className="font-medium capitalize">
                          {user.role?.replace("_", " ")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {isCurrentUser(user)
                            ? "You cannot change your own role"
                            : "You don't have permission to change this user's role"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isStaff"
                    checked={editedUser.isStaff || false}
                    onCheckedChange={checked =>
                      handleInputChange("isStaff", checked)
                    }
                  />
                  <Label htmlFor="isStaff">Staff Member</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={editedUser.isActive || false}
                    onCheckedChange={checked =>
                      handleInputChange("isActive", checked)
                    }
                  />
                  <Label htmlFor="isActive">Active Account</Label>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Permission Management Dialog */}
          <Dialog
            open={showPermissionDialog}
            onOpenChange={setShowPermissionDialog}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Manage User Permissions</DialogTitle>
                <DialogDescription>
                  Grant or restrict specific permissions for this user.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="permissionAction">Action</Label>
                  <Select
                    value={permissionAction}
                    onValueChange={(value: "grant" | "restrict") =>
                      setPermissionAction(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grant">Grant Permission</SelectItem>
                      <SelectItem value="restrict">
                        Restrict Permission
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="permission">Permission *</Label>
                  <Select
                    value={selectedPermission}
                    onValueChange={setSelectedPermission}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select permission..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries({} as Record<string, string[]>).map(
                        ([category, permissions]) => (
                          <div key={category}>
                            <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                              {category}
                            </div>
                            {permissions.map((permission: string) => (
                              <SelectItem key={permission} value={permission}>
                                {permission}
                              </SelectItem>
                            ))}
                          </div>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea
                    id="reason"
                    value={permissionReason}
                    onChange={e => setPermissionReason(e.target.value)}
                    placeholder="Explain why this permission change is needed..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="expiration">Expiration Date (Optional)</Label>
                  <Input
                    id="expiration"
                    type="datetime-local"
                    value={permissionExpiration}
                    onChange={e => setPermissionExpiration(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for permanent override
                  </p>
                </div>

                {selectedPermission && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Current Status</h4>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          userHasPermission(selectedPermission)
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm">
                        User{" "}
                        {userHasPermission(selectedPermission)
                          ? "has"
                          : "does not have"}{" "}
                        this permission
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPermissionDialog(false);
                    resetPermissionForm();
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handlePermissionSubmit}>
                  <Save className="w-4 h-4 mr-2" />
                  {permissionAction === "grant" ? "Grant" : "Restrict"}{" "}
                  Permission
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete User Confirmation Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center text-destructive">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Delete User Account
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The user account will be
                  permanently deactivated and removed from the system.
                </DialogDescription>
              </DialogHeader>

              {user && (
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-destructive" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-destructive">
                          {user.computedName ||
                            `${user.firstName} ${user.lastName}`}
                        </p>
                        <p className="text-sm text-destructive/80">
                          {user.email}
                        </p>
                        <p className="text-xs text-destructive/60 capitalize">
                          {user.role?.replace("_", " ")} •{" "}
                          {user.isStaff ? "Staff Member" : "User"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">This will:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Deactivate the user account immediately</li>
                      <li>Remove access to all system features</li>
                      <li>Ban the user from authentication system</li>
                      <li>Mark all associated records as inactive</li>
                    </ul>
                  </div>

                  {/* Security notice for self-deletion attempt */}
                  {isCurrentUser(user) && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          You cannot delete your own account
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">
                        Contact an administrator if you need to deactivate your
                        account.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteUser}
                  disabled={isCurrentUser(user)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isCurrentUser(user) ? "Cannot Delete Self" : "Delete User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Skills Edit Modal */}
          <SkillsEditModal
            isOpen={showSkillsModal}
            onClose={() => setShowSkillsModal(false)}
            type="user"
            entityId={id}
            entityName={
              user.computedName || `${user.firstName} ${user.lastName}` || ""
            }
          />
        </div>
      </PermissionGuard>
    </div>
  );
}
