"use client";

import { useMutation, useQuery } from "@apollo/client";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Building2,
  Users,
  Calendar,
  Shield,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  Upload,
  Eye,
  Clock,
  FileText,
  Calculator,
  UserCheck,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/lib/auth";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PermissionGuard } from "@/components/auth/permission-guard";

import {
  GetStaffDetailCompleteDocument,
  UpdateUserDocument,
  UpdateUserRoleDocument,
  GetAllUsersListDocument,
} from "@/domains/users/graphql/generated/graphql";
import {
  GetUserEffectivePermissionsDocument,
  GetUserPermissionOverridesDocument,
  GrantUserPermissionDocument,
  RestrictUserPermissionDocument,
  RemovePermissionOverrideDocument,
  GetPermissionsDocument,
} from "@/domains/permissions/graphql/generated/graphql";
import { ALL_PERMISSIONS, ROLE_PERMISSIONS, PERMISSION_CATEGORIES } from "@/lib/auth/permissions";

// Role options
const ROLE_OPTIONS = [
  { value: "viewer", label: "Viewer", description: "Read-only access" },
  { value: "consultant", label: "Consultant", description: "Payroll consultant access" },
  { value: "manager", label: "Manager", description: "Team management access" },
  { value: "org_admin", label: "Org Admin", description: "Organization admin access" },
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
  const { hasPermission } = useAuthContext();

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [editedUser, setEditedUser] = useState<any>({});
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string>("");
  const [permissionAction, setPermissionAction] = useState<"grant" | "restrict">("grant");
  const [permissionReason, setPermissionReason] = useState("");
  const [permissionExpiration, setPermissionExpiration] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Permission checks
  const canRead = hasPermission("staff:read");
  const canEdit = hasPermission("staff:write");

  // GraphQL queries
  const { data, loading, error, refetch } = useQuery(GetStaffDetailCompleteDocument, {
    variables: { id },
    skip: !id || !canRead,
    fetchPolicy: "network-only",
  });

  const { data: usersData } = useQuery(GetAllUsersListDocument, {
    skip: !canEdit,
  });

  // Permission queries
  const { data: effectivePermissionsData, refetch: refetchEffectivePermissions } = useQuery(
    GetUserEffectivePermissionsDocument,
    {
      variables: { userId: id },
      skip: !id || !canRead,
    }
  );

  const { data: permissionOverridesData, refetch: refetchOverrides } = useQuery(
    GetUserPermissionOverridesDocument,
    {
      variables: { userId: id },
      skip: !id || !canRead,
    }
  );

  // Mutations
  const [updateUser] = useMutation(UpdateUserDocument, {
    onCompleted: () => {
      toast.success("User updated successfully");
      setIsEditing(false);
      setShowEditDialog(false);
      refetch();
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  const [updateUserRole] = useMutation(UpdateUserRoleDocument, {
    onCompleted: () => {
      toast.success("User role updated successfully");
      refetch();
    },
    onError: (error) => {
      console.error("Error updating user role:", error);
      toast.error(`Failed to update user role: ${error.message}`);
    },
  });

  // Permission mutations
  const [grantPermission] = useMutation(GrantUserPermissionDocument, {
    onCompleted: () => {
      toast.success("Permission granted successfully");
      refetchEffectivePermissions();
      refetchOverrides();
      setShowPermissionDialog(false);
      resetPermissionForm();
    },
    onError: (error) => {
      console.error("Error granting permission:", error);
      toast.error(`Failed to grant permission: ${error.message}`);
    },
  });

  const [restrictPermission] = useMutation(RestrictUserPermissionDocument, {
    onCompleted: () => {
      toast.success("Permission restricted successfully");
      refetchEffectivePermissions();
      refetchOverrides();
      setShowPermissionDialog(false);
      resetPermissionForm();
    },
    onError: (error) => {
      console.error("Error restricting permission:", error);
      toast.error(`Failed to restrict permission: ${error.message}`);
    },
  });

  const [removePermissionOverride] = useMutation(RemovePermissionOverrideDocument, {
    onCompleted: () => {
      toast.success("Permission override removed successfully");
      refetchEffectivePermissions();
      refetchOverrides();
    },
    onError: (error) => {
      console.error("Error removing permission override:", error);
      toast.error(`Failed to remove permission override: ${error.message}`);
    },
  });

  // Initialize edit state when user data loads
  useEffect(() => {
    if (data?.userById && !editedUser.id) {
      const user = data.userById;
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
        name: editedUser.name,
        email: editedUser.email,
        username: editedUser.username || null,
        image: editedUser.image || null,
        isStaff: editedUser.isStaff,
        isActive: editedUser.isActive,
        managerId: editedUser.managerId || null,
      };

      await updateUser({
        variables: {
          id,
          set: updateData,
        },
      });
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  // Handle role change
  const handleRoleChange = async (newRole: string) => {
    try {
      await updateUserRole({
        variables: {
          id,
          role: newRole,
        },
      });
    } catch (error) {
      console.error("Error updating role:", error);
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

    const [resource, operation] = selectedPermission.split(":");
    const variables = {
      userId: id,
      resource,
      operation,
      reason: permissionReason,
      expiresAt: permissionExpiration ? new Date(permissionExpiration).toISOString() : null,
    };

    try {
      if (permissionAction === "grant") {
        await grantPermission({ variables });
      } else {
        await restrictPermission({ variables });
      }
    } catch (error) {
      console.error("Error handling permission:", error);
    }
  };

  const handleRemoveOverride = async (overrideId: string) => {
    try {
      await removePermissionOverride({
        variables: { id: overrideId },
      });
    } catch (error) {
      console.error("Error removing override:", error);
    }
  };

  // Get user's role-based permissions
  const getUserRolePermissions = (userRole: string) => {
    return ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS]?.permissions || [];
  };

  // Check if user has permission (including overrides)
  const userHasPermission = (permission: string) => {
    const rolePermissions = getUserRolePermissions(user?.role || "");
    const overrides = permissionOverridesData?.permissionOverrides || [];
    
    // Check for explicit restrictions first
    const restriction = overrides.find(
      (override: any) => 
        `${override.resource}:${override.operation}` === permission && 
        override.granted === false
    );
    if (restriction) return false;
    
    // Check for explicit grants
    const grant = overrides.find(
      (override: any) => 
        `${override.resource}:${override.operation}` === permission && 
        override.granted === true
    );
    if (grant) return true;
    
    // Check role permissions
    return rolePermissions.includes(permission as any);
  };

  // Get permission status for display
  const getPermissionStatus = (permission: string) => {
    const rolePermissions = getUserRolePermissions(user?.role || "");
    const overrides = permissionOverridesData?.permissionOverrides || [];
    
    const override = overrides.find(
      (o: any) => `${o.resource}:${o.operation}` === permission
    );
    
    if (override) {
      return {
        hasPermission: override.granted,
        source: override.granted ? "granted" : "restricted",
        override,
      };
    }
    
    return {
      hasPermission: rolePermissions.includes(permission as any),
      source: "role",
      override: null,
    };
  };

  // Filter permissions based on search
  const filteredPermissions = ALL_PERMISSIONS.filter(permission =>
    permission.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Permission guard
  if (!canRead) {
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

  const user = data?.userById;
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
  const managerOptions = usersData?.users?.filter((u: any) => 
    u.role === "manager" || u.role === "org_admin"
  ) || [];

  return (
    <PermissionGuard permission="staff:read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/staff">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Staff
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <Badge className={statusConfig.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-gray-500">Staff Member Details & Management</p>
            </div>
          </div>

          <PermissionGuard permission="staff:write" fallback={null}>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal className="w-4 h-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => refetch()}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </PermissionGuard>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Role</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {user.role?.replace('_', ' ')}
                  </p>
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
                <CheckCircle className={`w-8 h-8 ${user.isActive ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Staff Member</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.isStaff ? "Yes" : "No"}
                  </p>
                </div>
                <Users className={`w-8 h-8 ${user.isStaff ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Manager</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.managerUser?.name || "None"}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-indigo-100 shadow-md rounded-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
            >
              Overview
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
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-sm text-gray-900">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
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
                      <p className="text-sm font-medium text-gray-500">Username</p>
                      <p className="text-sm text-gray-900">{user.username || "Not set"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Joined</p>
                      <p className="text-sm text-gray-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
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
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Current Role</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900 capitalize">
                          {user.role?.replace('_', ' ')}
                        </p>
                        <PermissionGuard permission="staff:write" fallback={null}>
                          <Select value={user.role} onValueChange={handleRoleChange}>
                            <SelectTrigger className="w-32 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLE_OPTIONS.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </PermissionGuard>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Status</p>
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
                      <p className="text-sm font-medium text-gray-500">Staff Member</p>
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
                      <p className="text-sm font-medium text-gray-500">Manager</p>
                      <p className="text-sm text-gray-900">
                        {user.managerUser?.name || "No manager assigned"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Permission Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      User Permissions
                    </CardTitle>
                    <PermissionGuard permission="staff:write" fallback={null}>
                      <Button 
                        onClick={() => setShowPermissionDialog(true)}
                        size="sm"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Permissions
                      </Button>
                    </PermissionGuard>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Input
                      placeholder="Search permissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => {
                      const categoryPermissions = permissions.filter(p => 
                        filteredPermissions.includes(p)
                      );
                      
                      if (categoryPermissions.length === 0) return null;
                      
                      return (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900 capitalize">
                            {category.toLowerCase()} Permissions
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {categoryPermissions.map((permission) => {
                              const status = getPermissionStatus(permission);
                              return (
                                <div
                                  key={permission}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                      status.hasPermission ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {permission}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Source: {status.source === "role" ? `Role (${user.role})` : 
                                          status.source === "granted" ? "Explicitly Granted" : "Explicitly Restricted"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant={status.hasPermission ? "default" : "destructive"}>
                                      {status.hasPermission ? "Allowed" : "Denied"}
                                    </Badge>
                                    {status.override && (
                                      <PermissionGuard permission="staff:write" fallback={null}>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveOverride(status.override.id)}
                                          className="h-7 w-7 p-0"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </PermissionGuard>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Permission Overrides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Active Overrides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {permissionOverridesData?.permissionOverrides?.length ? (
                      permissionOverridesData.permissionOverrides.map((override: any) => (
                        <div
                          key={override.id}
                          className="p-3 border rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <Badge variant={override.granted ? "default" : "destructive"}>
                              {override.granted ? "Grant" : "Restrict"}
                            </Badge>
                            <PermissionGuard permission="staff:write" fallback={null}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveOverride(override.id)}
                                className="h-7 w-7 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </PermissionGuard>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {override.resource}:{override.operation}
                            </p>
                            <p className="text-xs text-gray-500">
                              {override.reason}
                            </p>
                            {override.expiresAt && (
                              <p className="text-xs text-orange-600">
                                Expires: {new Date(override.expiresAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">No active overrides</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                    User activity tracking will be available in a future update.
                  </p>
                  <p className="text-sm text-gray-400">
                    Last updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "Unknown"}
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
                  value={editedUser.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name..."
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address..."
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={editedUser.username || ""}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Enter username..."
                />
              </div>

              <div>
                <Label htmlFor="manager">Manager</Label>
                <Select 
                  value={editedUser.managerId || ""} 
                  onValueChange={(value) => handleInputChange("managerId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No manager</SelectItem>
                    {managerOptions.map((manager: any) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isStaff"
                  checked={editedUser.isStaff || false}
                  onCheckedChange={(checked) => handleInputChange("isStaff", checked)}
                />
                <Label htmlFor="isStaff">Staff Member</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={editedUser.isActive || false}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Active Account</Label>
              </div>
            </div>
            
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
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
        <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
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
                  onValueChange={(value: "grant" | "restrict") => setPermissionAction(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grant">Grant Permission</SelectItem>
                    <SelectItem value="restrict">Restrict Permission</SelectItem>
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
                    {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                          {category}
                        </div>
                        {permissions.map((permission) => (
                          <SelectItem key={permission} value={permission}>
                            {permission}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={permissionReason}
                  onChange={(e) => setPermissionReason(e.target.value)}
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
                  onChange={(e) => setPermissionExpiration(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for permanent override
                </p>
              </div>

              {selectedPermission && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Current Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      userHasPermission(selectedPermission) ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm">
                      User {userHasPermission(selectedPermission) ? 'has' : 'does not have'} this permission
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setShowPermissionDialog(false);
                resetPermissionForm();
              }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handlePermissionSubmit}>
                <Save className="w-4 h-4 mr-2" />
                {permissionAction === "grant" ? "Grant" : "Restrict"} Permission
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}