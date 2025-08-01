"use client";

import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  TableIcon,
  RefreshCw,
  Calendar,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  MoreHorizontal,
  X,
  ChevronDown,
  FileText,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
// PermissionGuard imported on-demand
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
// Select components imported on-demand
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDynamicLoading } from "@/lib/hooks/use-dynamic-loading";
import { getRoleAndPositionDisplay, getRoleColor } from "@/lib/utils/role-utils";

// Create loading component for leave
function LeaveLoading() {
  const { Loading } = useDynamicLoading({
    title: 'Loading Leave Requests...',
    description: 'Fetching leave data and status information'
  });
  return <Loading variant="minimal" />;
}

type ViewMode = "cards" | "table" | "list";

interface LeaveRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  leaveType: "Annual" | "Sick" | "Unpaid" | "Other";
  reason?: string;
  status: "Pending" | "Approved" | "Rejected";
  employee: {
    id: string;
    firstName?: string;
    lastName?: string;
    computedName?: string;
    email?: string;
    role?: string;
    position?: string;
    manager?: {
      id: string;
      firstName?: string;
      lastName?: string;
      computedName?: string;  
      email: string;
    } | null;
  };
}

interface LeaveStats {
  overview: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    currentLeave: number;
    upcomingLeave: number;
  };
  byType: {
    annual: number;
    sick: number;
    unpaid: number;
    other: number;
  };
  recent: LeaveRequest[];
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

function LeavePage() {
  const { currentUser, loading: userLoading } = useCurrentUser();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Data state
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState<LeaveStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Filter options
  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  const typeOptions = [
    { value: "Annual", label: "Annual Leave" },
    { value: "Sick", label: "Sick Leave" },
    { value: "Unpaid", label: "Unpaid Leave" },
    { value: "Other", label: "Other" },
  ];

  // Check if user is manager - can view team leave
  const isManager = currentUser?.role && ["manager", "org_admin", "developer"].includes(currentUser.role);

  // Fetch leave requests data
  const fetchLeaveRequests = async () => {
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
      if (typeFilter.length > 0) {
        params.append("types", typeFilter.join(","));
      }

      const response = await fetch(`/api/leave?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setLeaveRequests(data.data.leave || []);
        setTotalCount(data.data.total || 0);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      } else {
        setError(data.error || "Failed to fetch leave requests");
      }
    } catch (err) {
      setError("Failed to fetch leave requests");
      console.error("Error fetching leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchLeaveRequests();
  }, [currentPage, pageSize, searchTerm, statusFilter, typeFilter]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setTypeFilter([]);
    setCurrentPage(1);
  };

  // Check if filters are active
  const hasActiveFilters = searchTerm || statusFilter.length > 0 || typeFilter.length > 0;
  const filterCount = statusFilter.length + typeFilter.length;

  // Handle leave approval/rejection (managers only)
  const handleApproveLeave = async (leaveId: string) => {
    try {
      const response = await fetch(`/api/leave/${leaveId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "approve" }),
      });

      if (response.ok) {
        fetchLeaveRequests();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to approve leave request");
      }
    } catch (err) {
      setError("Failed to approve leave request");
      console.error("Error approving leave:", err);
    }
  };

  const handleRejectLeave = async (leaveId: string) => {
    try {
      const response = await fetch(`/api/leave/${leaveId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "reject" }),
      });

      if (response.ok) {
        fetchLeaveRequests();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to reject leave request");
      }
    } catch (err) {
      setError("Failed to reject leave request");
      console.error("Error rejecting leave:", err);
    }
  };

  // Handle view leave details
  const handleViewDetails = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">
            {isManager 
              ? "Manage leave requests for your team and yourself"
              : "View and manage your leave requests"
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLeaveRequests}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/leave/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.total}</div>
              <p className="text-xs text-muted-foreground">
                All leave requests
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
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.approved}</div>
              <p className="text-xs text-muted-foreground">
                Approved requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently on Leave</CardTitle>
              <CalendarDays className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.currentLeave}</div>
              <p className="text-xs text-muted-foreground">
                Active today
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
                  placeholder="Search leave requests..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t mt-4">
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
                <label className="text-sm font-medium mb-2 block">Leave Type</label>
                <MultiSelect
                  options={typeOptions}
                  selected={typeFilter}
                  onSelectionChange={setTypeFilter}
                  placeholder="All types"
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
            <LeaveLoading />
          </div>
        ) : leaveRequests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No leave requests found</h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your filters or search terms"
                  : "Get started by creating your first leave request"}
              </p>
              {!hasActiveFilters && (
                <Link href="/leave/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Request Leave
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Leave Content based on view mode */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leaveRequests.map((leave) => (
                  <LeaveCard
                    key={leave.id}
                    leave={leave}
                    onApprove={handleApproveLeave}
                    onReject={handleRejectLeave}
                    onViewDetails={handleViewDetails}
                    currentUser={currentUser}
                    isManager={isManager}
                  />
                ))}
              </div>
            )}

            {viewMode === "table" && (
              <LeaveTable
                leaveRequests={leaveRequests}
                onApprove={handleApproveLeave}
                onReject={handleRejectLeave}
                onViewDetails={handleViewDetails}
                currentUser={currentUser}
                isManager={isManager}
              />
            )}

            {viewMode === "list" && (
              <div className="space-y-2">
                {leaveRequests.map((leave) => (
                  <LeaveListItem
                    key={leave.id}
                    leave={leave}
                    onApprove={handleApproveLeave}
                    onReject={handleRejectLeave}
                    onViewDetails={handleViewDetails}
                    currentUser={currentUser}
                    isManager={isManager}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount} leave requests
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

      {/* Leave Details Modal */}
      {selectedLeave && (
        <LeaveDetailsModal
          leave={selectedLeave}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedLeave(null);
          }}
          onApprove={handleApproveLeave}
          onReject={handleRejectLeave}
          currentUser={currentUser}
          isManager={isManager}
        />
      )}
    </div>
  );
}

// Leave Card Component
function LeaveCard({ 
  leave, 
  onApprove, 
  onReject,
  onViewDetails,
  currentUser,
  isManager
}: { 
  leave: LeaveRequest;
  onApprove: (leaveId: string) => void;
  onReject: (leaveId: string) => void;
  onViewDetails: (leave: LeaveRequest) => void;
  currentUser: any;
  isManager: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Approved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Annual": return "bg-blue-100 text-blue-800";
      case "Sick": return "bg-orange-100 text-orange-800";
      case "Unpaid": return "bg-gray-100 text-gray-800";
      case "Other": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString();
    }
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const canManageLeave = isManager && leave.status === "Pending" && 
    (currentUser?.id === leave.employee?.manager?.id || currentUser?.role === "org_admin" || currentUser?.role === "developer");

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{leave.employee?.computedName ||
                                (leave.employee
                                  ? `${leave.employee.firstName || ''} ${leave.employee.lastName || ''}`.trim()
                                  : '') ||
                                'Unknown User'}</CardTitle>
            <p className="text-sm text-gray-500">{leave.employee?.email || 'No email'}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(leave)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {leave.userId === currentUser?.id && leave.status === "Pending" && (
                <DropdownMenuItem asChild>
                  <Link href={`/leave/${leave.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Request
                  </Link>
                </DropdownMenuItem>
              )}
              {canManageLeave && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onApprove(leave.id)}>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onReject(leave.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
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
            <Badge className={getStatusColor(leave.status)}>
              {leave.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Type</span>
            <Badge className={getTypeColor(leave.leaveType)}>
              {leave.leaveType}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Dates</span>
            <span className="text-sm font-medium">
              {formatDateRange(leave.startDate, leave.endDate)}
            </span>
          </div>
          {leave.reason && (
            <div>
              <span className="text-sm text-gray-500">Reason</span>
              <p className="text-sm mt-1 line-clamp-2">{leave.reason}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Leave ID</span>
            <span className="text-sm font-mono">
              {leave.id.slice(-8)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Leave Table Component
function LeaveTable({ 
  leaveRequests, 
  onApprove, 
  onReject,
  onViewDetails,
  currentUser,
  isManager
}: { 
  leaveRequests: LeaveRequest[];
  onApprove: (leaveId: string) => void;
  onReject: (leaveId: string) => void;
  onViewDetails: (leave: LeaveRequest) => void;
  currentUser: any;
  isManager: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4 font-medium">Employee</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Dates</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Leave ID</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((leave) => {
                const canManageLeave = isManager && leave.status === "Pending" && 
                  (currentUser?.id === leave.employee?.manager?.id || currentUser?.role === "org_admin" || currentUser?.role === "developer");

                return (
                  <tr key={leave.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{leave.employee?.computedName ||
                                (leave.employee
                                  ? `${leave.employee.firstName || ''} ${leave.employee.lastName || ''}`.trim()
                                  : '') ||
                                'Unknown User'}</div>
                      <div className="text-sm text-gray-500">{leave.employee?.email || 'No email'}</div>
                    </td>
                    <td className="p-4">
                      <Badge className="inline-flex items-center">
                        {leave.leaveType}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="text-sm">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={
                        leave.status === "Approved" ? "default" :
                        leave.status === "Pending" ? "secondary" : "destructive"
                      }>
                        {leave.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-600 font-mono">
                      {leave.id.slice(-8)}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(leave)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {canManageLeave && (
                            <>
                              <DropdownMenuItem onClick={() => onApprove(leave.id)}>
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => onReject(leave.id)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Leave List Item Component
function LeaveListItem({ 
  leave, 
  onApprove, 
  onReject,
  onViewDetails,
  currentUser,
  isManager
}: { 
  leave: LeaveRequest;
  onApprove: (leaveId: string) => void;
  onReject: (leaveId: string) => void;
  onViewDetails: (leave: LeaveRequest) => void;
  currentUser: any;
  isManager: boolean;
}) {
  const canManageLeave = isManager && leave.status === "Pending" && 
    (currentUser?.id === leave.employee?.manager?.id || currentUser?.role === "org_admin" || currentUser?.role === "developer");

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <div className="font-medium">{leave.employee?.computedName ||
                                (leave.employee
                                  ? `${leave.employee.firstName || ''} ${leave.employee.lastName || ''}`.trim()
                                  : '') ||
                                'Unknown User'}</div>
              <div className="text-sm text-gray-500">{leave.employee?.email || 'No email'}</div>
            </div>
            <Badge>{leave.leaveType}</Badge>
            <Badge variant={
              leave.status === "Approved" ? "default" :
              leave.status === "Pending" ? "secondary" : "destructive"
            }>
              {leave.status}
            </Badge>
            <div className="text-sm text-gray-500">
              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(leave)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {canManageLeave && (
                <>
                  <DropdownMenuItem onClick={() => onApprove(leave.id)}>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onReject(leave.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
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

// Leave Details Modal Component
function LeaveDetailsModal({ 
  leave, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject,
  currentUser,
  isManager
}: {
  leave: LeaveRequest;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (leaveId: string) => void;
  onReject: (leaveId: string) => void;
  currentUser: any;
  isManager: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Approved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Annual": return "bg-blue-100 text-blue-800";
      case "Sick": return "bg-orange-100 text-orange-800";
      case "Unpaid": return "bg-gray-100 text-gray-800";
      case "Other": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const canManageLeave = isManager && leave.status === "Pending" && 
    (currentUser?.id === leave.employee?.manager?.id || currentUser?.role === "org_admin" || currentUser?.role === "developer");

  const getDaysCount = () => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
          <DialogDescription>
            Detailed information for this leave request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Request Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Employee</label>
                <p className="text-lg font-medium">{leave.employee?.computedName ||
                                (leave.employee
                                  ? `${leave.employee.firstName || ''} ${leave.employee.lastName || ''}`.trim()
                                  : '') ||
                                'Unknown User'}</p>
                <p className="text-sm text-gray-500">{leave.employee?.email || 'No email'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Leave Type</label>
                <div className="mt-1">
                  <Badge className={getTypeColor(leave.leaveType)}>
                    {leave.leaveType}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(leave.status)}>
                    {leave.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Duration</label>
                <p className="text-lg">{getDaysCount()} days</p>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Leave Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="text-lg">{new Date(leave.startDate).toLocaleDateString('en-AU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">End Date</label>
                <p className="text-lg">{new Date(leave.endDate).toLocaleDateString('en-AU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </div>

          {/* Reason */}
          {leave.reason && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Reason</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{leave.reason}</p>
            </div>
          )}

          {/* Management Information */}
          {isManager && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Manager</label>
                  <p>{leave.employee?.manager?.computedName ||
                                (leave.employee?.manager
                                  ? `${leave.employee.manager.firstName || ''} ${leave.employee.manager.lastName || ''}`.trim()
                                  : '') ||
                                'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee Role & Position</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className={`${getRoleColor(leave.employee?.role || "")} px-2 py-1`}
                    >
                      {getRoleAndPositionDisplay(leave.employee?.role || "", leave.employee?.position)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leave Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Leave ID</label>
                <p className="font-mono">{leave.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="font-mono">{leave.userId}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {leave.userId === currentUser?.id && leave.status === "Pending" && (
                <Link href={`/leave/${leave.id}/edit`}>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Request
                  </Button>
                </Link>
              )}
              {canManageLeave && (
                <>
                  <Button 
                    onClick={() => {
                      onApprove(leave.id);
                      onClose();
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button 
                    onClick={() => {
                      onReject(leave.id);
                      onClose();
                    }}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
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

export default LeavePage;