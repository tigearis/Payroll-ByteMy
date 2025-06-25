// components/edit-payroll-dialog.tsx
"use client";

import { useMutation } from "@apollo/client";
import { useState } from "react";
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
  };
  onSuccess?: () => void;
}

export const EditPayrollDialog: React.FC<EditPayrollDialogProps> = ({
  payroll,
  onSuccess,
}) => {
  const [name, setName] = useState(payroll.name);
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
        updatePayrollById: {
          __typename: "payrolls",
          id: payroll.id,
          name,
          clientId: payroll.clientId,
          cycleId: payroll.cycleId,
          dateTypeId: payroll.dateTypeId,
          primaryConsultantUserId: payroll.primaryConsultantUserId,
          employeeCount: payroll.employeeCount,
          client: {
            __typename: "clients",
            id: payroll.clientId,
            name: "Loading...",
          },
          status: "Active",
          processingDaysBeforeEft: 2,
          processingTime: 1,
        },
      },
      update: (cache, { data }) => {
        // We could also use the updatePayrollInCache utility here, but this way works too
        if (!data?.updatePayrollById) {
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
                  __typename: "payrollsAggregate",
                  aggregate: {
                    __typename: "payrollsAggregateFields",
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
    try {
      await updatePayroll({
        variables: {
          id: payroll.id,
          set: {
            name,
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
      <DialogContent className="sm:max-w-[425px]">
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
