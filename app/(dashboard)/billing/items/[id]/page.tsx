'use client';

import { useQuery } from '@apollo/client';
import { ArrowLeft, DollarSign, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BillingItemDetails } from '@/domains/billing/components/items/billing-item-details';

export default function BillingItemDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PermissionGuard resource="billing_items" action="read" fallback={
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2 text-red-800">
            Access Denied
          </h3>
          <p className="text-red-600">
            You don't have permission to view billing items. Contact your administrator for access.
          </p>
        </div>
      </div>
    }>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/billing/items">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Items
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Billing Item Details</h1>
              <p className="text-gray-600 mt-2">
                View and manage billing item information
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <PermissionGuard resource="billing_items" action="update" fallback={null}>
              <Link href={`/billing/items/${id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </PermissionGuard>
            <PermissionGuard resource="billing_items" action="delete" fallback={null}>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {/* Content */}
        <BillingItemDetails itemId={id} />
      </div>
    </PermissionGuard>
  );
}