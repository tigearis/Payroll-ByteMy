'use client';

import { useQuery, useMutation } from '@apollo/client';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Send, 
  Download, 
  Eye, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  CreditCard
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GetInvoicesDocument,
  GetInvoiceStatsDocument,
  UpdateInvoiceStatusDocument,
  SendInvoiceDocument,
  type BillingInvoiceFragmentFragment
} from '../../graphql/generated/graphql';
import { InvoiceGenerator } from './invoice-generator';

interface InvoiceManagementDashboardProps {
  clientId?: string;
  showCreateButton?: boolean;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  viewed: 'bg-purple-100 text-purple-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const statusIcons = {
  draft: Clock,
  sent: Send,
  viewed: Eye,
  paid: CheckCircle,
  overdue: AlertTriangle,
  cancelled: XCircle
};

export const InvoiceManagementDashboard: React.FC<InvoiceManagementDashboardProps> = ({
  clientId,
  showCreateButton = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Calculate date filter
  const getDateFilter = () => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case '7':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '365':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const { startDate, endDate } = getDateFilter();

  // Query for invoices
  const { data: invoicesData, loading: invoicesLoading, refetch: refetchInvoices } = useQuery(
    GetInvoicesDocument,
    {
      variables: {
        where: {
          ...(clientId && { clientId: { _eq: clientId } }),
          ...(statusFilter !== 'all' && { status: { _eq: statusFilter } }),
          createdAt: { _gte: startDate, _lte: endDate }
        },
        orderBy: { createdAt: 'DESC' }
      }
    }
  );

  // Query for invoice statistics
  const { data: statsData } = useQuery(GetInvoiceStatsDocument, {
    variables: {
      clientId,
      startDate,
      endDate
    }
  });

  // Update invoice status mutation
  const [updateInvoiceStatus] = useMutation(UpdateInvoiceStatusDocument, {
    onCompleted: () => {
      toast.success('Invoice status updated');
      refetchInvoices();
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });

  // Send invoice mutation
  const [sendInvoice] = useMutation(SendInvoiceDocument, {
    onCompleted: () => {
      toast.success('Invoice sent successfully');
      refetchInvoices();
    },
    onError: (error) => {
      toast.error(`Failed to send invoice: ${error.message}`);
    }
  });

  const handleStatusUpdate = async (invoiceId: string, newStatus: string) => {
    try {
      await updateInvoiceStatus({
        variables: {
          id: invoiceId,
          status: newStatus
        }
      });
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await sendInvoice({
        variables: { invoiceId }
      });
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  const filteredInvoices = invoicesData?.billingInvoice?.filter((invoice: any) => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const formatCurrency = (amount: number, currency: string = 'AUD') => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getOverdueInvoices = () => {
    const today = new Date();
    return filteredInvoices.filter((invoice: any) => 
      invoice.status !== 'paid' && 
      invoice.status !== 'cancelled' && 
      new Date(invoice.dueDate) < today
    );
  };

  const calculateStats = () => {
    const total = filteredInvoices.reduce((sum: number, invoice: any) => sum + (invoice.totalAmount || 0), 0);
    const paid = filteredInvoices
      .filter((invoice: any) => invoice.status === 'paid')
      .reduce((sum: number, invoice: any) => sum + (invoice.totalAmount || 0), 0);
    const pending = total - paid;
    const overdueCount = getOverdueInvoices().length;

    return { total, paid, pending, overdueCount, count: filteredInvoices.length };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.total)}</p>
              </div>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.paid)}</p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.pending)}</p>
              </div>
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdueCount}</p>
              </div>
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {showCreateButton && (
            <Dialog open={showInvoiceGenerator} onOpenChange={setShowInvoiceGenerator}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>
                    Generate a new invoice from billing items
                  </DialogDescription>
                </DialogHeader>
                <InvoiceGenerator
                  clientId={clientId}
                  onInvoiceGenerated={(invoiceId) => {
                    setShowInvoiceGenerator(false);
                    refetchInvoices();
                    toast.success('Invoice generated successfully');
                  }}
                  onClose={() => setShowInvoiceGenerator(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <TabsContent value="invoices" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="viewed">Viewed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle>Invoices ({stats.count})</CardTitle>
              <CardDescription>
                Manage and track all invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Clock className="w-6 h-6 mr-2 animate-spin" />
                  Loading invoices...
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No invoices found</p>
                  {showCreateButton && (
                    <Button 
                      onClick={() => setShowInvoiceGenerator(true)} 
                      className="mt-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Invoice
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice: any) => {
                      const StatusIcon = statusIcons[invoice.status as keyof typeof statusIcons] || Clock;
                      const isOverdue = invoice.status !== 'paid' && 
                        invoice.status !== 'cancelled' && 
                        new Date(invoice.dueDate) < new Date();

                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            {invoice.client?.name || 'Unknown Client'}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(invoice.totalAmount, invoice.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={`${statusColors[invoice.status as keyof typeof statusColors]} flex items-center gap-1 w-fit`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              {isOverdue && invoice.status !== 'overdue' && (
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(invoice.invoiceDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                              {invoice.status === 'draft' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleSendInvoice(invoice.id)}
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
                <CardDescription>Invoice payment performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics charts coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Performance</CardTitle>
                <CardDescription>Top clients by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Client analytics coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};