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
import { GetAllbillingItemsDocument, GetBillingItemsStatsDocument } from '../../graphql/generated/graphql';

interface BillingItemsDashboardProps {
  status?: 'draft' | 'confirmed' | 'billed';
}

export function BillingItemsDashboard({ status }: BillingItemsDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  
  // GraphQL queries for billing items
  const { data: billingItemsData, loading: itemsLoading, error: itemsError, refetch } = useQuery(GetAllbillingItemsDocument, {
    variables: {
      searchTerm: searchTerm ? `%${searchTerm}%` : null,
      isApproved: status === 'draft' ? false : status === 'confirmed' ? true : null,
      limit: 100,
      offset: 0
    },
    skip: false
  });

  // GraphQL query for stats
  const { data: statsData, loading: statsLoading } = useQuery(GetBillingItemsStatsDocument, {
    variables: {
      isApproved: status === 'draft' ? false : status === 'confirmed' ? true : null,
      clientId: null
    }
  });

  const billingItems = billingItemsData?.billingItems || [];
  const stats = statsData?.billingItemsAggregate?.aggregate;

  const getStatusBadge = (isApproved: boolean, confirmedAt?: string) => {
    if (isApproved) {
      return <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
    } else if (confirmedAt) {
      return <Badge variant="outline" className="text-blue-600 border-blue-200"><Clock className="w-3 h-3 mr-1" />Confirmed</Badge>;
    } else {
      return <Badge variant="outline" className="text-orange-600 border-orange-200"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
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
          {itemsLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <>
              Showing {billingItems.length} billing items
              {status && ` with status: ${status}`}
            </>
          )}
        </div>
        <div className="text-sm font-medium text-gray-900">
          {statsLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <>Total Value: {formatCurrency(stats?.sum?.totalAmount || 0)}</>
          )}
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
              {itemsLoading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : itemsError ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-500">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                    Error loading billing items: {itemsError.message}
                    <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-2 ml-2">
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ) : billingItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm || status ? 'No billing items match your filters' : 'No billing items found'}
                  </TableCell>
                </TableRow>
              ) : (
                billingItems.map((item: any) => (
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
                        <span className="font-medium">{item.client?.name || 'Unknown Client'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono font-medium">
                        {formatCurrency(item.totalAmount || item.amount || 0)}
                      </div>
                      {item.quantity && item.quantity !== 1 && (
                        <div className="text-xs text-gray-500">
                          {item.quantity} items
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.isApproved || false, item.confirmedAt)}
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
                          {item.user?.computedName || 
                           `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim() || 
                           'Unknown User'}
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