'use client';

import { useQuery } from '@apollo/client';
import { Plus, DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BillingItemsTable } from '@/domains/billing/components/items/billing-items-table';
import { GetBillingItemsAdvancedDocument, GetBillingItemsStatsAdvancedDocument } from '@/domains/billing/graphql/generated/graphql';

export default function BillingItemsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch billing data
  const { data: billingItemsData, loading: itemsLoading, refetch } = useQuery(
    GetBillingItemsAdvancedDocument,
    {
      variables: {
        limit: 100,
        offset: 0,
        orderBy: [{ createdAt: "DESC" }],
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const { data: statsData, loading: statsLoading } = useQuery(
    GetBillingItemsStatsAdvancedDocument,
    {
      variables: { where: {} },
      fetchPolicy: "cache-and-network",
    }
  );

  const billingItems = billingItemsData?.billingItems || [];
  const stats = statsData?.billingItemsAggregate?.aggregate;
  const pendingStats = statsData?.pending?.aggregate;
  const approvedStats = statsData?.approved?.aggregate;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  return (
    <PermissionGuard resource="billing_items" action="read" fallback={
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2 text-red-800">
            Access Denied
          </h3>
          <p className="text-red-600">
            You don't have permission to access billing items. Contact your administrator for access.
          </p>
        </div>
      </div>
    }>
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing Items</h1>
            <p className="text-gray-600 mt-2">
              Manage individual billing items and track approval status
            </p>
          </div>
          <PermissionGuard resource="billing_items" action="create" fallback={null}>
            <Link href="/billing/items/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Item
              </Button>
            </Link>
          </PermissionGuard>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {itemsLoading ? "..." : (stats?.count || 0)}
              </div>
              <p className="text-xs text-gray-600">
                {formatCurrency(stats?.sum?.amount || 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : (pendingStats?.count || 0)}
              </div>
              <p className="text-xs text-gray-600">
                {formatCurrency(pendingStats?.sum?.amount || 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : (approvedStats?.count || 0)}
              </div>
              <p className="text-xs text-gray-600">
                {formatCurrency(approvedStats?.sum?.amount || 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.sum?.amount || 0)}
              </div>
              <p className="text-xs text-gray-600">
                All time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              All Items
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Draft Items
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Confirmed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <BillingItemsTable data={billingItems} loading={itemsLoading} refetch={refetch} />
          </TabsContent>

          <TabsContent value="draft">
            <BillingItemsTable 
              data={billingItems.filter(item => !item.isApproved)} 
              loading={itemsLoading} 
              refetch={refetch} 
            />
          </TabsContent>

          <TabsContent value="confirmed">
            <BillingItemsTable 
              data={billingItems.filter(item => item.isApproved)} 
              loading={itemsLoading} 
              refetch={refetch} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  );
}