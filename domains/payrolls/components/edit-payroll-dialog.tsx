// components/edit-payroll-dialog.tsx
"use client";

import { useMutation } from "@apollo/client";
import { useState, memo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  UpdatePayrollDocument,
  GetPayrollsSimpleDocument,
  GetPayrollByIdDocument,
  GetPayrollsDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import { handleGraphQLError } from "@/lib/utils/handle-graphql-error";

interface EditPayrollDialogProps {
  payroll: {
    id: string;
    name: string;
    clientId: string;
    cycleId: string;
    dateTypeId: string;
    primaryConsultantUserId: string | null;
    employeeCount: number | null;
    processingDaysBeforeEft: number | null;
    processingTime: number | null;
  };
  onSuccess?: () => void;
}

const EditPayrollDialogComponent: React.FC<EditPayrollDialogProps> = ({
  payroll,
  onSuccess,
}) => {
  const [name, setName] = useState(payroll.name);
  const [processingDaysBeforeEft, setProcessingDaysBeforeEft] = useState(
    payroll.processingDaysBeforeEft?.toString() || "3"
  );
  const [processingTime, setProcessingTime] = useState(
    payroll.processingTime?.toString() || "4"
  );
  const [isOpen, setIsOpen] = useState(false);

  // Set up the mutation with refetchQueries
  const [updatePayroll, { loading, error }] = useMutation(
    UpdatePayrollDocument,
    {
      refetchQueries: [
        { query: GetPayrollsSimpleDocument },
        { query: GetPayrollByIdDocument, variables: { id: payroll.id } },
      ],
      awaitRefetchQueries: true, // Wait for refetches to complete before considering the mutation done
      onCompleted: data => {
        toast.success("Payroll updated successfully");
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: error => {
        const errorDetails = handleGraphQLError(error);
        toast.error(`Failed to update payroll: ${errorDetails.userMessage}`);
        console.error("Payroll update error:", errorDetails);
      },
      optimisticResponse: {
        __typename: "mutation_root",
        updatePayrollsByPk: {
          __typename: "Payrolls",
          id: payroll.id,
          name,
          clientId: payroll.clientId,
          cycleId: payroll.cycleId,
          dateTypeId: payroll.dateTypeId,
          primaryConsultant: payroll.primaryConsultantUserId
            ? { id: payroll.primaryConsultantUserId }
            : (payroll as any).primaryConsultant,
          employeeCount: payroll.employeeCount,
          client: {
            __typename: "Clients",
            id: payroll.clientId,
            name: "Loading...",
          },
          status: "Active",
          processingDaysBeforeEft: 2,
          processingTime: 1,
          childPayrolls: [],
          payrollDates: [],
          requiredSkills: [],
        },
      },
      update: (cache, { data: _data }) => {
        // We could also use the updatePayrollInCache utility here, but this way works too
        if (!_data?.updatePayrollsByPk) {
          return;
        }

        // Manually update any related lists that might not be refetched immediately
        try {
          // Find the payroll in the GET_PAYROLLS query result
          const existingPayrollsQuery = cache.readQuery<{ payrolls: any[] }>({
            query: GetPayrollsDocument,
          });

          if (existingPayrollsQuery?.payrolls) {
            const updatedPayrolls = existingPayrollsQuery.payrolls.map(
              (p: any) => (p.id === payroll.id ? { ...p, name } : p)
            );

            // Write the updated list back to the cache
            cache.writeQuery({
              query: GetPayrollsDocument,
              data: {
                __typename: "query_root",
                payrolls: updatedPayrolls,
                payrollsAggregate: {
                  __typename: "PayrollsAggregate",
                  aggregate: {
                    __typename: "PayrollsAggregateFields",
                    count: updatedPayrolls.length,
                  },
                },
              },
            });
          }
        } catch (err) {
          // It's okay if this fails, the refetchQueries will eventually update the UI
          console.warn("Failed to update payroll list in cache:", err);
        }
      },
    }
  );

  const handleSave = async () => {
    // Validate processing days
    const processingDaysNum = parseInt(processingDaysBeforeEft);
    if (
      isNaN(processingDaysNum) ||
      processingDaysNum < 1 ||
      processingDaysNum > 10
    ) {
      toast.error("Processing days must be between 1 and 10");
      return;
    }

    // Validate processing time
    const processingTimeNum = parseInt(processingTime);
    if (
      isNaN(processingTimeNum) ||
      processingTimeNum < 1 ||
      processingTimeNum > 24
    ) {
      toast.error("Processing time must be between 1 and 24 hours");
      return;
    }

    try {
      await updatePayroll({
        variables: {
          id: payroll.id,
          set: {
            name,
            processingDaysBeforeEft: processingDaysNum,
            processingTime: processingTimeNum,
          },
        },
      });
    } catch (err) {
      // Error handling is done in the onError callback
      console.error("Error in handleSave:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Edit Payroll
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Payroll</DialogTitle>
          <DialogDescription>Update payroll details.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Payroll Name
            </label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter payroll name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Processing Days Before EFT
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={processingDaysBeforeEft}
                onChange={e => setProcessingDaysBeforeEft(e.target.value)}
                placeholder="e.g., 3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Business days required for payroll processing before EFT date
                (1-10 days)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Processing Time (Hours)
              </label>
              <Input
                type="number"
                min="1"
                max="24"
                value={processingTime}
                onChange={e => setProcessingTime(e.target.value)}
                placeholder="e.g., 4"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum hours needed to process this payroll (1-24 hours)
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {error && (
          <div className="mt-2 text-red-500 text-sm">{error.message}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// PERFORMANCE OPTIMIZED EXPORT WITH REACT.MEMO
// ============================================================================

/**
 * Custom comparison function for EditPayrollDialog React.memo
 * Optimizes re-renders for dialog components with form data
 */
function areEditPayrollDialogPropsEqual(
  prevProps: EditPayrollDialogProps,
  nextProps: EditPayrollDialogProps
): boolean {
  // Compare payroll object properties
  if (prevProps.payroll !== nextProps.payroll) {
    const prev = prevProps.payroll;
    const next = nextProps.payroll;

    return (
      prev.id === next.id &&
      prev.name === next.name &&
      prev.clientId === next.clientId &&
      prev.cycleId === next.cycleId &&
      prev.dateTypeId === next.dateTypeId &&
      prev.primaryConsultantUserId === next.primaryConsultantUserId &&
      prev.employeeCount === next.employeeCount &&
      prev.processingDaysBeforeEft === next.processingDaysBeforeEft &&
      prev.processingTime === next.processingTime
    );
  }

  // Function comparison - onSuccess typically changes, but we don't need to re-render for that
  // Dialog behavior remains the same regardless of the callback function reference

  return true;
}

/**
 * Memoized EditPayrollDialog Component
 *
 * Prevents unnecessary re-renders when payroll data hasn't changed.
 * Optimized for dialog interactions and form updates.
 */
export const EditPayrollDialog = memo(
  EditPayrollDialogComponent,
  areEditPayrollDialogPropsEqual
);
