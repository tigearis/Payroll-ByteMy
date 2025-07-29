'use client';

import { ArrowLeft, DollarSign } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Button } from '@/components/ui/button';
import { BillingItemForm } from '@/domains/billing/components/items/billing-item-form';

export default function NewBillingItemPage() {
  return (
    <PermissionGuard resource="billing_items" action="create" fallback={
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2 text-red-800">
            Access Denied
          </h3>
          <p className="text-red-600">
            You don't have permission to create billing items. Contact your administrator for access.
          </p>
        </div>
      </div>
    }>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/billing/items">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Items
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Billing Item</h1>
            <p className="text-gray-600 mt-2">
              Add a new billing item for client invoicing
            </p>
          </div>
        </div>

        {/* Form */}
        <BillingItemForm />
      </div>
    </PermissionGuard>
  );
}