"use client";

import {
  Search,
  Filter,
  Grid3X3,
  List,
  TableIcon,
  RefreshCw,
  Users,
  Eye,
  Edit,
  MoreHorizontal,
  X,
  ChevronDown,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Mail,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { PermissionGuard, CanCreate, CanUpdate, CanDelete, AdminOnly, ManagerOnly } from "@/components/auth/permission-guard";
import { InvitationManagement } from "@/components/staff/invitation-management";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StaffLoading } from "@/components/ui/smart-loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateUserModal } from "@/domains/users/components/create-user-modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePermissions } from "@/hooks/use-permissions";
import { useDynamicLoading } from "@/lib/hooks/use-dynamic-loading";
import { getRoleDisplayName, getRoleColor } from "@/lib/utils/role-utils";

type ViewMode = "cards" | "table" | "list";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  computedName?: string | null;
  email: string;
  role: string;
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

interface StaffStats {
  total: {
    active: number;
    inactive: number;
    locked: number;
    pending: number;
    staff: number;
  };
  recentChanges: Array<{
    id: string;
    firstName: string;
    lastName: string;
    computedName?: string | null;
    email: string;
    role: string;
    status: string;
    statusChangedAt: string;
    statusChangeReason: string;
  }>;
  roleDistribution: Record<string, number>;
}

// Custom MultiSelect Component
interface MultiSelectProps {
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder: string;
}

function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onSelectionChange(newSelected);
  };

  const selectedLabels = options
    .filter(option => selected.includes(option.value))
    .map(option => option.label);

  const displayText =
    selectedLabels.length > 0
      ? selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} selected`
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayText}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="max-h-60 overflow-auto">
          {options.map(option => (
            <div
              key={option.value}
              className="flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer"
              onClick={() => handleToggle(option.value)}
            >
              <Checkbox
                checked={selected.includes(option.value)}
                onChange={() => handleToggle(option.value)}
              />
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function StaffPage() {
  const { currentUser, loading: userLoading } = useCurrentUser();
  const { can, isAtLeast } = usePermissions();

  // State management
  const [activeTab, setActiveTab] = useState("staff");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Data state
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [allUsers, setAllUsers] = useState<StaffMember[]>([]);
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [allUsersStats, setAllUsersStats] = useState<StaffStats | null>(null);
  const [invitationStats, setInvitationStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [allUsersTotalCount, setAllUsersTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Filter options
  const roleOptions = [
    { value: "developer", label: "Developer" },
    { value: "org_admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "consultant", label: "Consultant" },
    { value: "viewer", label: "Viewer" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "locked", label: "Locked" },
    { value: "pending", label: "Pending" },
  ];

  // Fetch invitation stats
  const fetchInvitationStats = async () => {
    try {
      const response = await fetch('/api/invitations/stats');
      const data = await response.json();
      
      if (data.success) {
        setInvitationStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch invitation stats:', error);
    }
  };

  // Fetch staff data
  const fetchStaff = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build request body instead of URL parameters
      const requestBody = {
        page: currentPage,
        limit: pageSize,
        includeStats: true,
        filters: {
          ...(searchTerm && { search: searchTerm }),
          ...(roleFilter.length > 0 && { roles: roleFilter }),
          ...(statusFilter.length > 0 && { statuses: statusFilter }),
        }
      };

      const response = await fetch(`/api/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (data.success) {
        setStaff(data.data.users || []);
        setTotalCount(data.data.total || 0);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      } else {
        setError(data.error || "Failed to fetch staff");
      }
    } catch (err) {
      setError("Failed to fetch staff");
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users data (developer only)
  const fetchAllUsers = async () => {
    setAllUsersLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        includeStats: "true",
        includeNonStaff: "true", // This will tell the API to include non-staff users
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (roleFilter.length > 0) {
        params.append("roles", roleFilter.join(","));
      }
      if (statusFilter.length > 0) {
        params.append("statuses", statusFilter.join(","));
      }

      const response = await fetch(`/api/staff?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setAllUsers(data.data.users || []);
        setAllUsersTotalCount(data.data.total || 0);
        if (data.data.stats) {
          setAllUsersStats(data.data.stats);
        }
      } else {
        setError(data.error || "Failed to fetch all users");
      }
    } catch (err) {
      setError("Failed to fetch all users");
      console.error("Error fetching all users:", err);
    } finally {
      setAllUsersLoading(false);
    }
  };

  // Fetch invitation stats on component mount only
  useEffect(() => {
    fetchInvitationStats();
  }, []);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    if (activeTab === "staff") {
      fetchStaff();
    } else if (activeTab === "all-users" && isAtLeast('developer')) {
      fetchAllUsers();
    }
  }, [activeTab, currentPage, pageSize, searchTerm, roleFilter, statusFilter]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter([]);
    setStatusFilter([]);
    setCurrentPage(1);
  };

  // Check if filters are active
  const hasActiveFilters =
    searchTerm || roleFilter.length > 0 || statusFilter.length > 0;
  const filterCount = roleFilter.length + statusFilter.length;

  // Handle role update
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/staff/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        // Refresh the staff list
        fetchStaff();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update role");
      }
    } catch (err) {
      setError("Failed to update role");
      console.error("Error updating role:", err);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (
    userId: string,
    newStatus: string,
    reason: string
  ) => {
    try {
      const response = await fetch(`/api/staff/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, reason }),
      });

      if (response.ok) {
        // Refresh the staff list
        fetchStaff();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update status");
      }
    } catch (err) {
      setError("Failed to update status");
      console.error("Error updating status:", err);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (userLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard resource="staff" action="read" fallback={
      <div className="container mx-auto py-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-12 text-center">
            <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-red-800">
              Access Denied
            </h3>
            <p className="text-red-600">
              You don't have permission to view staff management. Contact your administrator for access.
            </p>
          </CardContent>
        </Card>
      </div>
    }>
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Staff Management
          </h1>
          <p className="text-muted-foreground">
            Manage team members, roles, and permissions
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStaff}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <CanCreate resource="staff">
            <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </CanCreate>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${isAtLeast('developer') ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Staff Members
          </TabsTrigger>
          {isAtLeast('developer') && (
            <TabsTrigger value="all-users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              All Users
            </TabsTrigger>
          )}
          <PermissionGuard resource="invitations" action="read">
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Invitations
            </TabsTrigger>
          </PermissionGuard>
        </TabsList>

        {/* Staff Tab Content */}
        <TabsContent value="staff" className="space-y-6">

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total.staff}</div>
              <p className="text-xs text-muted-foreground">
                Active team members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total.active}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inactive Users
              </CardTitle>
              <ShieldAlert className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total.inactive}</div>
              <p className="text-xs text-muted-foreground">
                Temporarily inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Invitations
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invitationStats?.overview?.pending || invitationStats?.pending || 0}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting acceptance
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  className="pl-10 w-full max-w-sm"
                />
              </div>

              {/* Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filterCount}
                  </Badge>
                )}
              </Button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <TableIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Roles</label>
                <MultiSelect
                  options={roleOptions}
                  selected={roleFilter}
                  onSelectionChange={setRoleFilter}
                  placeholder="All roles"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <MultiSelect
                  options={statusOptions}
                  selected={statusFilter}
                  onSelectionChange={setStatusFilter}
                  placeholder="All statuses"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <ShieldAlert className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Area */}
      <div>
        {loading ? (
          <StaffLoading />
        ) : staff.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No staff members found
              </h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your filters or search terms"
                  : "Get started by adding your first staff member"}
              </p>
              {!hasActiveFilters && (
                <CanCreate resource="staff">
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Staff Member
                  </Button>
                </CanCreate>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Staff Content based on view mode */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map(member => (
                  <StaffCard
                    key={member.id}
                    member={member}
                    onRoleUpdate={handleRoleUpdate}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}

            {viewMode === "table" && (
              <StaffTable
                staff={staff}
                onRoleUpdate={handleRoleUpdate}
                onStatusUpdate={handleStatusUpdate}
              />
            )}

            {viewMode === "list" && (
              <div className="space-y-2">
                {staff.map(member => (
                  <StaffListItem
                    key={member.id}
                    member={member}
                    onRoleUpdate={handleRoleUpdate}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
                  staff members
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </TabsContent>

      {/* All Users Tab Content - Developer Only */}
      {isAtLeast('developer') && (
        <TabsContent value="all-users" className="space-y-6">
          {/* Stats Cards for All Users */}
          {allUsersStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allUsersTotalCount}</div>
                  <p className="text-xs text-muted-foreground">
                    All users in system
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Staff Users</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allUsersStats.total.staff}</div>
                  <p className="text-xs text-muted-foreground">Staff members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Non-Staff Users</CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allUsersTotalCount - allUsersStats.total.staff}</div>
                  <p className="text-xs text-muted-foreground">Non-staff users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allUsersStats.total.active}</div>
                  <p className="text-xs text-muted-foreground">Currently active</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Same filters as staff tab */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search all users..."
                      value={searchTerm}
                      onChange={e => handleSearch(e.target.value)}
                      className="pl-10 w-full max-w-sm"
                    />
                  </div>

                  {/* Filter Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {filterCount}
                      </Badge>
                    )}
                  </Button>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "cards" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    <TableIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Expandable Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Roles</label>
                    <MultiSelect
                      options={roleOptions}
                      selected={roleFilter}
                      onSelectionChange={setRoleFilter}
                      placeholder="All roles"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <MultiSelect
                      options={statusOptions}
                      selected={statusFilter}
                      onSelectionChange={setStatusFilter}
                      placeholder="All statuses"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <ShieldAlert className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-red-800">{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="ml-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Area for All Users */}
          <div>
            {allUsersLoading ? (
              <StaffLoading />
            ) : allUsers.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {hasActiveFilters
                      ? "Try adjusting your filters or search terms"
                      : "No users exist in the system"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* All Users Content based on view mode */}
                {viewMode === "cards" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allUsers.map(member => (
                      <StaffCard
                        key={member.id}
                        member={member}
                        onRoleUpdate={handleRoleUpdate}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </div>
                )}

                {viewMode === "table" && (
                  <StaffTable
                    staff={allUsers}
                    onRoleUpdate={handleRoleUpdate}
                    onStatusUpdate={handleStatusUpdate}
                  />
                )}

                {viewMode === "list" && (
                  <div className="space-y-2">
                    {allUsers.map(member => (
                      <StaffListItem
                        key={member.id}
                        member={member}
                        onRoleUpdate={handleRoleUpdate}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination for All Users */}
                {Math.ceil(allUsersTotalCount / pageSize) > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, allUsersTotalCount)} of {allUsersTotalCount}{" "}
                      users
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {Math.ceil(allUsersTotalCount / pageSize)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === Math.ceil(allUsersTotalCount / pageSize)}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      )}

      {/* Invitations Tab Content */}
      <TabsContent value="invitations" className="space-y-6">
        <PermissionGuard resource="invitations" action="read">
          <InvitationManagement embedded={true} />
        </PermissionGuard>
      </TabsContent>
      </Tabs>

      {/* Create Staff Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          // Refresh the appropriate data based on active tab
          if (activeTab === "staff") {
            fetchStaff();
          } else if (activeTab === "all-users") {
            fetchAllUsers();
          }
          fetchInvitationStats(); // Refresh invitation stats
        }}
      />
    </div>
    </PermissionGuard>
  );
}

// Staff Card Component
function StaffCard({
  member,
  onRoleUpdate,
  onStatusUpdate,
}: {
  member: StaffMember;
  onRoleUpdate: (userId: string, role: string) => void;
  onStatusUpdate: (userId: string, status: string, reason: string) => void;
}) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "developer":
        return "bg-purple-100 text-purple-800";
      case "org_admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "consultant":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{member.computedName || `${member.firstName} ${member.lastName}`}</CardTitle>
              {member.isStaff ? (
                <Badge className="bg-blue-100 text-blue-800">Staff</Badge>
              ) : (
                <Badge variant="outline" className="text-gray-600">Non-Staff</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/staff/${member.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <PermissionGuard resource="staff" action="update">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit User
                </DropdownMenuItem>
              </PermissionGuard>
              <ManagerOnly>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-orange-600"
                  onClick={() =>
                    onStatusUpdate(
                      member.id,
                      "inactive",
                      "Deactivated via staff management"
                    )
                  }
                >
                  Deactivate
                </DropdownMenuItem>
              </ManagerOnly>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Role</span>
            <Badge className={getRoleColor(member.role)}>
              {getRoleDisplayName(member.role)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <Badge className={getStatusColor(member.isActive)}>
              {member.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          {member.managerUser && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Manager</span>
              <span className="text-sm font-medium">
                {member.managerUser.computedName || `${member.managerUser.firstName} ${member.managerUser.lastName}`}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Joined</span>
            <span className="text-sm">
              {new Date(member.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Staff Table Component (placeholder)
function StaffTable({
  staff,
  onRoleUpdate,
  onStatusUpdate,
}: {
  staff: StaffMember[];
  onRoleUpdate: (userId: string, role: string) => void;
  onStatusUpdate: (userId: string, status: string, reason: string) => void;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Manager</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(member => (
                <tr
                  key={member.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="font-medium">{member.computedName || `${member.firstName} ${member.lastName}`}</div>
                  </td>
                  <td className="p-4 text-gray-600">{member.email}</td>
                  <td className="p-4">
                    <Badge className={getRoleColor(member.role)}>
                      {getRoleDisplayName(member.role)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={member.isActive ? "default" : "secondary"}>
                      {member.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-600">
                    {member.managerUser?.computedName || (member.managerUser ? `${member.managerUser.firstName} ${member.managerUser.lastName}` : "No manager")}
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/staff/${member.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <PermissionGuard resource="staff" action="update">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Staff List Item Component (placeholder)
function StaffListItem({
  member,
  onRoleUpdate,
  onStatusUpdate,
}: {
  member: StaffMember;
  onRoleUpdate: (userId: string, role: string) => void;
  onStatusUpdate: (userId: string, status: string, reason: string) => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <div className="font-medium">{member.computedName || `${member.firstName} ${member.lastName}`}</div>
              <div className="text-sm text-gray-500">{member.email}</div>
            </div>
            <Badge className={getRoleColor(member.role)}>{getRoleDisplayName(member.role)}</Badge>
            <Badge variant={member.isActive ? "default" : "secondary"}>
              {member.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/staff/${member.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <PermissionGuard resource="staff" action="update">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit User
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

export default StaffPage;
