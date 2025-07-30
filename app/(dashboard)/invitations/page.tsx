"use client";

import {
  Search,
  Filter,
  Grid3X3,
  List,
  TableIcon,
  RefreshCw,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  X,
  ChevronDown,
  UserPlus,
  Send,
  Eye,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateUserModal } from "@/domains/users/components/create-user-modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDynamicLoading } from "@/lib/hooks/use-dynamic-loading";
import { getRoleDisplayName, getRoleColor } from "@/lib/utils/role-utils";

// Create loading component for invitations
function InvitationsLoading() {
  const { Loading } = useDynamicLoading({
    title: 'Loading Invitations...',
    description: 'Fetching invitation status and history'
  });
  return <Loading variant="minimal" />;
}

type ViewMode = "cards" | "table" | "list";

interface InvitationMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  invitedRole: string;
  invitationStatus: "pending" | "accepted" | "expired" | "revoked";
  clerkInvitationId?: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  resendCount: number;
  lastResendAt?: string;
  revokeReason?: string;
  invitedByUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  managerUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  isExpired: boolean;
  isPending: boolean;
  daysUntilExpiry: number | null;
  urgency: "critical" | "high" | "medium" | "low" | null;
}

interface MonthlyStatItem {
  month: string;
  count: number;
  status?: string;
}

interface ExpiringSoonInvitation {
  id: string;
  email: string;
  fullName: string;
  daysUntilExpiry: number;
}

interface RecentActivityItem {
  id: string;
  action: string;
  email: string;
  timestamp: string;
  details?: string;
}

interface InvitationStats {
  overview: {
    total: number;
    pending: number;
    accepted: number;
    expired: number;
    revoked: number;
    expiringSoon: number;
  };
  trends: {
    statusDistribution: Record<string, number>;
    roleDistribution: Record<string, number>;
    monthlyStats: MonthlyStatItem[];
  };
  alerts: {
    expiringSoonCount: number;
    expiringSoonInvitations: ExpiringSoonInvitation[];
    overduePendingCount: number;
  };
  recentActivity: RecentActivityItem[];
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

function InvitationsPage() {
  const { currentUser: _currentUser, loading: userLoading } = useCurrentUser();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [urgencyFilter, setUrgencyFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationMember | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, _setPageSize] = useState(20);

  // Data state
  const [invitations, setInvitations] = useState<InvitationMember[]>([]);
  const [stats, setStats] = useState<InvitationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Filter options
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "expired", label: "Expired" },
    { value: "revoked", label: "Revoked" },
  ];

  const roleOptions = [
    { value: "developer", label: "Developer" },
    { value: "org_admin", label: "Organization Admin" },
    { value: "manager", label: "Manager" },
    { value: "consultant", label: "Consultant" },
    { value: "viewer", label: "Viewer" },
  ];

  const urgencyOptions = [
    { value: "critical", label: "Critical (≤1 day)" },
    { value: "high", label: "High (≤3 days)" },
    { value: "medium", label: "Medium (≤7 days)" },
    { value: "low", label: "Low (>7 days)" },
  ];

  // Fetch invitations data
  const fetchInvitations = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        includeStats: "true",
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (statusFilter.length > 0) {
        params.append("statuses", statusFilter.join(","));
      }
      if (roleFilter.length > 0) {
        params.append("roles", roleFilter.join(","));
      }
      if (urgencyFilter.length > 0) {
        params.append("urgency", urgencyFilter.join(","));
      }

      const response = await fetch(`/api/invitations?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setInvitations(data.data.invitations || []);
        setTotalCount(data.data.total || 0);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      } else {
        setError(data.error || "Failed to fetch invitations");
      }
    } catch (err) {
      setError("Failed to fetch invitations");
      console.error("Error fetching invitations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats separately if needed
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/invitations/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching invitation stats:", err);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchInvitations();
  }, [currentPage, pageSize, searchTerm, statusFilter, roleFilter, urgencyFilter]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setRoleFilter([]);
    setUrgencyFilter([]);
    setCurrentPage(1);
  };

  // Check if filters are active
  const hasActiveFilters = searchTerm || statusFilter.length > 0 || roleFilter.length > 0 || urgencyFilter.length > 0;
  const filterCount = statusFilter.length + roleFilter.length + urgencyFilter.length;

  // Handle invitation resend
  const handleResendInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Refresh the invitations list
        fetchInvitations();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to resend invitation");
      }
    } catch (err) {
      setError("Failed to resend invitation");
      console.error("Error resending invitation:", err);
    }
  };

  // Handle invitation revoke
  const handleRevokeInvitation = async (invitationId: string, reason: string) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/revoke`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        // Refresh the invitations list
        fetchInvitations();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to revoke invitation");
      }
    } catch (err) {
      setError("Failed to revoke invitation");
      console.error("Error revoking invitation:", err);
    }
  };

  // Handle view invitation details
  const handleViewDetails = (invitation: InvitationMember) => {
    setSelectedInvitation(invitation);
    setIsDetailsModalOpen(true);
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
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invitation Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage staff invitations and their status
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInvitations}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.total}</div>
              <p className="text-xs text-muted-foreground">
                All time invitations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.pending}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting acceptance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.accepted}</div>
              <p className="text-xs text-muted-foreground">
                Successfully joined
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.expiringSoon}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
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
                  placeholder="Search invitations..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
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
                <label className="text-sm font-medium mb-2 block">Status</label>
                <MultiSelect
                  options={statusOptions}
                  selected={statusFilter}
                  onSelectionChange={setStatusFilter}
                  placeholder="All statuses"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <MultiSelect
                  options={roleOptions}
                  selected={roleFilter}
                  onSelectionChange={setRoleFilter}
                  placeholder="All roles"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Urgency</label>
                <MultiSelect
                  options={urgencyOptions}
                  selected={urgencyFilter}
                  onSelectionChange={setUrgencyFilter}
                  placeholder="All urgencies"
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
              <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
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
          <div className="py-12">
            <InvitationsLoading />
          </div>
        ) : invitations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No invitations found</h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your filters or search terms"
                  : "Get started by sending your first invitation"}
              </p>
              {!hasActiveFilters && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Invitations Content based on view mode */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invitations.map((invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    onResend={handleResendInvitation}
                    onRevoke={handleRevokeInvitation}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}

            {viewMode === "table" && (
              <InvitationTable
                invitations={invitations}
                onResend={handleResendInvitation}
                onRevoke={handleRevokeInvitation}
                onViewDetails={handleViewDetails}
              />
            )}

            {viewMode === "list" && (
              <div className="space-y-2">
                {invitations.map((invitation) => (
                  <InvitationListItem
                    key={invitation.id}
                    invitation={invitation}
                    onResend={handleResendInvitation}
                    onRevoke={handleRevokeInvitation}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount} invitations
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

      {/* Invitation Details Modal */}
      {selectedInvitation && (
        <InvitationDetailsModal
          invitation={selectedInvitation}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedInvitation(null);
          }}
          onResend={handleResendInvitation}
          onRevoke={handleRevokeInvitation}
        />
      )}

      {/* Create Invitation Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchInvitations(); // Refresh the list
        }}
      />
    </div>
  );
}

// Invitation Card Component
function InvitationCard({ 
  invitation, 
  onResend, 
  onRevoke,
  onViewDetails 
}: { 
  invitation: InvitationMember;
  onResend: (invitationId: string) => void;
  onRevoke: (invitationId: string, reason: string) => void;
  onViewDetails: (invitation: InvitationMember) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "revoked": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "developer": return "bg-purple-100 text-purple-800";
      case "org_admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "consultant": return "bg-green-100 text-green-800";
      case "viewer": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{invitation.fullName}</CardTitle>
            <p className="text-sm text-gray-500">{invitation.email}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(invitation)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {invitation.invitationStatus === "pending" && (
                <>
                  <DropdownMenuItem onClick={() => onResend(invitation.id)}>
                    <Send className="w-4 h-4 mr-2" />
                    Resend Invitation
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onRevoke(invitation.id, "Revoked via invitation management")}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Revoke
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <Badge className={getStatusColor(invitation.invitationStatus)}>
              {invitation.invitationStatus}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Role</span>
            <Badge className={getRoleColor(invitation.invitedRole)}>
              {getRoleDisplayName(invitation.invitedRole)}
            </Badge>
          </div>
          {invitation.urgency && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Urgency</span>
              <Badge className={getUrgencyColor(invitation.urgency)}>
                {invitation.urgency}
              </Badge>
            </div>
          )}
          {invitation.invitedByUser && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Invited by</span>
              <span className="text-sm font-medium">{invitation.invitedByUser?.computedName || `${invitation.invitedByUser?.firstName || ''} ${invitation.invitedByUser?.lastName || ''}`.trim() || 'System'}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {invitation.invitationStatus === "pending" ? "Expires" : "Created"}
            </span>
            <span className="text-sm">
              {invitation.invitationStatus === "pending" 
                ? new Date(invitation.expiresAt).toLocaleDateString()
                : new Date(invitation.createdAt).toLocaleDateString()
              }
            </span>
          </div>
          {invitation.daysUntilExpiry !== null && invitation.daysUntilExpiry >= 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Days left</span>
              <span className={`text-sm font-medium ${
                invitation.daysUntilExpiry <= 1 ? "text-red-600" :
                invitation.daysUntilExpiry <= 3 ? "text-orange-600" :
                invitation.daysUntilExpiry <= 7 ? "text-yellow-600" : "text-green-600"
              }`}>
                {invitation.daysUntilExpiry}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Invitation Table Component
function InvitationTable({ 
  invitations, 
  onResend, 
  onRevoke,
  onViewDetails 
}: { 
  invitations: InvitationMember[];
  onResend: (invitationId: string) => void;
  onRevoke: (invitationId: string, reason: string) => void;
  onViewDetails: (invitation: InvitationMember) => void;
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
                <th className="text-left p-4 font-medium">Expires</th>
                <th className="text-left p-4 font-medium">Invited by</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{invitation.fullName}</div>
                  </td>
                  <td className="p-4 text-gray-600">{invitation.email}</td>
                  <td className="p-4">
                    <Badge className={getRoleColor(invitation.invitedRole)}>
                      {getRoleDisplayName(invitation.invitedRole)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={
                      invitation.invitationStatus === "accepted" ? "default" :
                      invitation.invitationStatus === "pending" ? "secondary" : "destructive"
                    }>
                      {invitation.invitationStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-600">
                    {invitation.invitationStatus === "pending" 
                      ? new Date(invitation.expiresAt).toLocaleDateString()
                      : "—"
                    }
                  </td>
                  <td className="p-4 text-gray-600">
                    {invitation.invitedByUser?.computedName || `${invitation.invitedByUser?.firstName || ''} ${invitation.invitedByUser?.lastName || ''}`.trim() || "System"}
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {invitation.invitationStatus === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => onResend(invitation.id)}>
                              <Send className="w-4 h-4 mr-2" />
                              Resend
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => onRevoke(invitation.id, "Revoked via invitation management")}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Revoke
                            </DropdownMenuItem>
                          </>
                        )}
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

// Invitation List Item Component
function InvitationListItem({ 
  invitation, 
  onResend, 
  onRevoke,
  onViewDetails 
}: { 
  invitation: InvitationMember;
  onResend: (invitationId: string) => void;
  onRevoke: (invitationId: string, reason: string) => void;
  onViewDetails: (invitation: InvitationMember) => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <div className="font-medium">{invitation.fullName}</div>
              <div className="text-sm text-gray-500">{invitation.email}</div>
            </div>
            <Badge className={getRoleColor(invitation.invitedRole)}>{getRoleDisplayName(invitation.invitedRole)}</Badge>
            <Badge variant={
              invitation.invitationStatus === "accepted" ? "default" :
              invitation.invitationStatus === "pending" ? "secondary" : "destructive"
            }>
              {invitation.invitationStatus}
            </Badge>
            {invitation.daysUntilExpiry !== null && invitation.daysUntilExpiry >= 0 && (
              <Badge variant="outline" className={
                invitation.daysUntilExpiry <= 1 ? "border-red-300 text-red-700" :
                invitation.daysUntilExpiry <= 3 ? "border-orange-300 text-orange-700" :
                invitation.daysUntilExpiry <= 7 ? "border-yellow-300 text-yellow-700" : ""
              }>
                {invitation.daysUntilExpiry}d left
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(invitation)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {invitation.invitationStatus === "pending" && (
                <>
                  <DropdownMenuItem onClick={() => onResend(invitation.id)}>
                    <Send className="w-4 h-4 mr-2" />
                    Resend Invitation
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onRevoke(invitation.id, "Revoked via invitation management")}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Revoke
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

// Invitation Details Modal Component
function InvitationDetailsModal({ 
  invitation, 
  isOpen, 
  onClose, 
  onResend, 
  onRevoke 
}: {
  invitation: InvitationMember;
  isOpen: boolean;
  onClose: () => void;
  onResend: (invitationId: string) => void;
  onRevoke: (invitationId: string, reason: string) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "revoked": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "developer": return "bg-purple-100 text-purple-800";
      case "org_admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "consultant": return "bg-green-100 text-green-800";
      case "viewer": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invitation Details</DialogTitle>
          <DialogDescription>
            Detailed information and actions for this invitation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-lg font-medium">{invitation.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-lg">{invitation.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Invited Role</label>
                <Badge className={getRoleColor(invitation.invitedRole)}>
                  {getRoleDisplayName(invitation.invitedRole)}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge className={getStatusColor(invitation.invitationStatus)}>
                  {invitation.invitationStatus}
                </Badge>
              </div>
              {invitation.urgency && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Urgency</label>
                  <Badge className={getUrgencyColor(invitation.urgency)}>
                    {invitation.urgency}
                  </Badge>
                </div>
              )}
              {invitation.managerId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Manager</label>
                  <p>{invitation.managerUser?.computedName || `${invitation.managerUser?.firstName || ''} ${invitation.managerUser?.lastName || ''}`.trim() || 'Not assigned'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p>{new Date(invitation.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p>{new Date(invitation.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Expires</label>
                <p className={`${
                  invitation.daysUntilExpiry !== null && invitation.daysUntilExpiry <= 3 
                    ? "text-red-600 font-medium" 
                    : ""
                }`}>
                  {new Date(invitation.expiresAt).toLocaleString()}
                  {invitation.daysUntilExpiry !== null && invitation.daysUntilExpiry >= 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({invitation.daysUntilExpiry} days left)
                    </span>
                  )}
                </p>
              </div>
              {invitation.acceptedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Accepted</label>
                  <p>{new Date(invitation.acceptedAt).toLocaleString()}</p>
                </div>
              )}
              {invitation.revokedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Revoked</label>
                  <p>{new Date(invitation.revokedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Invitation Management */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Invited By</label>
                <p>{invitation.invitedByUser?.computedName || `${invitation.invitedByUser?.firstName || ''} ${invitation.invitedByUser?.lastName || ''}`.trim() || 'System'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Resend Count</label>
                <p>{invitation.resendCount}</p>
              </div>
              {invitation.lastResendAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Resent</label>
                  <p>{new Date(invitation.lastResendAt).toLocaleString()}</p>
                </div>
              )}
              {invitation.revokeReason && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Revoke Reason</label>
                  <p className="text-red-600">{invitation.revokeReason}</p>
                </div>
              )}
              {invitation.clerkInvitationId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Clerk ID</label>
                  <p className="text-xs font-mono text-gray-600">{invitation.clerkInvitationId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {invitation.invitationStatus === "pending" && (
                <>
                  <Button 
                    onClick={() => {
                      onResend(invitation.id);
                      onClose();
                    }}
                    variant="outline"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Resend Invitation
                  </Button>
                  <Button 
                    onClick={() => {
                      onRevoke(invitation.id, "Revoked via details modal");
                      onClose();
                    }}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Revoke Invitation
                  </Button>
                </>
              )}
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InvitationsPage;