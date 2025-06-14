// app/(dashboard)/clients/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  RefreshCw,
  Building2,
  Users,
  Calendar,
  DollarSign,
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
  Download,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

import { NotesListWithAdd } from "@/components/notes-list-with-add";
import { useSmartPolling } from "@/hooks/usePolling";
import { GET_CLIENTS_BY_ID } from "@/graphql/queries/clients/getClientById";
import { UPDATE_CLIENT } from "@/graphql/mutations/clients/updateClient";
import { DELETE_CLIENT } from "@/graphql/mutations/clients/deleteClient";
import { safeFormatDate } from "@/utils/date-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PayrollsTabLoading } from "@/components/ui/loading-states";

// Payroll status configuration (same as payrolls page)
const getStatusConfig = (status: string) => {
  const configs = {
    Implementation: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock,
      progress: 15,
    },
    Active: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      progress: 100,
    },
    Inactive: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: AlertTriangle,
      progress: 0,
    },
    draft: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: FileText,
      progress: 10,
    },
    "data-entry": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Calculator,
      progress: 30,
    },
    review: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Eye,
      progress: 50,
    },
    processing: {
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: RefreshCw,
      progress: 70,
    },
    "manager-review": {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: UserCheck,
      progress: 85,
    },
    approved: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      progress: 95,
    },
    submitted: {
      color: "bg-teal-100 text-teal-800 border-teal-200",
      icon: Upload,
      progress: 100,
    },
    paid: {
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: CheckCircle,
      progress: 100,
    },
    "on-hold": {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: AlertTriangle,
      progress: 60,
    },
    cancelled: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertTriangle,
      progress: 0,
    },
  };

  return configs[status as keyof typeof configs] || configs["Implementation"];
};

export default function ClientDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPayrolls, setSelectedPayrolls] = useState<string[]>([]);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    active: true,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // GraphQL operations
  const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(
    GET_CLIENTS_BY_ID,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      pollInterval: 60000,
    }
  );

  const [updateClient] = useMutation(UPDATE_CLIENT, {
    refetchQueries: [{ query: GET_CLIENTS_BY_ID, variables: { id } }],
  });

  const [deleteClient] = useMutation(DELETE_CLIENT, {
    onCompleted: () => {
      // Redirect to clients list after successful deletion
      window.location.href = "/clients";
    },
  });

  // Use smart polling hook
  useSmartPolling(
    { startPolling, stopPolling, refetch },
    {
      defaultInterval: 60000,
      pauseOnHidden: true,
      refetchOnVisible: true,
    }
  );

  if (loading) {
    return <PayrollsTabLoading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Client
        </h3>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const client = data?.clients_by_pk;

  if (!client) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Client Not Found
        </h3>
        <p className="text-gray-500 mb-4">
          The client you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/clients">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
        </Link>
      </div>
    );
  }

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount || 0);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return "Not set";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Transform payroll data (same as payrolls page)
  const transformPayrollData = (payrolls: any[]) => {
    return payrolls.map((payroll: any) => {
      const totalEmployees =
        payroll.payroll_dates?.reduce(
          (sum: number, date: any) => sum + (date.employee_count || 0),
          0
        ) || 0;

      return {
        ...payroll,
        employeeCount: totalEmployees,
        priority:
          totalEmployees > 50 ? "high" : totalEmployees > 20 ? "medium" : "low",
        progress: getStatusConfig(payroll.status || "Implementation").progress,
        lastUpdated: new Date(payroll.updated_at || payroll.created_at),
        lastUpdatedBy: payroll.userByPrimaryConsultantUserId?.name || "System",
      };
    });
  };

  // Handle payroll selection
  const handleSelectAll = (checked: boolean, payrolls: any[]) => {
    if (checked) {
      setSelectedPayrolls(payrolls.map((p: any) => p.id));
    } else {
      setSelectedPayrolls([]);
    }
  };

  const handleSelectPayroll = (payrollId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayrolls([...selectedPayrolls, payrollId]);
    } else {
      setSelectedPayrolls(selectedPayrolls.filter((id) => id !== payrollId));
    }
  };

  const handleDeleteClient = async () => {
    try {
      await deleteClient({
        variables: { id },
      });
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  // Handle opening edit dialog
  const handleEditClient = () => {
    setEditFormData({
      name: client.name || "",
      contact_person: client.contact_person || "",
      contact_email: client.contact_email || "",
      contact_phone: client.contact_phone || "",
      active: client.active ?? true,
    });
    setShowEditDialog(true);
  };

  // Handle closing edit dialog
  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setEditFormData({
      name: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      active: true,
    });
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle updating client
  const handleUpdateClient = async () => {
    if (!editFormData.name.trim()) return;

    setIsUpdating(true);
    try {
      await updateClient({
        variables: {
          id,
          name: editFormData.name.trim(),
          contactPerson: editFormData.contact_person.trim() || null,
          contactEmail: editFormData.contact_email.trim() || null,
          contactPhone: editFormData.contact_phone.trim() || null,
          active: editFormData.active,
        },
      });
      setShowEditDialog(false);
      // Optionally show success message
    } catch (error) {
      console.error("Error updating client:", error);
      // Optionally show error message
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate client statistics
  const activePayrolls =
    client.payrolls?.filter((p: any) => p.active)?.length || 0;
  const totalPayrolls = client.payrolls?.length || 0;
  const totalEmployees =
    client.payrolls?.reduce(
      (sum: number, p: any) => sum + (p.employee_count || 0),
      0
    ) || 0;
  const estimatedMonthlyValue =
    client.payrolls?.reduce(
      (sum: number, p: any) => sum + (p.estimated_monthly_value || 0),
      0
    ) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-500">Client Details & Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="w-4 h-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClient}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Client
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Client
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status and Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge
                  className={getStatusColor(
                    client.active ? "active" : "inactive"
                  )}
                >
                  {client.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CheckCircle
                className={`w-8 h-8 ${
                  client.active ? "text-green-600" : "text-gray-400"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Payrolls
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activePayrolls}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Employees
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalEmployees}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Value
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(estimatedMonthlyValue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 bg-indigo-100 shadow-md rounded-lg">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="payrolls"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
          >
            Payrolls ({totalPayrolls})
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
          >
            Notes
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Contact Person
                      </p>
                      <p className="text-sm text-gray-900">
                        {client.contact_person || "Not specified"}
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
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">
                        {client.contact_email || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">
                        {client.contact_phone || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Details */}
            <Card>
              <CardHeader>
                <CardTitle>Client Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">Created</p>
                    <p className="text-gray-900">
                      {safeFormatDate(client.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Last Updated</p>
                    <p className="text-gray-900">
                      {safeFormatDate(client.updated_at)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Total Payrolls</p>
                    <p className="text-gray-900">{totalPayrolls}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Active Payrolls</p>
                    <p className="text-gray-900">{activePayrolls}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payrolls Tab */}
        <TabsContent value="payrolls">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Client Payrolls</CardTitle>
                  <CardDescription>
                    Manage payrolls associated with {client.name}
                  </CardDescription>
                </div>
                <Link href={`/payrolls/new?client=${id}`}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payroll
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const transformedPayrolls = transformPayrollData(
                  client.payrolls || []
                );

                return (
                  <>
                    {/* Bulk Actions */}
                    {selectedPayrolls.length > 0 && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {selectedPayrolls.length} payroll
                              {selectedPayrolls.length > 1 ? "s" : ""} selected
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Export Selected
                            </Button>
                            <Button variant="outline" size="sm">
                              <Upload className="w-4 h-4 mr-2" />
                              Bulk Update
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPayrolls([])}
                            >
                              Clear Selection
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payrolls Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={
                                  selectedPayrolls.length ===
                                    transformedPayrolls.length &&
                                  transformedPayrolls.length > 0
                                }
                                onCheckedChange={(
                                  checked: boolean | "indeterminate"
                                ) =>
                                  handleSelectAll(
                                    checked as boolean,
                                    transformedPayrolls
                                  )
                                }
                              />
                            </TableHead>
                            <TableHead>Payroll</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Consultant</TableHead>
                            <TableHead>Employees</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transformedPayrolls.map((payroll: any) => {
                            const statusConfig = getStatusConfig(
                              payroll.status || "Implementation"
                            );
                            const StatusIcon = statusConfig.icon;

                            return (
                              <TableRow
                                key={payroll.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={selectedPayrolls.includes(
                                      payroll.id
                                    )}
                                    onCheckedChange={(
                                      checked: boolean | "indeterminate"
                                    ) =>
                                      handleSelectPayroll(
                                        payroll.id,
                                        checked as boolean
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <Link
                                      href={`/payrolls/${payroll.id}`}
                                      className="font-medium text-blue-600 hover:underline"
                                    >
                                      {payroll.name}
                                    </Link>
                                    <div className="text-sm text-gray-500">
                                      {/* Additional payroll info can go here */}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={statusConfig.color}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {payroll.status || "Implementation"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-gray-400" />
                                    <span>
                                      {payroll.userByPrimaryConsultantUserId
                                        ?.name || "Unassigned"}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span
                                      className={getPriorityColor(
                                        payroll.priority
                                      )}
                                    >
                                      {payroll.employeeCount}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div>{formatDate(payroll.lastUpdated)}</div>
                                    <div className="text-gray-500 text-xs">
                                      by {payroll.lastUpdatedBy}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="w-full max-w-[100px]">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                      <span>{payroll.progress}%</span>
                                    </div>
                                    <Progress
                                      value={payroll.progress}
                                      className="h-2"
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem asChild>
                                        <Link href={`/payrolls/${payroll.id}`}>
                                          <Eye className="w-4 h-4 mr-2" />
                                          View Details
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Payroll
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>

                      {transformedPayrolls.length === 0 && (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No payrolls found
                          </h3>
                          <p className="text-gray-500 mb-4">
                            This client doesn't have any payrolls yet. Create
                            the first one to get started.
                          </p>
                          <Link href={`/payrolls/new?client=${id}`}>
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Create First Payroll
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Client Notes
              </CardTitle>
              <CardDescription>
                Notes and comments about {client.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotesListWithAdd
                entityType="client"
                entityId={id}
                title=""
                description=""
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Client Dialog */}
      <Dialog open={showEditDialog} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Make changes to the client information. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="client-name">Client Name *</Label>
              <Input
                id="client-name"
                placeholder="Enter client name..."
                value={editFormData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("name", e.target.value)
                }
                className="mt-1"
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label htmlFor="contact-person">Contact Person</Label>
              <Input
                id="contact-person"
                placeholder="Enter contact person name..."
                value={editFormData.contact_person}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("contact_person", e.target.value)
                }
                className="mt-1"
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="Enter contact email..."
                value={editFormData.contact_email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("contact_email", e.target.value)
                }
                className="mt-1"
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input
                id="contact-phone"
                placeholder="Enter contact phone..."
                value={editFormData.contact_phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("contact_phone", e.target.value)
                }
                className="mt-1"
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={editFormData.active}
                onCheckedChange={(checked: boolean) =>
                  handleInputChange("active", checked)
                }
                disabled={isUpdating}
              />
              <Label
                htmlFor="active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active client
              </Label>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCloseEditDialog}
              disabled={isUpdating}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleUpdateClient}
              disabled={isUpdating || !editFormData.name.trim()}
            >
              {isUpdating ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{client.name}"? This action
              cannot be undone and will also remove all associated payrolls and
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Client
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
