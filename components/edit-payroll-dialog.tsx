// components/edit-payroll-dialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditPayrollDialogProps {
  payroll: {
    name: string;
    notes?: string;
  };
  onSave: (updatedPayroll: { name: string; notes?: string }) => void;
}

export const EditPayrollDialog: React.FC<EditPayrollDialogProps> = ({ payroll, onSave }) => {
  const [name, setName] = useState(payroll.name);
  const [notes, setNotes] = useState(payroll.notes || '');

  const handleSave = () => {
    onSave({ name, notes });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
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
            <label className="block text-sm font-medium">Payroll Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter payroll name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes"
            />
          </div>
        </div>
        <Button onClick={handleSave} className="mt-4">
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};
