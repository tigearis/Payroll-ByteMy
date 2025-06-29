// components/generate-missing-dates-button.tsx
"use client";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useLazyQuery, gql } from "@apollo/client";
import { format, addMonths } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  GeneratePayrollDatesQueryDocument,
  GetPayrollsMissingDatesDocument,
  GetPayrollsDocument,
} from '@/domains/payrolls/graphql/generated/graphql';
import { PermissionGuard } from "@/components/auth/permission-guard";

interface GenerateMissingDatesButtonProps {
  payrollIds: string[];
  onSuccess?: () => void;
}

export function GenerateMissingDatesButton({
  payrollIds,
  onSuccess,
}: GenerateMissingDatesButtonProps) {
  return (
    <PermissionGuard permission="payroll:write">
      <GenerateMissingDatesButtonInner
        payrollIds={payrollIds}
        onSuccess={onSuccess}
      />
    </PermissionGuard>
  );
}

function GenerateMissingDatesButtonInner({
  payrollIds,
  onSuccess,
}: GenerateMissingDatesButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Set up the query with proper refetching
  const [generatePayrollDates, { error, client }] = useLazyQuery(
    GeneratePayrollDatesQueryDocument,
    {
      fetchPolicy: "network-only",
      onError: error => {
        toast.error(`Generation failed: ${error.message}`);
      },
    }
  );

  const handleGenerateMissingDates = async () => {
    if (payrollIds.length === 0) {
      toast.warning("No payroll IDs provided");
      return;
    }

    try {
      setIsGenerating(true);
      toast.info(`Starting generation for ${payrollIds.length} payrolls...`);

      const startDate = new Date();
      const endDate = addMonths(startDate, 24);

      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      let successCount = 0;
      let errorCount = 0;

      // Process payrolls in batches to avoid overwhelming the server
      const batchSize = 5;
      for (let i = 0; i < payrollIds.length; i += batchSize) {
        const batch = payrollIds.slice(i, i + batchSize);

        // Use Promise.allSettled to continue even if some fail
        const results = await Promise.allSettled(
          batch.map(id =>
            generatePayrollDates({
              variables: {
                payrollId: id,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
              },
            })
          )
        );

        // Count successes and failures
        results.forEach(result => {
          if (result.status === "fulfilled") {
            successCount++;
          } else {
            errorCount++;
            console.error(`Error generating dates:`, result.reason);
          }
        });

        // Give UI time to breathe between batches
        if (i + batchSize < payrollIds.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Final refetch to ensure everything is up to date
      await client.refetchQueries({
        include: [GetPayrollsMissingDatesDocument, GetPayrollsDocument],
      });

      // Show appropriate message based on results
      if (errorCount === 0) {
        toast.success(
          `Successfully generated dates for all ${successCount} payrolls`
        );
      } else if (successCount > 0) {
        toast.warning(
          `Generated dates for ${successCount} payrolls. Failed for ${errorCount} payrolls.`
        );
      } else {
        toast.error("Failed to generate dates for all payrolls");
      }

      if (onSuccess && successCount > 0) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error generating dates:", error);
      toast.error("Failed to generate dates");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleGenerateMissingDates} disabled={isGenerating}>
      {isGenerating ? "Generating..." : "Generate Missing Dates"}
    </Button>
  );
}
