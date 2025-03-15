// components/regenerate-dates.tsx
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { format, addMonths } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the mutation
const GENERATE_PAYROLL_DATES = gql`
  mutation GeneratePayrollDates($payrollId: uuid!, $startDate: date!, $endDate: date!) {
    generate_payroll_dates(
      p_payroll_id: $payrollId, 
      p_start_date: $startDate, 
      p_end_date: $endDate
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
    }
  }
`;

// Query to fetch payroll dates
const GET_PAYROLL_DATES = gql`
  query GetPayrollDates($id: uuid!) {
    payroll_dates(
      where: { payroll_id: { _eq: $id } },
      order_by: { adjusted_eft_date: asc }
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      notes
    }
  }
`;

interface RegenerateDatesProps {
  payrollId: string;
  onSuccess?: () => void;
}

export function RegenerateDates({ payrollId, onSuccess }: RegenerateDatesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [months, setMonths] = useState(12);

  // Set up the mutation with proper refetching
  const [generateDates, { loading, error }] = useMutation(GENERATE_PAYROLL_DATES, {
    refetchQueries: [
      { query: GET_PAYROLL_DATES, variables: { id: payrollId } },
      'GET_PAYROLLS', // Refetch the main payrolls list if you have this query
      'GET_PAYROLLS_BY_MONTH' // Refetch the schedule view if it's open
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      const count = data?.generate_payroll_dates?.length || 0;
      toast.success(`Successfully generated ${count} payroll dates`);
      setIsDialogOpen(false);
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      toast.error(`Failed to generate dates: ${err.message}`);
    },
    update: (cache) => {
      // Update the payroll entity to indicate it has dates
      try {
        // We need to find the specific payroll in the cache
        const payrollCacheId = `payrolls:${payrollId}`;
        
        // Attempt to read the existing payroll from the cache
        const existingPayroll = cache.readFragment({
          id: payrollCacheId,
          fragment: gql`
            fragment PayrollDatesCount on payrolls {
              id
              payroll_dates_aggregate {
                aggregate {
                  count
                }
              }
            }
          `
        }) as { payroll_dates_aggregate?: { aggregate?: { count?: number } } } | null;
        
        if (existingPayroll) {
          // Update the payroll dates count in the cache optimistically
          cache.writeFragment({
            id: payrollCacheId,
            fragment: gql`
              fragment PayrollDatesCount on payrolls {
                id
                payroll_dates_aggregate {
                  aggregate {
                    count
                  }
                }
              }
            `,
            data: {
              id: payrollId,
              __typename: "payrolls",
              payroll_dates_aggregate: {
                __typename: "payroll_dates_aggregate",
                aggregate: {
                  __typename: "payroll_dates_aggregate_fields",
                  count: (existingPayroll.payroll_dates_aggregate?.aggregate?.count || 0) + months * 1.5 // approximate count
                }
              }
            }
          });
        }
      } catch (err) {
        console.warn("Failed to update payroll dates count in cache:", err);
        // It's okay if this fails, the refetchQueries will eventually update the UI
      }
    }
  });

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
          startDate: format(today, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        },
      });
    } catch (err) {
      // Error handled by onError callback
      console.error("Error in regenerate:", err);
    }
  };

  return (
    <div>
      {!isDialogOpen ? (
        <Button
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
        >
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
                onChange={(e) => setMonths(parseInt(e.target.value) || 12)}
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
            <Button
              onClick={handleRegenerate}
              disabled={loading}
            >
              {loading ? "Regenerating..." : "Regenerate"}
            </Button>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
