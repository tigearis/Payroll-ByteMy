'use client';

import { ArrowLeft, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Button } from '@/components/ui/button';
import { BillingItemForm } from '@/domains/billing/components/items/billing-item-form';

export default function EditBillingItemPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PermissionGuard resource="billing_items" action="update" fallback={
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2 text-red-800">
            Access Denied
          </h3>
          <p className="text-red-600">
            You don't have permission to edit billing items. Contact your administrator for access.
          </p>
        </div>
      </div>
    }>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href={`/billing/items/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Billing Item</h1>
            <p className="text-gray-600 mt-2">
              Update billing item information
            </p>
          </div>
        </div>

        {/* Form */}
        <BillingItemForm itemId={id} />
      </div>
    </PermissionGuard>
  );
}