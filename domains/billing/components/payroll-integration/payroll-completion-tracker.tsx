"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Play,
  Pause,
  Calculator,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useDatabaseUserId } from "@/hooks/use-database-user-id";
import { PayrollCompletionMetricsForm } from "./payroll-completion-metrics-form";
import { 
  GetPayrollDatesWithBillingStatusDocumentDocument,
  GetPayrollCompletionStatsDocumentDocument,
  GenerateBillingFromPayrollDateDocumentDocument
} from "../../graphql/generated/graphql";

export function PayrollCompletionTracker() {
  const { databaseUserId } = useDatabaseUserId();
  const [selectedPayrollDate, setSelectedPayrollDate] = useState<any>(null);
  const [isMetricsDialogOpen, setIsMetricsDialogOpen] = useState(false);
  
  // Real GraphQL queries re-enabled - get all recent payroll dates
  const { data: payrollDatesData, loading: payrollDatesLoading, refetch } = useQuery(GetPayrollDatesWithBillingStatusDocumentDocument, {
    variables: {
      limit: 50,
      offset: 0,
      // Remove status filter to get all payroll dates
      includeCompleted: true
    },
    fetchPolicy: "cache-and-network"
  });
  
  const { data: statsData } = useQuery(GetPayrollCompletionStatsDocumentDocument, {
    fetchPolicy: "cache-and-network"
  });
  
  const [generateBilling] = useMutation(GenerateBillingFromPayrollDateDocumentDocument, {
    onCompleted: () => {
      toast.success('Billing generated successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to generate billing: ${error.message}`);
    }
  });


  const payrollDates = payrollDatesData?.payrollDates || [];

  // Calculate real statistics from the data
  const completedCount = statsData?.completedPayrollDates?.aggregate?.count || 0;
  const pendingCount = statsData?.pendingPayrollDates?.aggregate?.count || 0;
  const readyForBillingCount = statsData?.readyForBilling?.aggregate?.count || 0;
  const billingGeneratedCount = statsData?.billingGenerated?.aggregate?.count || 0;
  
  const totalCount = completedCount + pendingCount;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Handle billing generation
  const handleGenerateBilling = async (payrollDateId: string) => {
    if (!databaseUserId) {
      toast.error("User authentication required");
      return;
    }
    
    try {
      await generateBilling({
        variables: {
          payrollDateId,
          generatedBy: databaseUserId,
        },
      });
    } catch (error) {
      console.error("Billing generation error:", error);
    }
  };

  const handleOpenMetricsForm = (payrollDate: any) => {
    setSelectedPayrollDate(payrollDate);
    setIsMetricsDialogOpen(true);
  };

  const handleMetricsComplete = (success: boolean) => {
    if (success) {
      refetch(); // Refresh the payroll dates data
    }
    setIsMetricsDialogOpen(false);
    setSelectedPayrollDate(null);
  };

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

  const getStatusBadge = (payrollDate: any) => {
    const status = payrollDate.status;
    const billingGenerated = (payrollDate.billingItems?.aggregate?.count || 0) > 0;
    
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

  const hasTier1Metrics = (payrollDate: any) => {
    // Check if payroll has completion metrics (Tier 1 system)
    return payrollDate.payrollCompletionMetrics?.length > 0;
  };

  if (payrollDatesLoading) {
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
              {completedCount} of {totalCount} payrolls completed
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
              {readyForBillingCount}
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
            <PermissionGuard resource="payrolls" action="read">
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
            {payrollDates.map((payrollDate: any) => {
              const billingGenerated = (payrollDate.billingItems?.aggregate?.count || 0) > 0;
              return (
                <div
                  key={payrollDate.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(payrollDate.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{payrollDate.payroll?.name}</h4>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {payrollDate.payroll?.client?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          EFT Date: {new Date(payrollDate.adjustedEftDate).toLocaleDateString()}
                        </span>
                        {payrollDate.completedAt && (
                          <span className="text-sm text-gray-500">
                            Completed: {new Date(payrollDate.completedAt).toLocaleDateString()}
                          </span>
                        )}
                        {payrollDate.completedByUser && (
                          <span className="text-sm text-gray-500">
                            by {payrollDate.completedByUser.computedName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(payrollDate)}
                    
                    {/* Tier 1 Metrics Button - New completion flow */}
                    {payrollDate.status !== "completed" && (
                      <PermissionGuard action="update">
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleOpenMetricsForm(payrollDate)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Calculator className="w-3 h-3 mr-1" />
                          Complete with Metrics
                        </Button>
                      </PermissionGuard>
                    )}
                    
                    {/* Show Tier 1 badge if metrics exist */}
                    {hasTier1Metrics(payrollDate) && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Tier 1
                      </Badge>
                    )}
                    
                    {/* Update existing metrics button */}
                    {payrollDate.status === "completed" && hasTier1Metrics(payrollDate) && (
                      <PermissionGuard action="update">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenMetricsForm(payrollDate)}
                        >
                          <Calculator className="w-3 h-3 mr-1" />
                          Update Metrics
                        </Button>
                      </PermissionGuard>
                    )}
                    
                    {/* Legacy billing generation for non-Tier 1 payrolls */}
                    {payrollDate.status === "completed" && !billingGenerated && !hasTier1Metrics(payrollDate) && (
                      <PermissionGuard action="create">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleGenerateBilling(payrollDate.id)}
                        >
                          Generate Billing
                        </Button>
                      </PermissionGuard>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {payrollDates.length === 0 && (
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
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calculator className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium">Tier 1 Completion Metrics</h4>
                <p className="text-sm text-gray-600">
                  Capture detailed deliverables and complexity for outcome-based billing
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium">Immediate Revenue Recognition</h4>
                <p className="text-sm text-gray-600">
                  Billing generated instantly based on actual deliverables and service rates
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium">Smart Approval Workflows</h4>
                <p className="text-sm text-gray-600">
                  Auto-approval for standard services, escalation for complex deliverables
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier 1 Completion Metrics Dialog */}
      <Dialog open={isMetricsDialogOpen} onOpenChange={setIsMetricsDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payroll Completion Metrics</DialogTitle>
          </DialogHeader>
          {selectedPayrollDate && (
            <PayrollCompletionMetricsForm
              payrollDateId={selectedPayrollDate.id}
              payrollName={selectedPayrollDate.payroll?.name || "Unknown Payroll"}
              clientName={selectedPayrollDate.payroll?.client?.name || "Unknown Client"}
              eftDate={selectedPayrollDate.adjustedEftDate || selectedPayrollDate.originalEftDate}
              onComplete={handleMetricsComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}