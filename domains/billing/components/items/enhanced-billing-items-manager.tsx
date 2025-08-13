"use client";

import { useQuery, useMutation } from "@apollo/client";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileText, 
  Users, 
  Building2, 
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GetAllBillingItemsWithDetailsDocument,
  GetClientsForBillingDocument,
  UpdateBillingItemStatusDocument,
  DeleteBillingItemDocument,
  type GetAllBillingItemsWithDetailsQuery,
  type GetClientsForBillingQuery,
} from "../../graphql/generated/graphql";
import { BillingItemForm } from "./billing-item-form";
import { formatAUD, formatAustralianDate } from "@/lib/utils/australian-formatting";
import { useCurrentUser } from "@/hooks/use-current-user";

// Types
type BillingItem = NonNullable<GetAllBillingItemsWithDetailsQuery['billingItems']>[0];

interface EnhancedBillingItemsManagerProps {
  className?: string;
}

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: FileText },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  invoiced: { label: "Invoiced", color: "bg-blue-100 text-blue-800", icon: FileText },
} as const;

export function EnhancedBillingItemsManager({ className = "" }: EnhancedBillingItemsManagerProps) {
  const { currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "draft" | "approved">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [statusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BillingItem | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>("");

  // GraphQL queries
  const { data: billingData, loading, refetch } = useQuery<GetAllBillingItemsWithDetailsQuery>(
    GetAllBillingItemsWithDetailsDocument,
    {
      pollInterval: 30000, // Poll every 30 seconds for real-time updates
    }
  );

  const { data: clientsData } = useQuery<GetClientsForBillingQuery>(GetClientsForBillingDocument);

  // GraphQL mutations
  const [updateStatus] = useMutation(UpdateBillingItemStatusDocument);
  const [deleteItem] = useMutation(DeleteBillingItemDocument);

  const billingItems = billingData?.billingItems || [];
  const clients = clientsData?.clients || [];

  // Filter billing items
  const filteredItems = useMemo(() => {
    return billingItems.filter(item => {
      const matchesSearch = 
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClient = clientFilter === "all" || item.clientId === clientFilter;
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      const matchesTab = activeTab === "all" || 
        (activeTab === "pending" && item.status === "pending") ||
        (activeTab === "draft" && item.status === "draft") ||
        (activeTab === "approved" && (item.status === "approved" || item.status === "invoiced"));

      // Date range filtering
      let matchesDate = true;
      if (dateRange !== "all" && item.createdAt) {
        const itemDate = new Date(item.createdAt);
        const now = new Date();
        const daysSinceCreated = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (dateRange) {
          case "today":
            matchesDate = daysSinceCreated === 0;
            break;
          case "week":
            matchesDate = daysSinceCreated <= 7;
            break;
          case "month":
            matchesDate = daysSinceCreated <= 30;
            break;
        }
      }

      return matchesSearch && matchesClient && matchesStatus && matchesTab && matchesDate;
    });
  }, [billingItems, searchTerm, clientFilter, statusFilter, activeTab, dateRange]);

  // Statistics
  const stats = useMemo(() => {
    const totalAmount = filteredItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const pendingCount = billingItems.filter(item => item.status === "pending").length;
    const draftCount = billingItems.filter(item => item.status === "draft").length;
    const approvedCount = billingItems.filter(item => 
      item.status === "approved" || item.status === "invoiced"
    ).length;

    return {
      totalItems: filteredItems.length,
      totalAmount,
      pendingCount,
      draftCount,
      approvedCount,
    };
  }, [filteredItems, billingItems]);

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      await updateStatus({
        variables: {
          id: itemId,
          status: newStatus,
          ...(newStatus === "approved" && { 
            approvedBy: currentUser?.id,
            approvalDate: "now()" 
          }),
        },
      });
      toast.success(`Item ${newStatus} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  const handleDeleteItem = async (item: BillingItem) => {
    if (!confirm(`Delete billing item "${item.description}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteItem({
        variables: { id: item.id },
      });
      toast.success("Billing item deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete item: ${error.message}`);
    }
  };

  const handleCreateItem = () => {
    setSelectedClient("");
    setIsCreateDialogOpen(true);
  };

  const handleEditItem = (item: BillingItem) => {
    setSelectedItem(item);
    setSelectedClient(item.clientId || "");
    setIsEditDialogOpen(true);
  };

  const handleItemSaved = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setSelectedClient("");
    refetch();
  };

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground opacity-60">Loading billing items...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Billing Items</h2>
          <p className="text-foreground opacity-60">
            Manage and track all billing items across clients and services
          </p>
        </div>
        <Button onClick={handleCreateItem} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          New Billing Item
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <FileText className="h-4 w-4 text-foreground opacity-60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-foreground opacity-60">
              {formatAUD(stats.totalAmount)} total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</div>
            <p className="text-xs text-foreground opacity-60">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Items</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draftCount}</div>
            <p className="text-xs text-foreground opacity-60">
              Not submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedCount}</div>
            <p className="text-xs text-foreground opacity-60">
              Ready for invoicing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pendingCount})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({stats.draftCount})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({stats.approvedCount})</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground opacity-60" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>

            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Billing Items Table */}
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service & Description</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-foreground opacity-60">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            {searchTerm || clientFilter !== "all" || dateRange !== "all"
                              ? "No billing items match your filters"
                              : "No billing items found"
                            }
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item) => {
                        const statusConfig = getStatusConfig(item.status || "draft");
                        const StatusIcon = statusConfig.icon;

                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {item.service?.name || "Manual Item"}
                                </div>
                                <div className="text-sm text-foreground opacity-60">
                                  {item.description}
                                </div>
                                {item.service?.serviceCode && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.service.serviceCode}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-foreground opacity-60" />
                                <span className="font-medium">{item.client?.name}</span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-foreground opacity-60" />
                                <span>{item.staffUser?.computedName || "Unknown"}</span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-green-600">
                                  {formatAUD(item.amount || 0)}
                                </div>
                                {item.quantity && item.unitPrice && (
                                  <div className="text-xs text-foreground opacity-60">
                                    {item.quantity} × {formatAUD(item.unitPrice)}
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="text-sm">
                                {item.createdAt ? formatAustralianDate(item.createdAt, "business") : "—"}
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  {item.status === "draft" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(item.id, "pending")}>
                                      <Clock className="h-4 w-4 mr-2" />
                                      Submit for Approval
                                    </DropdownMenuItem>
                                  )}
                                  {item.status === "pending" && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleStatusChange(item.id, "approved")}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusChange(item.id, "rejected")}>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteItem(item)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Billing Item Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Billing Item</DialogTitle>
            <DialogDescription>
              Create a billing item based on assigned client services
            </DialogDescription>
          </DialogHeader>
          <BillingItemForm
            mode="create"
            clientId={selectedClient}
            onSave={handleItemSaved}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Billing Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Billing Item</DialogTitle>
            <DialogDescription>
              Update billing item details and pricing
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <BillingItemForm
              mode="edit"
              itemId={selectedItem.id}
              clientId={selectedClient}
              initialData={selectedItem}
              onSave={handleItemSaved}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}