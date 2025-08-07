"use client";

import {
  Calendar,
  Clock,
  Users,
  FileText,
  DollarSign,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Building2,
  Timer,
} from "lucide-react";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PayrollData } from "@/domains/payrolls/hooks/usePayrollData";
import { getScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";

export interface PayrollOverviewProps {
  data: PayrollData;
  loading?: boolean;
}

// Helper function to format date
function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "Not scheduled";
  
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Helper function to format relative date
function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return "Not scheduled";
  
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  
  return formatDate(d);
}

// Helper function to get processing status progress
function getProcessingProgress(status: string): number {
  const statusProgress = {
    Draft: 10,
    Implementation: 20,
    "Data Entry": 40,
    Review: 60,
    Processing: 80,
    "Manager Review": 90,
    Approved: 95,
    Active: 100,
    Completed: 100,
  };
  
  return statusProgress[status as keyof typeof statusProgress] || 0;
}

// Helper function to get status color
function getStatusColor(status: string): string {
  const statusColors = {
    Draft: "text-gray-600",
    Implementation: "text-blue-600",
    Active: "text-green-600",
    Inactive: "text-gray-500",
    "On Hold": "text-red-600",
    Completed: "text-green-700",
  };
  
  return statusColors[status as keyof typeof statusColors] || "text-gray-600";
}

function PayrollOverviewComponent({ data, loading = false }: PayrollOverviewProps) {
  if (loading || !data) {
    return <PayrollOverviewSkeleton />;
  }

  const { payroll } = data;
  
  // Calculate key metrics
  const nextPayDate = payroll.detailPayrollDates?.find(date => {
    const dateToCheck = new Date(date.adjustedEftDate || date.originalEftDate);
    return dateToCheck >= new Date();
  });

  const processingProgress = getProcessingProgress(payroll.status || "Implementation");
  const scheduleInfo = getScheduleSummary(payroll);
  
  // Upcoming dates for timeline
  const upcomingDates = payroll.detailPayrollDates
    ?.filter(date => {
      const dateToCheck = new Date(date.adjustedEftDate || date.originalEftDate);
      return dateToCheck >= new Date();
    })
    .slice(0, 3) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Status & Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge 
                variant={payroll.status === "Active" ? "default" : "secondary"}
                className={getStatusColor(payroll.status || "Implementation")}
              >
                {payroll.status || "Implementation"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {processingProgress}%
              </span>
            </div>
            
            <Progress value={processingProgress} className="h-2" />
            
            <p className="text-xs text-muted-foreground">
              {payroll.status === "Active" 
                ? "Payroll is operational" 
                : "Setup in progress"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Pay Date Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Pay Date</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatDate(nextPayDate?.adjustedEftDate || nextPayDate?.originalEftDate)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatRelativeDate(nextPayDate?.adjustedEftDate || nextPayDate?.originalEftDate)}
            </p>
            {nextPayDate?.notes && (
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <AlertCircle className="h-3 w-3" />
                Holiday adjusted
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employee Count Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {payroll.employeeCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {payroll.employeeCount === 1 ? "employee" : "employees"} on payroll
            </p>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              Active payroll
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files & Activity Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Documents</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {data.fileCount}
            </div>
            <p className="text-xs text-muted-foreground">
              files attached
            </p>
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <CheckCircle2 className="h-3 w-3" />
              Up to date
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Information Card - Full Width */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Client Information</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{payroll.client?.name || "No client assigned"}</h3>
              {payroll.client?.contactEmail && (
                <p className="text-sm text-muted-foreground">{payroll.client.contactEmail}</p>
              )}
              {payroll.client?.contactPerson && (
                <p className="text-sm text-muted-foreground">Contact: {payroll.client.contactPerson}</p>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <Badge variant={payroll.client?.active ? "default" : "secondary"}>
                {payroll.client?.active ? "Active Client" : "Inactive Client"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Information Card - Full Width */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payroll Schedule</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{scheduleInfo}</h3>
              <p className="text-sm text-muted-foreground">
                {payroll.payrollCycle?.description || "Standard payroll cycle"}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span>Processing: {payroll.processingDaysBeforeEft || 0} days before EFT</span>
              </div>
              
              {payroll.processingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Processing time: {payroll.processingTime}h</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Dates Timeline */}
      {upcomingDates.length > 0 && (
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Upcoming Pay Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {upcomingDates.map((date, index) => (
                <div key={date.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {formatDate(date.adjustedEftDate || date.originalEftDate)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Processing: {formatDate(date.processingDate)}
                    </p>
                    {date.notes && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {date.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Loading skeleton component
function PayrollOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Four main metric cards */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Two wide cards */}
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={`wide-${i}`} className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const PayrollOverview = memo(PayrollOverviewComponent);
export default PayrollOverview;