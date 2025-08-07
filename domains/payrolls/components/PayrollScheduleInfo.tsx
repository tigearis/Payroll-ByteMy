"use client";

import {
  Calendar,
  Clock,
  Settings,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  Timer,
  Info,
  Edit,
  RefreshCw,
} from "lucide-react";
import { memo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CanUpdate } from "@/components/auth/permission-guard";
import { toast } from "sonner";
import type { PayrollData } from "@/domains/payrolls/hooks/usePayrollData";
import { getScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";

export interface PayrollScheduleInfoProps {
  data: PayrollData;
  loading?: boolean;
  onEditSchedule?: () => void;
  onRegenerateDates?: () => Promise<void>;
}

// Helper function to format date
function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "Not set";
  
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Helper function to format relative date
function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "(Today)";
  if (diffDays === 1) return "(Tomorrow)";
  if (diffDays > 1 && diffDays <= 7) return `(In ${diffDays} days)`;
  if (diffDays < 0 && diffDays >= -7) return `(${Math.abs(diffDays)} days ago)`;
  
  return "";
}

// Helper function to get date type description
function getDateTypeDescription(dateTypeName: string): string {
  const descriptions = {
    som: "Start of Month - Pays on the 1st of each month",
    eom: "End of Month - Pays on the last day of each month", 
    mid_month: "Mid Month - Pays on the 15th of each month",
    fixed_date: "Fixed Date - Pays on a specific date each month",
    week_a: "Week A - First week of fortnightly cycle",
    week_b: "Week B - Second week of fortnightly cycle",
    quarterly_som: "Quarterly Start - Beginning of each quarter",
    quarterly_eom: "Quarterly End - End of each quarter",
  };
  
  return descriptions[dateTypeName?.toLowerCase() as keyof typeof descriptions] || 
         "Custom schedule configuration";
}

// Helper function to get cycle description
function getCycleDescription(cycleName: string): string {
  const descriptions = {
    weekly: "Pays every week on the same day",
    fortnightly: "Pays every two weeks on the same day", 
    bi_monthly: "Pays twice per month (1st/15th or 15th/last)",
    monthly: "Pays once per month",
    quarterly: "Pays once every three months",
  };
  
  return descriptions[cycleName?.toLowerCase() as keyof typeof descriptions] || 
         "Custom payroll frequency";
}

// Schedule regeneration dialog
function RegenerateDatesDialog({
  open,
  onOpenChange,
  onRegenerate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegenerate: () => Promise<void>;
}) {
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      await onRegenerate();
      onOpenChange(false);
      toast.success("Payroll dates regenerated successfully");
    } catch (error) {
      console.error("Failed to regenerate dates:", error);
      toast.error("Failed to regenerate payroll dates");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Regenerate Payroll Dates
          </DialogTitle>
          <DialogDescription>
            This will regenerate all future payroll dates based on the current schedule configuration. 
            Existing dates will be replaced.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Warning:</strong> This action will replace all future payroll dates. 
              Any manual adjustments to future dates will be lost.
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRegenerate} disabled={regenerating}>
            {regenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Dates
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PayrollScheduleInfoComponent({
  data,
  loading = false,
  onEditSchedule,
  onRegenerateDates,
}: PayrollScheduleInfoProps) {
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);

  if (loading || !data) {
    return <PayrollScheduleInfoSkeleton />;
  }

  const { payroll } = data;
  const scheduleInfo = getScheduleSummary(payroll);
  
  // Get upcoming payroll dates for timeline
  const upcomingDates = payroll.detailPayrollDates
    ?.filter(date => {
      const dateToCheck = new Date(date.adjustedEftDate || date.originalEftDate);
      return dateToCheck >= new Date();
    })
    .slice(0, 8) || [];

  const handleRegenerateDates = async () => {
    if (onRegenerateDates) {
      await onRegenerateDates();
    } else {
      toast.info("Date regeneration functionality not implemented yet");
    }
  };

  const handleEditSchedule = () => {
    if (onEditSchedule) {
      onEditSchedule();
    } else {
      toast.info("Schedule editing functionality not implemented yet");
    }
  };

  return (
    <div className="space-y-6">
      {/* Schedule Configuration Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Schedule Configuration
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Payroll frequency and processing settings
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <CanUpdate resource="payrolls">
                <Button variant="outline" size="sm" onClick={handleEditSchedule}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Schedule
                </Button>
              </CanUpdate>
              
              <Dialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate Dates
                  </Button>
                </DialogTrigger>
                <RegenerateDatesDialog
                  open={regenerateDialogOpen}
                  onOpenChange={setRegenerateDialogOpen}
                  onRegenerate={handleRegenerateDates}
                />
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main schedule info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Payroll Frequency</h4>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{scheduleInfo}</p>
                    <p className="text-sm text-muted-foreground">
                      {getCycleDescription(payroll.payrollCycle?.name || "")}
                    </p>
                  </div>
                </div>
              </div>
              
              {payroll.payrollDateType && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Date Configuration</h4>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">{payroll.payrollDateType.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {getDateTypeDescription(payroll.payrollDateType.name)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Processing Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Timer className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium">
                        {payroll.processingDaysBeforeEft || 0} days before EFT
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Processing lead time
                      </p>
                    </div>
                  </div>
                  
                  {payroll.processingTime && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">{payroll.processingTime} hours</p>
                        <p className="text-sm text-muted-foreground">
                          Estimated processing time
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional configuration details */}
          {(payroll.dateValue || payroll.goLiveDate) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {payroll.dateValue && (
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date Value:</span>
                    <span className="font-medium">{payroll.dateValue}</span>
                  </div>
                )}
                
                {payroll.goLiveDate && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Go Live Date:</span>
                    <span className="font-medium">{formatDate(payroll.goLiveDate)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Payroll Dates */}
      {upcomingDates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Upcoming Payroll Dates
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Next {upcomingDates.length} scheduled pay dates with processing information
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>EFT Date</TableHead>
                    <TableHead>Processing Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingDates.map((date, index) => {
                    const eftDate = date.adjustedEftDate || date.originalEftDate;
                    const isAdjusted = date.adjustedEftDate !== date.originalEftDate;
                    const isOverdue = new Date(eftDate) < new Date();
                    
                    return (
                      <TableRow key={date.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {formatDate(eftDate)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeDate(eftDate)}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-sm">
                            {formatDate(date.processingDate)}
                          </span>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge 
                              variant={
                                date.status === "completed" ? "default" :
                                isOverdue ? "destructive" :
                                index === 0 ? "secondary" : "outline"
                              }
                              className="w-fit"
                            >
                              {date.status || (index === 0 ? "Upcoming" : "Scheduled")}
                            </Badge>
                            {isAdjusted && (
                              <Badge variant="outline" className="w-fit text-xs">
                                Adjusted
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {date.notes ? (
                            <div className="flex items-center gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                              <span className="text-muted-foreground">
                                {date.notes}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Dates are automatically adjusted for weekends and public holidays
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No upcoming dates message */}
      {upcomingDates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Upcoming Dates</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No payroll dates have been scheduled yet. Generate dates to get started.
            </p>
            <Button variant="outline" onClick={() => setRegenerateDialogOpen(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Payroll Dates
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Loading skeleton component
function PayrollScheduleInfoSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="h-9 bg-gray-200 rounded w-36 animate-pulse" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-36 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const PayrollScheduleInfo = memo(PayrollScheduleInfoComponent);
export default PayrollScheduleInfo;