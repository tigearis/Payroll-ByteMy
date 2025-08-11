"use client";

import { useMutation, useQuery } from "@apollo/client";
import { Edit, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import GraphQL operations
import {
  UpdatePayrollScheduleDocument,
  GetPayrollCyclesDocument,
  GetPayrollDateTypesDocument,
} from "@/domains/payrolls/graphql/generated/graphql";

interface EditScheduleDialogProps {
  payroll: {
    id: string;
    cycleId?: string | null;
    dateTypeId?: string | null;
    processingDaysBeforeEft?: number | null;
    processingTime?: number | null;
    dateValue?: number | null;
  };
  onSuccess?: () => void;
}

export function EditScheduleDialog({ payroll, onSuccess }: EditScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    cycleId: payroll.cycleId || "",
    dateTypeId: payroll.dateTypeId || "",
    processingDaysBeforeEft: payroll.processingDaysBeforeEft || 3,
    processingTime: payroll.processingTime || 4,
    dateValue: payroll.dateValue || 1,
  });

  // Query for payroll cycles
  const { data: cyclesData } = useQuery(GetPayrollCyclesDocument, {
    fetchPolicy: "cache-first",
  });

  // Query for payroll date types
  const { data: dateTypesData } = useQuery(GetPayrollDateTypesDocument, {
    fetchPolicy: "cache-first",
  });

  // Mutation to update payroll schedule
  const [updatePayrollSchedule, { loading }] = useMutation(UpdatePayrollScheduleDocument, {
    onCompleted: () => {
      toast.success("Schedule updated successfully");
      onSuccess?.();
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update schedule:", error);
      toast.error(`Failed to update schedule: ${error.message}`);
    },
  });

  const handleSubmit = async () => {
    try {
      await updatePayrollSchedule({
        variables: {
          id: payroll.id,
          cycleId: formData.cycleId,
          dateTypeId: formData.dateTypeId,
          processingDaysBeforeEft: Number(formData.processingDaysBeforeEft),
          processingTime: Number(formData.processingTime),
          dateValue: Number(formData.dateValue),
        },
      });
    } catch (error) {
      console.error("Update schedule error:", error);
    }
  };

  const getCycleDescription = (cycleName: string) => {
    const descriptions = {
      weekly: "Every week on the same day",
      fortnightly: "Every two weeks on the same day",
      bi_monthly: "Twice per month (1st/15th or 15th/last)",
      monthly: "Once per month",
      quarterly: "Once every three months",
    };
    return descriptions[cycleName?.toLowerCase() as keyof typeof descriptions] || "";
  };

  const getDateTypeDescription = (typeName: string) => {
    const descriptions = {
      som: "Start of Month (1st)",
      eom: "End of Month (last day)",
      mid: "Mid Month (15th)",
      dom: "Specific Day of Month",
      dow: "Specific Day of Week",
    };
    return descriptions[typeName?.toLowerCase() as keyof typeof descriptions] || "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Schedule
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Payroll Schedule</DialogTitle>
          <DialogDescription>
            Update the payroll frequency and processing settings. Changes will regenerate all future payroll dates.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Payroll Cycle */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cycle" className="text-right">
              Frequency
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.cycleId}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, cycleId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payroll frequency" />
                </SelectTrigger>
                <SelectContent>
                  {cyclesData?.payrollCycles?.map((cycle: any) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{cycle.name?.replace('_', ' ').toUpperCase()}</span>
                        <span className="text-xs text-muted-foreground">
                          {getCycleDescription(cycle.name)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateType" className="text-right">
              Date Type
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.dateTypeId}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, dateTypeId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date type" />
                </SelectTrigger>
                <SelectContent>
                  {dateTypesData?.payrollDateTypes?.map((dateType: any) => (
                    <SelectItem key={dateType.id} value={dateType.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{dateType.name?.toUpperCase()}</span>
                        <span className="text-xs text-muted-foreground">
                          {getDateTypeDescription(dateType.name)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Value (for specific days) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateValue" className="text-right">
              Day Value
            </Label>
            <div className="col-span-3">
              <Input
                id="dateValue"
                type="number"
                min={1}
                max={31}
                value={formData.dateValue}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, dateValue: parseInt(e.target.value) || 1 }))
                }
                className="w-32"
                placeholder="1-31 for day of month, 1-7 for day of week"
              />
              <p className="text-xs text-muted-foreground mt-1">
                For monthly: day of month (1-31). For weekly: day of week (1=Monday, 7=Sunday)
              </p>
            </div>
          </div>

          {/* Processing Days Before EFT */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="processingDays" className="text-right">
              Processing Lead
            </Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Input
                  id="processingDays"
                  type="number"
                  min={0}
                  max={10}
                  value={formData.processingDaysBeforeEft}
                  onChange={(e) =>
                    setFormData(prev => ({ 
                      ...prev, 
                      processingDaysBeforeEft: parseInt(e.target.value) || 0 
                    }))
                  }
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">days before EFT</span>
              </div>
            </div>
          </div>

          {/* Processing Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="processingTime" className="text-right">
              Processing Time
            </Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Input
                  id="processingTime"
                  type="number"
                  min={1}
                  max={24}
                  value={formData.processingTime}
                  onChange={(e) =>
                    setFormData(prev => ({ 
                      ...prev, 
                      processingTime: parseInt(e.target.value) || 4 
                    }))
                  }
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">hours estimated</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}