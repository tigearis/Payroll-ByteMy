"use client";

import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Play,
  RefreshCw,
  FileText,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { safeFormatDate } from "@/lib/utils/date-utils";
import type { PayrollIntegrationHubProps } from "../types/billing.types";

export function PayrollIntegrationHub({
  payrollDatesReadyForBilling,
  completionRate,
  loading,
  onGenerateBilling,
}: PayrollIntegrationHubProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const getStatusBadge = (date: Date) => {
    const today = new Date();
    const daysDiff = Math.ceil(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 1) {
      return (
        <Badge className="bg-green-100 text-green-800 gap-1">
          <CheckCircle className="w-3 h-3" />
          Fresh
        </Badge>
      );
    } else if (daysDiff <= 3) {
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 gap-1"
        >
          <Clock className="w-3 h-3" />
          Recent
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 gap-1">
          <AlertTriangle className="w-3 h-3" />
          Overdue
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">
                Loading payroll integration data...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Payroll Integration Hub
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Seamless payroll completion tracking and automated billing
                generation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                {completionRate.toFixed(1)}% completion
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Completion Rate Card */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-blue-500">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Completion Rate</h3>
                  <p className="text-sm text-blue-600">Last 30 days</p>
                </div>
              </div>
              <div className="mb-2">
                <Progress value={completionRate} className="h-2 bg-blue-200" />
              </div>
              <div className="text-lg font-bold text-blue-900">
                {completionRate.toFixed(1)}%
              </div>
            </div>

            {/* Ready for Billing */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-green-500">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-green-900">
                    Ready for Billing
                  </h3>
                  <p className="text-sm text-green-600">Completed payrolls</p>
                </div>
              </div>
              <div className="text-lg font-bold text-green-900">
                {payrollDatesReadyForBilling.length}
              </div>
              <p className="text-sm text-green-600">
                Awaiting billing generation
              </p>
            </div>

            {/* Automation Status */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-purple-500">
                  <RefreshCw className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">Automation</h3>
                  <p className="text-sm text-purple-600">Billing workflow</p>
                </div>
              </div>
              <div className="text-lg font-bold text-purple-900">Active</div>
              <p className="text-sm text-purple-600">Auto-generation enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Dates Ready for Billing */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Completed Payrolls
              </CardTitle>
              <p className="text-sm text-gray-600">
                Payroll dates completed and ready for billing generation
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/billing?tab=payroll-integration&view=all">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrollDatesReadyForBilling.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No payrolls ready for billing</p>
                <p className="text-sm">
                  Completed payrolls will appear here for billing generation
                </p>
              </div>
            ) : (
              payrollDatesReadyForBilling.map(payrollDate => (
                <div
                  key={payrollDate.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">
                        {payrollDate.payroll?.name || "Unknown Payroll"}
                      </h4>
                      {payrollDate.completedAt &&
                        getStatusBadge(new Date(payrollDate.completedAt))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="truncate">
                          {payrollDate.payroll?.client?.name ||
                            "Unknown Client"}
                        </span>
                      </div>
                      <Separator orientation="vertical" className="h-3" />
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          EFT:{" "}
                          {payrollDate.adjustedEftDate
                            ? safeFormatDate(
                                payrollDate.adjustedEftDate,
                                "dd MMM yyyy"
                              )
                            : "Unknown"}
                        </span>
                      </div>
                      {payrollDate.payroll?.primaryConsultant && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <span className="truncate">
                            {payrollDate.payroll.primaryConsultant.firstName}{" "}
                            {payrollDate.payroll.primaryConsultant.lastName}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Completed:{" "}
                      {payrollDate.completedAt
                        ? safeFormatDate(
                            payrollDate.completedAt,
                            "dd MMM yyyy 'at' HH:mm"
                          )
                        : "Unknown"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <PermissionGuard action="create">
                      <Button
                        size="sm"
                        onClick={() => onGenerateBilling?.(payrollDate.id)}
                        className="gap-2"
                      >
                        <Play className="h-3 w-3" />
                        Generate Billing
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Integration Actions</CardTitle>
          <p className="text-sm text-gray-600">
            Quick access to payroll billing workflows
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PermissionGuard action="read">
              <Link href="/billing?tab=payroll-integration&view=tracking">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all w-full"
                >
                  <div className="p-2 rounded-lg text-white bg-blue-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="text-left w-full">
                    <div className="font-medium text-sm">
                      Completion Tracking
                    </div>
                    <div className="text-xs text-gray-500">
                      Monitor payroll completion status
                    </div>
                  </div>
                </Button>
              </Link>
            </PermissionGuard>

            <PermissionGuard action="admin">
              <Link href="/billing?tab=payroll-integration&view=automation">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all w-full"
                >
                  <div className="p-2 rounded-lg text-white bg-green-600">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div className="text-left w-full">
                    <div className="font-medium text-sm">Automation Rules</div>
                    <div className="text-xs text-gray-500">
                      Configure automatic billing generation
                    </div>
                  </div>
                </Button>
              </Link>
            </PermissionGuard>

            <PermissionGuard action="read">
              <Link href="/billing?tab=analytics&focus=payroll">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all w-full"
                >
                  <div className="p-2 rounded-lg text-white bg-purple-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="text-left w-full">
                    <div className="font-medium text-sm">
                      Integration Analytics
                    </div>
                    <div className="text-xs text-gray-500">
                      View payroll billing performance
                    </div>
                  </div>
                </Button>
              </Link>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>

      {/* Process Flow Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Automated Billing Process</CardTitle>
          <p className="text-sm text-gray-600">
            How payroll completion triggers billing generation
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Payroll Completion</h4>
                <p className="text-sm text-gray-600">
                  Consultants mark payroll dates as completed with time tracking
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">2</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Automatic Detection</h4>
                <p className="text-sm text-gray-600">
                  System identifies completed payrolls ready for billing
                  generation
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">3</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Billing Generation</h4>
                <p className="text-sm text-gray-600">
                  Creates billing items with appropriate rates and time
                  allocations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
