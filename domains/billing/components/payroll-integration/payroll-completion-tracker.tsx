"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Play,
  Pause,
} from "lucide-react";
import Link from "next/link";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { GetPayrollsDocument } from "@/domains/payrolls/graphql/generated/graphql";

export function PayrollCompletionTracker() {
  // Fetch payrolls data
  const { data: payrollsData, loading } = useQuery(GetPayrollsDocument, {
    variables: {
      limit: 20,
      offset: 0,
      where: {
        status: { _in: ["Active", "Processing"] },
        supersededDate: { _isNull: true },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const payrolls = payrollsData?.payrolls || [];

  // Mock data for payroll dates completion status
  // In real implementation, this would come from a proper query
  const mockPayrollDates = [
    {
      id: "1",
      payrollId: "p1",
      payrollName: "ABC Corp Weekly",
      clientName: "ABC Corporation",
      eftDate: "2025-08-08",
      status: "completed",
      completedAt: "2025-08-01T10:00:00Z",
      billingGenerated: true,
    },
    {
      id: "2",
      payrollId: "p2",
      payrollName: "XYZ Ltd Fortnightly",
      clientName: "XYZ Limited",
      eftDate: "2025-08-10",
      status: "pending",
      completedAt: null,
      billingGenerated: false,
    },
    {
      id: "3",
      payrollId: "p3",
      payrollName: "Tech Start Monthly",
      clientName: "Tech Startup Inc",
      eftDate: "2025-08-15",
      status: "pending",
      completedAt: null,
      billingGenerated: false,
    },
    {
      id: "4",
      payrollId: "p4",
      payrollName: "Retail Chain Weekly",
      clientName: "Retail Chain Pty",
      eftDate: "2025-08-12",
      status: "completed",
      completedAt: "2025-07-30T14:30:00Z",
      billingGenerated: true,
    },
  ];

  const completedCount = mockPayrollDates.filter(pd => pd.status === "completed").length;
  const pendingCount = mockPayrollDates.filter(pd => pd.status === "pending").length;
  const completionRate = (completedCount / mockPayrollDates.length) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string, billingGenerated: boolean) => {
    if (status === "completed") {
      if (billingGenerated) {
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Billing Generated
          </Badge>
        );
      }
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <Play className="w-3 h-3 mr-1" />
          Ready for Billing
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <Pause className="w-3 h-3 mr-1" />
        Pending Completion
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading payroll data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedCount} of {mockPayrollDates.length} payrolls completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Completion</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Payroll dates awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billing Ready</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockPayrollDates.filter(pd => pd.status === "completed" && !pd.billingGenerated).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Completed payrolls ready for billing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Dates Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payroll Completion Status</CardTitle>
              <CardDescription>
                Track payroll date completions and billing generation
              </CardDescription>
            </div>
            <PermissionGuard permission="payrolls.read">
              <Button variant="outline" asChild>
                <Link href="/payrolls">
                  <Calendar className="w-4 h-4 mr-2" />
                  View All Payrolls
                </Link>
              </Button>
            </PermissionGuard>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPayrollDates.map((payrollDate) => (
              <div
                key={payrollDate.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(payrollDate.status)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{payrollDate.payrollName}</h4>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {payrollDate.clientName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">
                        EFT Date: {new Date(payrollDate.eftDate).toLocaleDateString()}
                      </span>
                      {payrollDate.completedAt && (
                        <span className="text-sm text-gray-500">
                          Completed: {new Date(payrollDate.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(payrollDate.status, payrollDate.billingGenerated)}
                  {payrollDate.status === "completed" && !payrollDate.billingGenerated && (
                    <PermissionGuard permission="billing.create">
                      <Button size="sm" variant="outline">
                        Generate Billing
                      </Button>
                    </PermissionGuard>
                  )}
                </div>
              </div>
            ))}
          </div>

          {mockPayrollDates.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Upcoming Payroll Dates
              </h3>
              <p className="text-gray-500">
                All payroll dates have been completed and processed
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Automated Billing Integration</CardTitle>
          <CardDescription>
            How payroll completion triggers billing generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Payroll Date Completion</h4>
                <p className="text-sm text-gray-600">
                  Consultant marks payroll date as completed in the system
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">2</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Automatic Billing Generation</h4>
                <p className="text-sm text-gray-600">
                  System generates billing items based on service agreements
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">3</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Manager Approval</h4>
                <p className="text-sm text-gray-600">
                  Generated items await manager approval before invoicing
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}