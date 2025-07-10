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
  Eye,
  MoreHorizontal,
  X,
  Download,
  ChevronDown,
  Send,
  Trash2,
  RotateCcw,
} from "lucide-react";
import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffLoading } from "@/components/ui/smart-loading";
import { useDynamicLoading } from "@/lib/hooks/use-dynamic-loading";
import { getRoleDisplayNameUpper, getRoleColor } from "@/lib/utils/role-utils";

interface Invitation {
  id: string;
  email: string;
  invitedRole: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  invitedByUser?: {
    id: string;
    name: string;
    email: string;
  };
  acceptedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  revoked: number;
  expiringSoon: number;
}

type ViewMode = "cards" | "table" | "list";

interface InvitationManagementProps {
  embedded?: boolean; // Whether this is embedded in another page
}

export function InvitationManagement({ embedded = false }: InvitationManagementProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState<InvitationStats | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedUrgency, setSelectedUrgency] = useState<string[]>([]);
  const [selectedInvitations, setSelectedInvitations] = useState<string[]>([]);

  const { isLoading, error, refreshTrigger, handleRefresh } = useDynamicLoading({
    loadingStates: ["stats", "invitations"],
  });

  // Fetch invitations
  useEffect(() => {
    fetchInvitations();
    fetchStats();
  }, [refreshTrigger]);

  const fetchInvitations = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        ...(selectedStatuses.length > 0 && { statuses: selectedStatuses.join(",") }),
        ...(selectedRoles.length > 0 && { roles: selectedRoles.join(",") }),
        ...(selectedUrgency.length > 0 && { urgency: selectedUrgency.join(",") }),
      });

      const response = await fetch(`/api/invitations?${queryParams}`);
      const data = await response.json();

      console.log('Invitations API response:', data);

      if (data.success) {
        setInvitations(data.data?.invitations || []);
        console.log('Set invitations:', data.data?.invitations || []);
      } else {
        console.error('API error:', data.error);
      }
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
      // You could also set an error state here to show in the UI
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/invitations/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.stats || data.data?.stats);
      }
    } catch (error) {
      console.error("Failed to fetch invitation stats:", error);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiryDays: 7 }),
      });

      const result = await response.json();

      if (result.success) {
        fetchInvitations();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to resend invitation:", error);
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/revoke`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Revoked by administrator" }),
      });

      const result = await response.json();

      if (result.success) {
        fetchInvitations();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to revoke invitation:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case "revoked":
        return <Badge className="bg-gray-100 text-gray-800">Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      developer: "bg-purple-100 text-purple-800",
      org_admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      consultant: "bg-green-100 text-green-800",
      viewer: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={getRoleColor(role)}>
        {getRoleDisplayNameUpper(role)}
      </Badge>
    );
  };

  const getUrgencyBadge = (expiresAt: string) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry <= 1) {
      return <Badge className="bg-red-100 text-red-800">Critical - {daysUntilExpiry}d</Badge>;
    } else if (daysUntilExpiry <= 3) {
      return <Badge className="bg-orange-100 text-orange-800">High - {daysUntilExpiry}d</Badge>;
    } else if (daysUntilExpiry <= 7) {
      return <Badge className="bg-yellow-100 text-yellow-800">Medium - {daysUntilExpiry}d</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800">Low - {daysUntilExpiry}d</Badge>;
    }
  };

  const InvitationCard = ({ invitation }: { invitation: Invitation }) => (
    <Card key={invitation.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-medium">{invitation.email}</div>
            <div className="flex items-center gap-2">
              {getStatusBadge(invitation.status)}
              {getRoleBadge(invitation.invitedRole)}
              {invitation.status === "pending" && getUrgencyBadge(invitation.expiresAt)}
            </div>
          </div>
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
              {invitation.status === "pending" && (
                <>
                  <DropdownMenuItem onClick={() => handleResendInvitation(invitation.id)}>
                    <Send className="w-4 h-4 mr-2" />
                    Resend Invitation
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleRevokeInvitation(invitation.id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Revoke
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm text-gray-600 space-y-1">
          <div>Invited by: {invitation.invitedByUser?.name || 'System'}</div>
          <div>Created: {new Date(invitation.createdAt).toLocaleDateString()}</div>
          <div>Expires: {new Date(invitation.expiresAt).toLocaleDateString()}</div>
          {invitation.acceptedAt && (
            <div>Accepted: {new Date(invitation.acceptedAt).toLocaleDateString()}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <StaffLoading />;
  }

  console.log('Rendering invitations component with:', { 
    invitationsLength: invitations.length, 
    invitations: invitations.slice(0, 2),
    stats 
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invitation Management</h1>
            <p className="text-muted-foreground">
              Manage pending invitations and track invitation status
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expired}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expiringSoon}</div>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              </Button>
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
        </CardContent>
      </Card>

      {/* Content */}
      <div>
        <p className="text-sm text-gray-500 mb-4">
          Found {invitations.length} invitation(s) | Loading: {isLoading ? 'Yes' : 'No'}
        </p>
        <Button 
          onClick={async () => {
            try {
              const testResponse = await fetch('/api/invitations/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  role: 'viewer',
                  sendImmediately: false
                })
              });
              const result = await testResponse.json();
              console.log('Test invitation result:', result);
              if (result.success) {
                fetchInvitations();
              }
            } catch (err) {
              console.error('Test invitation error:', err);
            }
          }}
          variant="outline" 
          size="sm"
          className="mb-4"
        >
          Create Test Invitation
        </Button>
      </div>
      
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invitations.map((invitation) => (
            <InvitationCard key={invitation.id} invitation={invitation} />
          ))}
        </div>
      )}

      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Invited By</th>
                    <th className="p-4 font-medium">Expires</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((invitation) => (
                    <tr key={invitation.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{invitation.email}</td>
                      <td className="p-4">{getRoleBadge(invitation.invitedRole)}</td>
                      <td className="p-4">{getStatusBadge(invitation.status)}</td>
                      <td className="p-4">{invitation.invitedByUser?.name || 'System'}</td>
                      <td className="p-4">{new Date(invitation.expiresAt).toLocaleDateString()}</td>
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
                            {invitation.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleResendInvitation(invitation.id)}>
                                  <Send className="w-4 h-4 mr-2" />
                                  Resend
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleRevokeInvitation(invitation.id)}
                                >
                                  <X className="w-4 h-4 mr-2" />
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
      )}

      {invitations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No invitations found</h3>
            <p className="text-gray-600">No invitations match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}