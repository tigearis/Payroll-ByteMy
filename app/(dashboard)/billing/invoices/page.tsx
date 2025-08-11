"use client";

import { FileText, FileStack, BarChart3, RefreshCw, Plus } from "lucide-react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceConsolidationManager } from "@/domains/billing/components/invoicing/invoice-consolidation-manager";
import { InvoiceManagementDashboard } from "@/domains/billing/components/invoicing/invoice-management-dashboard";

export default function InvoicesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Invoice Management"
        description="Automated invoice generation and consolidation system"
        actions={[
          {
            label: "Refresh",
            icon: RefreshCw,
            onClick: () => window.location.reload(),
          },
          {
            label: "New Invoice",
            icon: Plus,
            primary: true,
            href: "/billing/invoices/new",
          },
        ]}
        overflowActions={[
          {
            label: "Export",
            onClick: () =>
              window.dispatchEvent(new CustomEvent("invoices:export")),
          },
        ]}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing", href: "/billing" },
          { label: "Invoices" },
        ]}
      />
      <PermissionGuard action="read">
        {/* Main Content */}
        <Tabs defaultValue="management" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="management" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Invoice Management
            </TabsTrigger>
            <TabsTrigger
              value="consolidation"
              className="flex items-center gap-2"
            >
              <FileStack className="w-4 h-4" />
              Consolidation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="management">
            <InvoiceManagementDashboard showCreateButton={true} />
          </TabsContent>

          <TabsContent value="consolidation">
            <InvoiceConsolidationManager showAutomation={true} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Performance</CardTitle>
                  <CardDescription>Key metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Invoices This Month
                      </span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Average Processing Time
                      </span>
                      <span className="font-medium">4.2 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Automation Rate
                      </span>
                      <span className="font-medium text-green-600">89%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Average Collection Time
                      </span>
                      <span className="font-medium">23 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Savings</CardTitle>
                  <CardDescription>
                    Time and money saved through automation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Manual Hours Saved/Month
                      </span>
                      <span className="font-medium">18.3 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Cost Savings/Month
                      </span>
                      <span className="font-medium text-green-600">$2,296</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Error Reduction
                      </span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Client Satisfaction
                      </span>
                      <span className="font-medium">96%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Semi-Automated Billing Benefits</CardTitle>
                  <CardDescription>
                    Impact of the new billing system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-blue-600">
                        90%
                      </div>
                      <div className="text-sm text-gray-600">
                        Reduction in Manual Work
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-600">
                        5x
                      </div>
                      <div className="text-sm text-gray-600">
                        Faster Invoice Generation
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-purple-600">
                        24/7
                      </div>
                      <div className="text-sm text-gray-600">
                        Automated Processing
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-orange-600">
                        100%
                      </div>
                      <div className="text-sm text-gray-600">
                        Audit Compliance
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PermissionGuard>
    </div>
  );
}
