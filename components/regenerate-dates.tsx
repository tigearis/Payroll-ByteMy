// components/regenerate-dates.tsx
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { GENERATE_PAYROLL_DATES } from "@/graphql/mutations/payrolls/generatePayrollDates";
import { Button } from "@/components/ui/button";

interface RegenerateDatesProps {
  payrollId: string;
}

export function RegenerateDates({ payrollId }: RegenerateDatesProps) {
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [regenerateMonths, setRegenerateMonths] = useState(12);
  const [generateDates, { loading: regenerateLoading }] = useMutation(GENERATE_PAYROLL_DATES);

  const handleRegenerate = async () => {
    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setMonth(today.getMonth() + regenerateMonths);

      const formatDate = (date: Date) => date.toISOString().split('T')[0];

      const result = await generateDates({
        variables: {
          payrollId,
          startDate: formatDate(today),
          endDate: formatDate(endDate),
        },
      });

      if (result.data?.generate_payroll_dates && result.data.generate_payroll_dates.length > 0) {
        setRegenerateOpen(false);
      } else {
        console.error("Failed to generate payroll dates - no dates returned");
      }
    } catch (err) {
      console.error("Error regenerating payroll dates:", err);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => setRegenerateOpen(true)}
      >
        Regenerate Dates
      </Button>
      {regenerateOpen && (
        <div className="mt-4">
          <label>Months to Generate:</label>
          <input
            type="number"
            min="1"
            max="36"
            value={regenerateMonths}
            onChange={(e) => setRegenerateMonths(parseInt(e.target.value) || 24)}
          />
          <Button
            onClick={handleRegenerate}
            disabled={regenerateLoading}
          >
            {regenerateLoading ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>
      )}
    </div>
  );
}
