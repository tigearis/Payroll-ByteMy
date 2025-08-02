// components/regenerate-dates.tsx
"use client";

import { useLazyQuery } from "@apollo/client";
import { format, addMonths } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GeneratePayrollDatesQueryDocument,
} from "@/domains/payrolls/graphql/generated/graphql";

interface RegenerateDatesProps {
  payrollId: string;
  onSuccess?: () => void;
}

export function RegenerateDates({
  payrollId,
  onSuccess,
}: RegenerateDatesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [months, setMonths] = useState(12);

  // Set up the query with proper refetching
  const [generateDates, { loading, error }] = useLazyQuery(
    GeneratePayrollDatesQueryDocument,
    {
      onCompleted: data => {
        const count = data?.payrollDates?.length || 0;
        toast.success(`Successfully generated ${count} payroll dates`);
        setIsDialogOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: err => {
        toast.error(`Failed to generate dates: ${err.message}`);
      },
    }
  );

  const handleRegenerate = async () => {
    if (!payrollId) {
      toast.error("Payroll ID is required");
      return;
    }

    try {
      const today = new Date();
      const endDate = addMonths(today, months);

      await generateDates({
        variables: {
          payrollId,
          startDate: format(today, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
          maxDates: null, // Optional parameter
        },
      });
    } catch (err) {
      // Error handled by onError callback
      console.error("Error in regenerate:", err);
    }
  };

  return (
    <PermissionGuard action="update">
      <div>
      {!isDialogOpen ? (
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Regenerate Dates
        </Button>
      ) : (
        <div className="border p-4 rounded-md shadow-sm space-y-4">
          <h3 className="font-medium">Regenerate Payroll Dates</h3>

          <div className="space-y-2">
            <Label htmlFor="months">Months to Generate:</Label>
            <div className="flex items-center gap-2">
              <Input
                id="months"
                type="number"
                min="1"
                max="36"
                value={months}
                onChange={e => setMonths(parseInt(e.target.value) || 12)}
                className="w-20"
              />
              <span className="text-sm text-gray-500">months</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleRegenerate} disabled={loading}>
              {loading ? "Regenerating..." : "Regenerate"}
            </Button>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error.message}</div>
          )}
        </div>
      )}
    </div>
    </PermissionGuard>
  );
}
