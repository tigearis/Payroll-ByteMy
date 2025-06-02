"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { isAuthError } from "@/lib/apollo-client";
import {
  GET_STAFF_LIST,
  GET_ALL_USERS_LIST,
} from "@/graphql/queries/staff/getStaffList";
import { UPDATE_STAFF } from "@/graphql/mutations/staff/updateStaff";
import { DELETE_STAFF } from "@/graphql/mutations/staff/deleteStaff";
import { useUserRole } from "@/hooks/useUserRole";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Trash2,
  UserPlus,
  Edit,
  Eye,
  Mail,
  User,
  Search,
  Filter,
  RefreshCcw,
  Users,
  Pencil,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ErrorBoundaryWrapper } from "@/components/error-boundary";
import { StaffLoading } from "@/components/ui/loading-states";

// Define Staff Type
interface Staff {
  id: string;
  email: string;
  name: string;
  role: string;
  username?: string;
  image?: string;
  is_staff: boolean;
  manager_id?: string;
  clerk_user_id?: string;
  created_at?: string;
  updated_at?: string;
  manager?: {
    name: string;
    id: string;
    email: string;
  };
  leaves?: Array<{
    id: string;
    start_date: string;
    end_date: string;
    leave_type: string;
    reason: string;
    status: string;
  }>;
}

// Define Edit Form Data
interface StaffEditForm {
  name: string;
  email: string;
  username: string;
  role: string;
  manager_id: string;
  is_staff: boolean;
}

// Define Create Staff Form Data
interface CreateStaffForm {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  is_staff: boolean;
}

// Role name mapping
const roleMapping: Record<string, string> = {
  admin: "Developer",
  org_admin: "Admin",
  manager: "Manager",
  consultant: "Consultant",
  viewer: "Viewer",
};

// Role options for select
const roleOptions = [
  { value: "admin", label: "Developer" },
  { value: "org_admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "consultant", label: "Consultant" },
  { value: "viewer", label: "Viewer" },
];

export default function StaffManagementPage() {
  // ⚠️ ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - NEVER CONDITIONALLY
  const { isAdmin, isManager, isConsultant, isDeveloper } = useUserRole();
  const { userId, getToken, isLoaded } = useAuth();
  const apolloClient = useApolloClient();
  const {
    currentUser,
    currentUserId,
    loading: userLoading,
    error: userError,
  } = useCurrentUser();

  // State for modals and editing
  const [editingStaff, setEditingStaff] = React.useState<Staff | null>(null);
  const [viewingStaff, setViewingStaff] = React.useState<Staff | null>(null);
  const [staffToDelete, setStaffToDelete] = React.useState<Staff | null>(null);
  const [editForm, setEditForm] = React.useState<StaffEditForm>({
    name: "",
    email: "",
    username: "",
    role: "",
    manager_id: "",
    is_staff: false,
  });
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [isSavingEdit, setIsSavingEdit] = React.useState(false);

  // State for Create Staff Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [createForm, setCreateForm] = React.useState<CreateStaffForm>({
    email: "",
    firstName: "",
    lastName: "",
    role: "viewer",
    is_staff: true,
  });
  const [isCreatingStaff, setIsCreatingStaff] = React.useState(false);
  const [createError, setCreateError] = React.useState("");

  // Filtering and search state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("all");
  const [selectedManager, setSelectedManager] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [staffList, setStaffList] = React.useState<Staff[]>([]);
  const itemsPerPage = 10;

  // Use different queries based on user role - developers see all users
  const { loading, error, data, refetch } = useQuery(
    isDeveloper ? GET_ALL_USERS_LIST : GET_STAFF_LIST,
    {
      // More comprehensive skip condition to prevent premature execution
      skip: !isLoaded || userLoading || (!currentUser && !userError) || !userId,
      errorPolicy: "all", // Return partial data even if there are errors
      fetchPolicy: "cache-and-network", // Use cache but also fetch from network
      notifyOnNetworkStatusChange: true, // Update loading state on network changes
      onError: (err) => {
        console.error("❌ Staff query error:", err);
        console.error("Query variables would be:", {
          /* no variables in this query */
        });

        // Check if it's an auth error
        if (isAuthError(err)) {
          console.warn(
            "🔐 Authentication error detected, redirecting to sign-in..."
          );
          toast.error("Authentication error. Please sign in again.");
          setTimeout(() => (window.location.href = "/sign-in"), 2000);
          return;
        }

        // Check if it's a UUID format error and clear cache
        if (err.message?.includes("invalid input syntax for type uuid")) {
          console.warn("🧹 UUID error detected, clearing Apollo cache...");
          apolloClient.cache.reset();
          toast.error(
            "Data format error detected. Page will refresh automatically."
          );
          // Auto-refresh to clear any cached invalid data
          setTimeout(() => window.location.reload(), 2000);
          return;
        }

        // Show a user-friendly error message
        toast.error(`Failed to load staff data: ${err.message}`);
      },
    }
  );

  // Mutation hooks for updating and deleting staff
  const [updateStaffMutation, { loading: isUpdating }] = useMutation(
    UPDATE_STAFF,
    {
      onCompleted: (data) => {
        if (data?.update_users_by_pk) {
          const updatedUser = data.update_users_by_pk;
          toast.success(
            `Role updated to ${
              roleMapping[updatedUser.role] || updatedUser.role
            } successfully!`
          );
          refetch(); // Refresh the staff list
        } else {
          console.error("Unexpected mutation response:", data);
          toast.error("Update completed but returned unexpected data");
        }
      },
      onError: (error) => {
        console.error("GraphQL mutation error:", error);
        toast.error(`Failed to update role: ${error.message}`);
      },
    }
  );

  // Delete staff mutation
  const [deleteStaffMutation, { loading: isDeleting }] = useMutation(
    DELETE_STAFF,
    {
      onCompleted: (data) => {
        if (data?.update_users_by_pk) {
          toast.success(`Staff member removed successfully`);
          refetch(); // Refresh the staff list
        } else {
          console.error("Unexpected deletion response:", data);
          toast.error("Deletion completed but returned unexpected data");
        }
      },
      onError: (error) => {
        console.error("GraphQL deletion error:", error);
        toast.error(`Failed to delete staff member: ${error.message}`);
      },
    }
  );

  // Handle setting staffList with useEffect - only dependency is data
  React.useEffect(() => {
    if (data?.users) {
      console.log("🔍 Staff data loaded, checking for invalid IDs:");
      data.users.forEach((user: Staff, index: number) => {
        const isValidUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            user.id
          );
        if (!isValidUUID) {
          console.error(`❌ INVALID UUID in user ${index}:`, {
            id: user.id,
            name: user.name,
            email: user.email,
            clerk_user_id: user.clerk_user_id,
          });
        } else {
          console.log(`✅ Valid UUID for ${user.name}: ${user.id}`);
        }
      });
      setStaffList(data.users);
    } else if (error && !loading) {
      // If there's an error and we're not loading, reset staff list
      console.warn("🔍 No staff data available due to error, resetting list");
      setStaffList([]);
    }
  }, [data, error, loading]);

  // Filter staff based on search and filters
  const filteredStaff = React.useMemo<Staff[]>(() => {
    if (!staffList) return [];

    console.log("🔍 Filtering staff:");
    console.log("- staffList length:", staffList.length);
    console.log("- isManager:", isManager);
    console.log("- currentUserId for filtering:", currentUserId);
    console.log("- currentUserId type:", typeof currentUserId);

    let filtered = staffList; // Temporarily disable manager filtering to debug UUID error

    // COMMENTED OUT FOR DEBUGGING:
    // let filtered =
    //   isManager && currentUserId
    //     ? staffList.filter(
    //         (staff: Staff) => {
    //           console.log(`Comparing staff.manager_id (${staff.manager_id}) with currentUserId (${currentUserId})`);
    //           return staff.manager_id === currentUserId;
    //         }
    //       )
    //     : staffList;

    console.log("- After manager filter:", filtered.length);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (staff.username &&
            staff.username.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter((staff) => staff.role === selectedRole);
    }

    // Apply manager filter
    if (selectedManager !== "all") {
      console.log("🔍 Manager filter selected:", selectedManager);
      console.log("- selectedManager type:", typeof selectedManager);
      filtered = filtered.filter((staff) => {
        console.log(
          `Comparing staff.manager_id (${staff.manager_id}) with selectedManager (${selectedManager})`
        );
        return staff.manager_id === selectedManager;
      });
    }

    return filtered;
  }, [
    staffList,
    currentUserId,
    isManager,
    searchTerm,
    selectedRole,
    selectedManager,
  ]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const allStaff = staffList || [];
    return {
      total: allStaff.length,
      admins: allStaff.filter((s) => s.role === "admin").length,
      orgAdmins: allStaff.filter((s) => s.role === "org_admin").length,
      managers: allStaff.filter((s) => s.role === "manager").length,
      consultants: allStaff.filter((s) => s.role === "consultant").length,
      viewers: allStaff.filter((s) => s.role === "viewer").length,
      active: allStaff.filter((s) => s.is_staff).length,
      inactive: allStaff.filter((s) => !s.is_staff).length,
      withAuth: allStaff.filter((s) => s.clerk_user_id).length,
      withoutAuth: allStaff.filter((s) => !s.clerk_user_id).length,
    };
  }, [staffList]);

  // Get unique managers for filter dropdown
  const managers = React.useMemo(() => {
    if (!staffList) return [];
    return staffList
      .filter(
        (staff) =>
          staff.role === "manager" ||
          staff.role === "admin" ||
          staff.role === "org_admin"
      )
      .map((manager) => ({
        id: manager.id,
        name: manager.name,
      }));
  }, [staffList]);

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStaff.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStaff, currentPage, itemsPerPage]);

  // Move isCurrentUser function before table setup
  const isCurrentUser = (staff: Staff): boolean => {
    const isMatch = currentUserId === staff.id;
    console.log(
      `🔍 isCurrentUser check for ${staff.name}: currentUserId(${currentUserId}) === staff.id(${staff.id}) = ${isMatch}`
    );
    return isMatch;
  };

  // Define columns for the table
  const columns = React.useMemo<ColumnDef<Staff>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const staff = row.original;
          return (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                {staff.image ? (
                  <img
                    src={staff.image}
                    alt={staff.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback>
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="font-medium">{staff.name}</div>
                <div className="text-sm text-gray-500">{staff.email}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.getValue("role") as string;
          const getRoleVariant = (
            role: string
          ): "destructive" | "default" | "secondary" | "outline" => {
            switch (role) {
              case "admin":
              case "org_admin":
                return "destructive";
              case "manager":
                return "default";
              case "consultant":
                return "secondary";
              default:
                return "outline";
            }
          };
          return (
            <Badge variant={getRoleVariant(role)}>
              {roleMapping[role] || role}
            </Badge>
          );
        },
      },
      {
        accessorKey: "is_staff",
        header: "Status",
        cell: ({ row }) => {
          const isStaff = row.getValue("is_staff") as boolean;
          return (
            <Badge variant={isStaff ? "default" : "secondary"}>
              {isStaff ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "manager",
        header: "Manager",
        cell: ({ row }) => {
          const manager = row.original.manager;
          return manager ? manager.name : "No Manager";
        },
      },
      {
        accessorKey: "clerk_user_id",
        header: "Auth Status",
        cell: ({ row }) => {
          const clerkUserId = row.getValue("clerk_user_id") as string;
          return (
            <Badge variant={clerkUserId ? "default" : "destructive"}>
              {clerkUserId ? "Authenticated" : "No Auth"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const staff = row.original;
          const canEdit = isAdmin || isDeveloper || isCurrentUser(staff);
          const canDelete = (isAdmin || isDeveloper) && !isCurrentUser(staff);

          return (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openViewModal(staff)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(staff)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteStaff(staff)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [isAdmin, isDeveloper, currentUserId, isCurrentUser]
  );

  // Table setup - must be after all other hooks and useMemo calls
  const table = useReactTable({
    data: paginatedStaff,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log("🔍 StaffManagementPage Debug:");
  console.log("- Clerk userId:", userId);
  console.log("- Clerk isLoaded:", isLoaded);
  console.log("- currentUser:", currentUser);
  console.log("- currentUserId (database UUID):", currentUserId);
  console.log("- userLoading:", userLoading);
  console.log("- userError:", userError);
  console.log("- isManager:", isManager);
  console.log("🔍 Role Debug Information:");
  console.log("- isDeveloper:", isDeveloper);
  console.log("- isAdmin:", isAdmin);
  console.log(
    "- canEditRoles (should be true for developers):",
    isAdmin || isDeveloper
  );
  console.log("- userRole from useUserRole context:", {
    isDeveloper,
    isAdmin,
    isManager,
    isConsultant,
  });

  // Early return if auth is not loaded yet
  if (!isLoaded) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center space-y-4">
          <p>Loading authentication...</p>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle unauthenticated users
  if (!userId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-gray-600">
            Please sign in to access the staff management page.
          </p>
          <Button onClick={() => (window.location.href = "/sign-in")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (value: string) => {
    setSelectedRole(value);
    setCurrentPage(1);
  };

  const handleManagerFilter = (value: string) => {
    setSelectedManager(value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    console.log("🔄 Refreshing and clearing all caches...");
    // Clear Apollo cache completely and refetch
    apolloClient.cache.reset().then(() => {
      console.log("✅ Apollo cache cleared");
      // Force a hard refresh of queries
      refetch({ fetchPolicy: "cache-and-network" });
    });
    setCurrentPage(1);
  };

  // Emergency cache clear function
  const handleEmergencyCacheClear = () => {
    console.log("🚨 Emergency cache clear initiated...");

    // Clear all Apollo cache
    apolloClient.cache.reset();

    // Clear browser storage to remove any cached invalid data
    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
        sessionStorage.clear();

        // Also clear any Apollo-specific cache in storage
        Object.keys(localStorage).forEach((key) => {
          if (
            key.startsWith("apollo-cache-persist") ||
            key.startsWith("apollo")
          ) {
            localStorage.removeItem(key);
          }
        });

        console.log("✅ All caches and storage cleared");
        toast.success("Cache cleared successfully. Refreshing page...");

        // Force page reload after a brief delay
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        console.error("Error clearing cache:", error);
        toast.error("Error clearing cache. Please refresh manually.");
      }
    }
  };

  // Open edit modal and populate form
  const openEditModal = (staff: Staff) => {
    setEditingStaff(staff);
    setEditForm({
      name: staff.name || "",
      email: staff.email || "",
      username: staff.username || "",
      role: staff.role || "",
      manager_id: staff.manager_id || "no-manager",
      is_staff: staff.is_staff || false,
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (staff: Staff) => {
    setViewingStaff(staff);
    setIsViewModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingStaff(null);
    setEditForm({
      name: "",
      email: "",
      username: "",
      role: "",
      manager_id: "no-manager",
      is_staff: false,
    });
  };

  // Handle form input changes
  const handleFormChange = (
    field: keyof StaffEditForm,
    value: string | boolean
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save staff changes using the new API endpoint
  const saveStaffChanges = async () => {
    if (!editingStaff || (!isAdmin && !isDeveloper)) return;

    // Debug logging to catch invalid IDs
    console.log("🔍 saveStaffChanges called with editingStaff:", {
      id: editingStaff.id,
      name: editingStaff.name,
      clerk_user_id: editingStaff.clerk_user_id,
    });

    const isValidUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        editingStaff.id
      );
    if (!isValidUUID) {
      console.error(
        "❌ CRITICAL: Trying to save with invalid UUID:",
        editingStaff.id
      );
      toast.error("Error: Invalid staff ID format. Please refresh the page.");
      return;
    }

    setIsSavingEdit(true);
    try {
      // Use the new API endpoint that syncs with Clerk
      const response = await fetch("/api/staff/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffId: editingStaff.id,
          newRole: editForm.role,
          // Additional fields for comprehensive update
          name: editForm.name,
          email: editForm.email,
          username: editForm.username,
          is_staff: editForm.is_staff,
          manager_id: editForm.manager_id || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update staff member");
      }

      // Show success message with sync status
      const roleDisplay = roleMapping[editForm.role] || editForm.role;
      const syncMessage = result.clerkSynced
        ? `${editForm.name} updated successfully and synced with Clerk!`
        : `${editForm.name} updated successfully (database only - no Clerk account found)`;

      toast.success(syncMessage);

      // Refresh the staff list and close modal
      refetch();
      closeEditModal();
    } catch (error) {
      console.error("Error saving staff changes:", error);
      toast.error(
        `Failed to update staff member: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle staff deletion
  const handleDeleteStaff = (staff: Staff) => {
    setStaffToDelete(staff);
  };

  // Confirm staff deletion using the new API endpoint
  const confirmDeleteStaff = async () => {
    if (!staffToDelete || (!isAdmin && !isDeveloper)) {
      return;
    }

    // Debug logging to catch invalid IDs
    console.log("🔍 confirmDeleteStaff called with staffToDelete:", {
      id: staffToDelete.id,
      name: staffToDelete.name,
      clerk_user_id: staffToDelete.clerk_user_id,
    });

    const isValidUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        staffToDelete.id
      );
    if (!isValidUUID) {
      console.error(
        "❌ CRITICAL: Trying to delete with invalid UUID:",
        staffToDelete.id
      );
      toast.error("Error: Invalid staff ID format. Please refresh the page.");
      return;
    }

    try {
      // Use the new API endpoint instead of direct GraphQL mutation
      const response = await fetch("/api/staff/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffId: staffToDelete.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to deactivate user");
      }

      // Show success message with deactivation details
      const auditMessage = result.clerkDeleted
        ? `${staffToDelete.name} deactivated and removed from Clerk. Database records retained for audit.`
        : `${staffToDelete.name} deactivated in database. Database records retained for audit.`;

      toast.success(auditMessage);

      // Refresh the staff list
      refetch();

      // Reset state
      setStaffToDelete(null);
    } catch (error) {
      console.error("Error in confirmDeleteStaff:", error);
      toast.error(
        `Failed to deactivate user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Create Staff Modal Functions
  const openCreateModal = () => {
    console.log("🔵 openCreateModal called - opening modal");
    setCreateForm({
      email: "",
      firstName: "",
      lastName: "",
      role: "viewer",
      is_staff: true,
    });
    setCreateError("");
    setIsCreateModalOpen(true);
    console.log("🔵 Modal state set to open");
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm({
      email: "",
      firstName: "",
      lastName: "",
      role: "viewer",
      is_staff: true,
    });
    setCreateError("");
  };

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCreateForm({
      ...createForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreateRoleChange = (value: string) => {
    setCreateForm({ ...createForm, role: value });
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingStaff(true);
    setCreateError("");

    try {
      const token = await getToken({ template: "hasura" });

      // For non-developers, always create as staff member
      const staffStatus = isDeveloper ? createForm.is_staff : true;

      // Combine first and last name for the API
      const fullName =
        `${createForm.firstName.trim()} ${createForm.lastName.trim()}`.trim();

      const response = await fetch("/api/staff/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fullName, // API expects 'name' not firstName/lastName
          email: createForm.email,
          role: createForm.role,
          is_staff: staffStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to create staff member");

      toast.success(
        `Staff member ${createForm.firstName} ${createForm.lastName} created successfully!`
      );

      // Refresh the staff list and close modal
      refetch();
      closeCreateModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCreateError(err.message);
        toast.error(`Failed to create staff member: ${err.message}`);
      }
    } finally {
      setIsCreatingStaff(false);
    }
  };

  // Loading state with enhanced loading component
  if (userLoading || loading) {
    return (
      <ErrorBoundaryWrapper>
        <StaffLoading />
      </ErrorBoundaryWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">
                Error loading staff data: {error.message}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundaryWrapper>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isDeveloper ? "User Management (All Users)" : "Staff Management"}
            </h1>
            <p className="text-muted-foreground">
              {isDeveloper
                ? "Manage all users, roles, and permissions (Developer Access)"
                : "Manage staff members, roles, and permissions"}
            </p>
          </div>

          {isAdmin ||
            (isDeveloper && (
              <Button onClick={openCreateModal}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            ))}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isDeveloper ? "Total Users" : "Total Staff"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {isDeveloper
                  ? `${stats.active} staff, ${stats.inactive} non-staff`
                  : `${stats.active} active, ${stats.inactive} inactive`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Administrators
              </CardTitle>
              <Badge variant="destructive" className="h-6 px-2">
                {stats.orgAdmins}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.admins + stats.orgAdmins}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.admins} developers, {stats.orgAdmins} admins
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Managers</CardTitle>
              <Badge variant="default" className="h-6 px-2">
                {stats.managers}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.managers}</div>
              <p className="text-xs text-muted-foreground">Team oversight</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <Badge variant="secondary" className="h-6 px-2">
                {stats.consultants + stats.viewers}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.consultants + stats.viewers}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.consultants} consultants, {stats.viewers} viewers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedRole} onValueChange={handleRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Developers</SelectItem>
                  <SelectItem value="org_admin">Admins</SelectItem>
                  <SelectItem value="manager">Managers</SelectItem>
                  <SelectItem value="consultant">Consultants</SelectItem>
                  <SelectItem value="viewer">Viewers</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedManager}
                onValueChange={handleManagerFilter}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Managers</SelectItem>
                  {managers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCcw
                  className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              {isDeveloper && (
                <Button
                  variant="destructive"
                  onClick={handleEmergencyCacheClear}
                  size="sm"
                >
                  🚨 Emergency Cache Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isDeveloper
                ? `All Users (${filteredStaff.length})`
                : `Staff Members (${filteredStaff.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <div className="text-muted-foreground">
                          <User className="mx-auto h-8 w-8 mb-2" />
                          <p>
                            {isDeveloper
                              ? "No users found."
                              : "No staff found."}
                          </p>
                          <p className="text-sm">
                            {isAdmin ||
                              (isDeveloper &&
                                "Start by creating your first staff member.")}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredStaff.length)}{" "}
                  of {filteredStaff.length}{" "}
                  {isDeveloper ? "users" : "staff members"}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Staff Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={editForm.username}
                  onChange={(e) => handleFormChange("username", e.target.value)}
                  placeholder="Enter username (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value) => handleFormChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-manager">Manager</Label>
                <Select
                  value={editForm.manager_id}
                  onValueChange={(value) =>
                    handleFormChange(
                      "manager_id",
                      value === "no-manager" ? "" : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-manager">No Manager</SelectItem>
                    {staffList
                      .filter(
                        (staff) =>
                          staff.id !== editingStaff?.id &&
                          (staff.role === "manager" ||
                            staff.role === "admin" ||
                            staff.role === "org_admin")
                      )
                      .map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name} ({roleMapping[manager.role]})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-is-staff">Staff Status</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-is-staff"
                    checked={editForm.is_staff}
                    onCheckedChange={(checked) =>
                      handleFormChange("is_staff", !!checked)
                    }
                  />
                  <Label
                    htmlFor="edit-is-staff"
                    className="text-sm font-normal"
                  >
                    Is Staff Member
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeEditModal}>
                Cancel
              </Button>
              <Button onClick={saveStaffChanges} disabled={isSavingEdit}>
                {isSavingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Staff Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Staff Member Details</DialogTitle>
            </DialogHeader>
            {viewingStaff && (
              <div className="space-y-6 py-4">
                {/* Header with avatar */}
                <div className="flex items-center space-x-4">
                  {viewingStaff.image ? (
                    <img
                      src={viewingStaff.image}
                      alt={viewingStaff.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {viewingStaff.name}
                    </h3>
                    <Badge
                      variant={
                        viewingStaff.role === "admin"
                          ? "destructive"
                          : viewingStaff.role === "manager"
                          ? "default"
                          : viewingStaff.role === "consultant"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {roleMapping[viewingStaff.role] || viewingStaff.role}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{viewingStaff.email}</span>
                    </div>
                    {viewingStaff.username && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>@{viewingStaff.username}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Work Information */}
                <div className="space-y-3">
                  <h4 className="font-medium">Work Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Manager:</span>
                      <p className="font-medium">
                        {viewingStaff.manager?.name || "No manager assigned"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Staff Status:
                      </span>
                      <p className="font-medium">
                        {viewingStaff.is_staff ? "Staff Member" : "External"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* System Information */}
                <div className="space-y-3">
                  <h4 className="font-medium">System Information</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono text-xs">
                        {viewingStaff.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Clerk Account:
                      </span>
                      <Badge
                        variant={
                          viewingStaff.clerk_user_id ? "default" : "outline"
                        }
                      >
                        {viewingStaff.clerk_user_id
                          ? "Connected"
                          : "Not Connected"}
                      </Badge>
                    </div>
                    {viewingStaff.created_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>
                          {new Date(
                            viewingStaff.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
              {isAdmin ||
                (isDeveloper && viewingStaff && (
                  <Button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openEditModal(viewingStaff);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                  </Button>
                ))}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!staffToDelete}
          onOpenChange={(open) => !open && setStaffToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm User Deactivation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to deactivate {staffToDelete?.name}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <p className="text-sm font-medium mb-3">What will happen:</p>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>User will be marked as inactive in the database</li>
                <li>
                  User will be removed from Clerk (if they have an account)
                </li>
                <li>User will lose access immediately</li>
                <li>All historical data and logs will be preserved</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteStaff}>
                {isDeleting ? "Deactivating..." : "Deactivate User"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Create Staff Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create New Staff Member
              </DialogTitle>
            </DialogHeader>

            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{createError}</p>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={createForm.firstName}
                    onChange={handleCreateFormChange}
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={createForm.lastName}
                    onChange={handleCreateFormChange}
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={createForm.email}
                  onChange={handleCreateFormChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={handleCreateRoleChange}
                  defaultValue={createForm.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Developer</SelectItem>
                    <SelectItem value="org_admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Only show is_staff toggle to developers */}
              {isDeveloper && (
                <div className="space-y-2">
                  <Label htmlFor="is_staff">Staff Status</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_staff"
                      checked={createForm.is_staff}
                      onCheckedChange={(checked) =>
                        setCreateForm({ ...createForm, is_staff: !!checked })
                      }
                    />
                    <Label htmlFor="is_staff" className="text-sm font-normal">
                      Mark as staff member
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Staff members have access to internal systems and payroll
                  </p>
                </div>
              )}

              {/* Info for non-developers */}
              {!isDeveloper && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800 text-sm">
                    ℹ️ All users you create will automatically be marked as
                    staff members
                  </p>
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCreateModal}
                  disabled={isCreatingStaff}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingStaff}>
                  {isCreatingStaff ? "Creating..." : "Create Staff Member"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundaryWrapper>
  );
}
