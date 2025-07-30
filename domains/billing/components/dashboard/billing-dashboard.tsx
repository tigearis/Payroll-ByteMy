'use client';

import { useQuery, useMutation } from '@apollo/client';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  FileText,
  TrendingUp,
  Filter,
  Download,
  Plus
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GetAllBillingItemsDocument,
  GetBillingItemsByClientDocument,
  GetPayrollProfitabilityDocument,
  UpdateBillingItemDocument,
  ConsolidateInvoicesDocument,
} from '../../graphql/generated/graphql';

interface BillingItem {
  id: string;
  clientId?: string | null;
  payrollId?: string | null;
  description?: string | null;
  serviceName?: string | null;
  quantity: number;
  amount?: number | null;
  totalAmount?: number | null;
  hourlyRate?: number | null;
  isApproved?: boolean | null;
  approvalDate?: string | null;
  confirmedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  client?: {
    id: string;
    name: string;
  } | null;
  payroll?: {
    id: string;
    name: string;
  } | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    computedName: string;
  } | null;
  approver?: {
    id: string;
    firstName: string;
    lastName: string;
    computedName: string;
  } | null;
}

interface DashboardFilters {
  isApproved?: boolean | undefined;
  clientId: string;
  dateRange: string;
  approvalStatus: string;
}

interface BillingDashboardProps {
  onItemClick?: (item: BillingItem) => void;
  onBulkAction?: (action: string, items: BillingItem[]) => void;
}

export const BillingDashboard: React.FC<BillingDashboardProps> = ({
  onItemClick,
  onBulkAction
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<DashboardFilters>({
    isApproved: undefined,
    clientId: '',
    dateRange: '30',
    approvalStatus: ''
  });

  // Calculate date range
  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(filters.dateRange || '30'));
    return { startDate, endDate };
  }, [filters.dateRange]);

  // Get billing items (get all items, then filter client-side)
  const { data: billingData, loading: billingLoading, refetch } = useQuery(
    GetAllBillingItemsDocument,
    {
      variables: { 
        limit: 500,
        offset: 0
      },
      fetchPolicy: 'cache-and-network'
    }
  );

  // Get profitability data
  const { data: profitabilityData, loading: profitabilityLoading } = useQuery(
    GetPayrollProfitabilityDocument,
    {
      variables: {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString()
      }
    }
  );

  // Mutations
  const [updateBillingItem] = useMutation(UpdateBillingItemDocument);
  const [consolidateInvoices] = useMutation(ConsolidateInvoicesDocument);

  const billingItems: BillingItem[] = billingData?.billingItems || [];
  const profitabilityItems = profitabilityData?.payrolls || [];

  // Filter billing items
  const filteredItems = useMemo(() => {
    return billingItems.filter(item => {
      if (filters.isApproved !== undefined && (item.isApproved ?? false) !== filters.isApproved) return false;
      if (filters.approvalStatus === 'confirmed' && !item.confirmedAt) return false;
      if (filters.approvalStatus === 'unconfirmed' && item.confirmedAt) return false;
      return true;
    });
  }, [billingItems, filters]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = filteredItems.reduce((sum, item) => sum + (item.totalAmount ?? item.amount ?? 0), 0);
    const pending = filteredItems.filter(item => !(item.isApproved ?? false));
    const approved = filteredItems.filter(item => item.isApproved ?? false);
    const confirmed = filteredItems.filter(item => item.confirmedAt);
    
    return {
      totalAmount: total,
      pendingCount: pending.length,
      pendingAmount: pending.reduce((sum, item) => sum + (item.totalAmount ?? item.amount ?? 0), 0),
      approvedCount: approved.length,
      approvedAmount: approved.reduce((sum, item) => sum + (item.totalAmount ?? item.amount ?? 0), 0),
      confirmedCount: confirmed.length,
      totalItems: filteredItems.length
    };
  }, [filteredItems]);

  // Handle item selection
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(filteredItems.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  // Bulk approve items
  const bulkApprove = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to approve');
      return;
    }

    try {
      const updatePromises = selectedItems.map(itemId =>
        updateBillingItem({
          variables: {
            id: itemId,
            updates: {
              isApproved: true,
              approvalDate: new Date().toISOString()
            }
          }
        })
      );

      await Promise.all(updatePromises);
      toast.success(`Approved ${selectedItems.length} billing items`);
      setSelectedItems([]);
      refetch();
      onBulkAction?.('approve', filteredItems.filter(item => selectedItems.includes(item.id)));
    } catch (error) {
      toast.error('Failed to approve items');
      console.error('Bulk approve error:', error);
    }
  };

  // Generate invoice
  const generateInvoice = async (clientId: string) => {
    try {
      await consolidateInvoices({
        variables: {
          clientId: clientId,
          consolidationDate: new Date().toISOString().split('T')[0]
        }
      });
      toast.success('Invoice generated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to generate invoice');
      console.error('Invoice generation error:', error);
    }
  };

  const getStatusColor = (isApproved: boolean | null, confirmedAt?: string | null) => {
    if (isApproved) {
      return 'bg-green-100 text-green-800';
    } else if (confirmedAt) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (isApproved: boolean | null, confirmedAt?: string | null) => {
    if (isApproved) {
      return 'Approved';
    } else if (confirmedAt) {
      return 'Confirmed';
    } else {
      return 'Draft';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Billing Dashboard</h1>
          <p className="text-gray-600">Manage billing items, approvals, and invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Billing Item
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalItems} items
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.pendingCount} items
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.approvedAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.approvedCount} items
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.confirmedCount}</div>
            <p className="text-xs text-muted-foreground">
              Manager confirmed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Billing Items</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest billing items and activity across all clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {billingLoading ? (
                <div className="text-center py-8">Loading billing data...</div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.slice(0, 10).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">{item.serviceName || 'Unnamed Service'}</div>
                          <div className="text-sm text-gray-600">{item.description || 'No description'}</div>
                        </div>
                        <Badge className={getStatusColor(item.isApproved ?? false, item.confirmedAt ?? null)}>
                          {getStatusLabel(item.isApproved ?? false, item.confirmedAt ?? null)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(item.amount ?? 0)}</div>
                        <div className="text-sm text-gray-600">{formatDate(item.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="approval-filter">Approval Status</Label>
                  <Select
                    value={filters.isApproved === undefined ? 'all' : filters.isApproved ? 'approved' : 'pending'}
                    onValueChange={(value) => {
                      let isApproved: boolean | undefined;
                      if (value === 'approved') isApproved = true;
                      else if (value === 'pending') isApproved = false;
                      else isApproved = undefined;
                      setFilters(prev => ({ ...prev, isApproved }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Items" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="confirmed">Confirmation Status</Label>
                  <Select
                    value={filters.approvalStatus}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, approvalStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="confirmed">Confirmed by Manager</SelectItem>
                      <SelectItem value="unconfirmed">Not Confirmed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 3 months</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    placeholder="Client ID"
                    value={filters.clientId}
                    onChange={(e) => setFilters(prev => ({ ...prev, clientId: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{selectedItems.length} items selected</span>
                    <Button variant="outline" size="sm" onClick={clearSelection}>
                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={bulkApprove}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Selected
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Items Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Billing Items</CardTitle>
                  <CardDescription>
                    {filteredItems.length} items found
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllItems}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                        onCheckedChange={(checked) => checked ? selectAllItems() : clearSelection()}
                      />
                    </TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow 
                      key={item.id}
                      className={selectedItems.includes(item.id) ? 'bg-blue-50' : ''}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="cursor-pointer" onClick={() => onItemClick?.(item)}>
                          <div className="font-medium">{item.serviceName || 'Unnamed Service'}</div>
                          <div className="text-sm text-gray-600">{item.description || 'No description'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.client?.name || item.clientId}</div>
                        {item.payroll && (
                          <div className="text-sm text-gray-600">{item.payroll.name}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{formatCurrency(item.totalAmount ?? item.amount ?? 0)}</div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-gray-600">{item.quantity} × {formatCurrency((item.totalAmount ?? item.amount ?? 0) / item.quantity)}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.isApproved ?? false, item.confirmedAt ?? null)}>
                          {getStatusLabel(item.isApproved ?? false, item.confirmedAt ?? null)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.isApproved ? (
                          <Badge className="bg-green-100 text-green-800">Approved</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {!item.isApproved && (
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Profitability Analysis
              </CardTitle>
              <CardDescription>
                Revenue and profit analysis by payroll
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profitabilityLoading ? (
                <div className="text-center py-8">Loading profitability data...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payroll</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Rate/Hour</TableHead>
                      <TableHead>Billing Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitabilityItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.client?.name}</TableCell>
                        <TableCell>{formatCurrency(item.estimatedRevenue || 0)}</TableCell>
                        <TableCell>{item.estimatedHours || 0}h</TableCell>
                        <TableCell>
                          {item.estimatedHours && item.estimatedRevenue 
                            ? formatCurrency(item.estimatedRevenue / item.estimatedHours)
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(false, undefined)}>
                            {item.billingStatus || 'Not Started'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};