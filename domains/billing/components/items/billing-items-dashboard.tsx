'use client';

import { useQuery } from '@apollo/client';
import { Edit, Trash2, DollarSign, Calendar, Clock, CheckCircle, AlertTriangle, User, Building } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface BillingItemsDashboardProps {
  status?: 'pending' | 'approved' | 'rejected';
}

// Mock data for now - will be replaced with GraphQL query
const mockBillingItems = [
  {
    id: '1',
    description: 'Web Development Services - Q1 2024',
    amount: 4500.00,
    quantity: 1,
    unit: 'project',
    status: 'pending',
    client: { id: '1', name: 'Acme Corp' },
    createdBy: { id: '1', firstName: 'John', lastName: 'Doe' },
    createdAt: '2024-01-15T10:30:00Z',
    approvedAt: null,
    approvedBy: null,
    notes: 'Complete redesign of company website',
  },
  {
    id: '2',
    description: 'Monthly Payroll Processing - January 2024',
    amount: 850.00,
    quantity: 1,
    unit: 'month',
    status: 'approved',
    client: { id: '2', name: 'Tech Solutions Ltd' },
    createdBy: { id: '2', firstName: 'Jane', lastName: 'Smith' },
    createdAt: '2024-01-10T14:20:00Z',
    approvedAt: '2024-01-12T09:15:00Z',
    approvedBy: { id: '3', firstName: 'Mike', lastName: 'Johnson' },
    notes: 'Standard monthly processing for 25 employees',
  },
  {
    id: '3',
    description: 'Consulting Services - Strategy Review',
    amount: 2200.00,
    quantity: 8,
    unit: 'hours',
    status: 'pending',
    client: { id: '3', name: 'Growth Partners' },
    createdBy: { id: '1', firstName: 'John', lastName: 'Doe' },
    createdAt: '2024-01-20T16:45:00Z',
    approvedAt: null,
    approvedBy: null,
    notes: 'Strategic review of payroll processes and recommendations',
  },
];

export function BillingItemsDashboard({ status }: BillingItemsDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  
  // Filter items based on status and search
  const filteredItems = mockBillingItems.filter(item => {
    const matchesStatus = !status || item.status === status;
    const matchesSearch = !searchTerm || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${item.createdBy.firstName} ${item.createdBy.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'client':
        return a.client.name.localeCompare(b.client.name);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by description, client, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {sortedItems.length} of {mockBillingItems.length} billing items
          {status && ` with status: ${status}`}
        </div>
        <div className="text-sm font-medium text-gray-900">
          Total Value: {formatCurrency(sortedItems.reduce((sum, item) => sum + item.amount, 0))}
        </div>
      </div>

      {/* Billing Items Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Description</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm || status ? 'No billing items match your filters' : 'No billing items found'}
                  </TableCell>
                </TableRow>
              ) : (
                sortedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <Link 
                          href={`/billing/items/${item.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {item.description}
                        </Link>
                        {item.notes && (
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{item.client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono font-medium">
                        {formatCurrency(item.amount)}
                      </div>
                      {item.quantity !== 1 && (
                        <div className="text-xs text-gray-500">
                          {item.quantity} {item.unit}{item.quantity !== 1 ? 's' : ''}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{formatDate(item.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {item.createdBy.firstName} {item.createdBy.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <PermissionGuard resource="billing_items" action="update" fallback={null}>
                          <Link href={`/billing/items/${item.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </PermissionGuard>
                        <PermissionGuard resource="billing_items" action="delete" fallback={null}>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </PermissionGuard>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}