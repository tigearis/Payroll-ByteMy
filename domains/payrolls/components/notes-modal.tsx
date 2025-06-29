"use client";

import { useMutation } from "@apollo/client";
import { Edit, Save, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UpdatePayrollDateNotesDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { PermissionGuard } from "@/components/auth/permission-guard";

interface Note {
  id: string;
  content: string;
}

interface NotesModalProps {
  note: Note;
  refetchNotes: () => void;
  trigger?: React.ReactNode;
}

export function NotesModal({ note, refetchNotes, trigger }: NotesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(note.content || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const [updateNotes] = useMutation(UpdatePayrollDateNotesDocument, {
    onCompleted: () => {
      setIsUpdating(false);
      setIsOpen(false);
      toast.success("Notes updated successfully");
      refetchNotes();
    },
    onError: error => {
      console.error("Error updating notes:", error);
      setIsUpdating(false);
      toast.error(`Failed to update notes: ${error.message}`);
    },
  });

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateNotes({
        variables: {
          id: note.id,
          notes: notes.trim() || null,
        },
      });
    } catch (error) {
      console.error("Error updating notes:", error);
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setNotes(note.content || ""); // Reset to original notes
  };

  return (
    <PermissionGuard permission="payroll:write">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payroll Date Notes</DialogTitle>
          <DialogDescription>
            Add or edit notes for this payroll date. Notes will be visible to
            all team members.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter notes about this payroll date..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Notes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </PermissionGuard>
  );
}
