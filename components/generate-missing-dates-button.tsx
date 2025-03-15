'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMutation } from '@apollo/client';
import { GENERATE_PAYROLL_DATES } from '@/graphql/mutations/payrolls/generatePayrollDates';


interface GenerateMissingDatesButtonProps {
  payrollIds: string[];
  onSuccess?: () => void;
}

export function GenerateMissingDatesButton({ payrollIds, onSuccess }: GenerateMissingDatesButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatePayrollDates] = useMutation(GENERATE_PAYROLL_DATES);

  const handleGenerateMissingDates = async () => {
    if (payrollIds.length === 0) {
      console.warn("No payroll IDs provided.");
      return;
    }
  
    try {
      setIsGenerating(true);
  
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + 24);
      const maxDates = 104;
  
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
  
      console.log("Starting generation for payrolls:", payrollIds);
  
      let successCount = 0;
      let errorCount = 0;
  
      for (const id of payrollIds) {
        try {
          console.log(`Processing payroll ID: ${id}`);
  
          const response = await generatePayrollDates({
            variables: {
              args: {
                p_payroll_id: id,
                p_start_date: formattedStartDate,
                p_end_date: formattedEndDate,
                p_max_dates: maxDates,
              },
            },
            refetchQueries: ['GET_PAYROLLS_MISSING_DATES'], // Refetch relevant query
          });
  
          if (response.errors || !response.data) {
            console.error(`Error generating dates for payroll ${id}:`, response.errors || "No data returned");
            errorCount++;
          } else {
            console.log(`Successfully generated dates for payroll ${id}`);
            successCount++;
          }
        } catch (err) {
          console.error(`Error generating dates for payroll ${id}:`, err);
          errorCount++;
        }
      }
  
      if (errorCount === 0) {
        toast.success(`Successfully generated dates for all ${successCount} payrolls.`);
      } else if (successCount > 0) {
        toast.warning(`Generated dates for ${successCount} payrolls. Failed for ${errorCount} payrolls.`);
      } else {
        toast.error("Failed to generate dates for all payrolls.");
      }
  
      if (onSuccess && successCount > 0) {
        onSuccess(); // Trigger any additional success logic
      }
    } catch (error) {
      console.error("Error generating dates:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsGenerating(false);
    }
  };
  

  return (
    <Button onClick={handleGenerateMissingDates} disabled={isGenerating}>
      {isGenerating ? 'Generating...' : 'Generate Missing Dates'}
    </Button>
  );
}
