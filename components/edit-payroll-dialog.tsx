// components/edit-payroll-dialog.tsx
'use client';

import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { Textarea } from "@/components/ui/textarea";

// Define the mutation
const UPDATE_PAYROLL = gql`
  mutation UpdatePayroll($id: uuid!, $name: String, $notes: String) {
    update_payrolls_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        name: $name,
        notes: $notes,
        updated_at: "now()"
      }
    ) {
      id
      name
      notes
      updated_at
    }
  }
`;

// Query for payrolls list (used for optimistic updates)
const GET_PAYROLLS = gql`
  query GetPayrolls {
    payrolls {
      id
      name
      status
      updated_at
      client {
        id
        name
      }
    }
  }
`;

interface EditPayrollDialogProps {
  payroll: {
    id: string;
    name: string;
    notes?: string;
  };
  onSuccess?: () => void;
}

export const EditPayrollDialog: React.FC<EditPayrollDialogProps> = ({ payroll, onSuccess }) => {
  const [name, setName] = useState(payroll.name);
  const [notes, setNotes] = useState(payroll.notes || '');
  const [isOpen, setIsOpen] = useState(false);
  
  // Set up the mutation with refetchQueries
  const [updatePayroll, { loading, error }] = useMutation(UPDATE_PAYROLL, {
    refetchQueries: [
      'GET_PAYROLLS',                   // Refetch the payrolls list
      { query: gql`                     // Refetch the specific payroll details
        query GetPayrollById($id: uuid!) {
          payrolls(where: {id: {_eq: $id}}) {
            id
            name
            notes
            updated_at
          }
        }`, 
        variables: { id: payroll.id } 
      }
    ],
    awaitRefetchQueries: true,         // Wait for refetches to complete before considering the mutation done
    onCompleted: (data) => {
      toast.success('Payroll updated successfully');
      setIsOpen(false);
      if (onSuccess) {onSuccess();}
    },
    onError: (error) => {
      toast.error(`Failed to update payroll: ${error.message}`);
    },
    optimisticResponse: {
      // Provide an optimistic response that will be used to update the cache immediately
      update_payrolls_by_pk: {
        __typename: "payrolls",
        id: payroll.id,
        name,
        notes: notes.trim() || null,
        updated_at: new Date().toISOString()
      }
    },
    update: (cache, { data }) => {
      // We could also use the updatePayrollInCache utility here, but this way works too
      if (!data?.update_payrolls_by_pk) {return;}
      
      // Manually update any related lists that might not be refetched immediately
      try {
        // Find the payroll in the GET_PAYROLLS query result
        const existingPayrollsQuery = cache.readQuery<{ payrolls: any[] }>({ query: GET_PAYROLLS });
        
        if (existingPayrollsQuery?.payrolls) {
          const updatedPayrolls = existingPayrollsQuery.payrolls.map((p: any) => 
            p.id === payroll.id ? { ...p, name } : p
          );
          
          // Write the updated list back to the cache
          cache.writeQuery({
            query: GET_PAYROLLS,
            data: {
              ...existingPayrollsQuery,
              payrolls: updatedPayrolls
            }
          });
        }
      } catch (err) {
        // It's okay if this fails, the refetchQueries will eventually update the UI
        console.warn('Failed to update payroll list in cache:', err);
      }
    }
  });

  const handleSave = async () => {
    try {
      await updatePayroll({ 
        variables: { 
          id: payroll.id,
          name,
          notes: notes.trim() || null
        } 
      });
    } catch (err) {
      // Error handling is done in the onError callback
      console.error('Error in handleSave:', err);
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
          <DialogDescription>Update payroll details and notes.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Payroll Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter payroll name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes"
              rows={4}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error.message}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
