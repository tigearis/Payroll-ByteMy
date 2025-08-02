"use client";

import React from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { ModernBillingDashboard } from "@/domains/billing/components/dashboard/modern-billing-dashboard";

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Comprehensive billing, invoicing, and revenue management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PermissionGuard permission="billing.read">
          <ModernBillingDashboard />
        </PermissionGuard>
      </div>
    </div>
  );
}