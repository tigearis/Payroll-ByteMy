"use client";

import { useMutation } from "@apollo/client";
import { Edit2, Plus, Save, StickyNote, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UpdatePayrollDateNotesDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { safeFormatDate } from "@/lib/utils/date-utils";

interface PayrollDateNote {
  id: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

interface NotesListModalProps {
  payrollDateId: string;
  existingNotes: string | null;
  payrollDate?: string;
  refetchNotes: () => void;
  trigger?: React.ReactNode;
}

// Helper function to parse notes from the single notes field
// We'll store multiple notes as JSON string for now
function parseNotes(notesString: string | null): PayrollDateNote[] {
  if (!notesString) return [];

  try {
    // Check if it's JSON format (for multiple notes)
    const parsed = JSON.parse(notesString);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // If it's not an array, treat it as a single note
    return [
      {
        id: "1",
        text: notesString,
        createdAt: new Date().toISOString(),
      },
    ];
  } catch {
    // If not JSON, treat as single note
    return [
      {
        id: "1",
        text: notesString,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

// Helper function to stringify notes for storage
function stringifyNotes(notes: PayrollDateNote[]): string {
  if (notes.length === 0) return "";
  if (notes.length === 1) return notes[0].text;
  return JSON.stringify(notes);
}

export function NotesListModal({
  payrollDateId,
  existingNotes,
  payrollDate,
  refetchNotes,
  trigger,
}: NotesListModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<PayrollDateNote[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize notes when modal opens
  useEffect(() => {
    if (isOpen) {
      const parsedNotes = parseNotes(existingNotes);
      setNotes(parsedNotes);
      // If no notes exist, start in add mode
      if (parsedNotes.length === 0) {
        setIsAddingNew(true);
      }
    }
  }, [isOpen, existingNotes]);

  const [updateNotes] = useMutation(UpdatePayrollDateNotesDocument, {
    onCompleted: () => {
      setIsSaving(false);
      toast.success("Notes updated successfully");
      refetchNotes();
    },
    onError: error => {
      console.error("Error updating notes:", error);
      setIsSaving(false);
      toast.error(`Failed to update notes: ${error.message}`);
    },
  });

  const handleSaveNote = async (noteId: string) => {
    const noteIndex = notes.findIndex(n => n.id === noteId);
    if (noteIndex === -1) return;

    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = {
      ...updatedNotes[noteIndex],
      text: editingText,
      updatedAt: new Date().toISOString(),
    };

    setNotes(updatedNotes);
    setEditingNoteId(null);

    // Save to database
    await saveNotesToDatabase(updatedNotes);
  };

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;

    const newNote: PayrollDateNote = {
      id: Date.now().toString(),
      text: newNoteText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setNewNoteText("");
    setIsAddingNew(false);

    // Save to database
    await saveNotesToDatabase(updatedNotes);
  };

  const handleDeleteNote = async (noteId: string) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);

    // Save to database
    await saveNotesToDatabase(updatedNotes);
  };

  const saveNotesToDatabase = async (notesToSave: PayrollDateNote[]) => {
    setIsSaving(true);
    try {
      const notesString = stringifyNotes(notesToSave);
      await updateNotes({
        variables: {
          id: payrollDateId,
          notes: notesString || null,
        },
      });
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingNoteId(null);
    setIsAddingNew(false);
    setNewNoteText("");
    setEditingText("");
  };

  const startEditing = (note: PayrollDateNote) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
    setIsAddingNew(false);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingText("");
  };

  // const hasNotes = notes.length > 0; // not currently used in UI rendering
  // Check if there are existing notes for the trigger display
  const hasExistingNotes = !!existingNotes && existingNotes.trim() !== "";

  return (
    <PermissionGuard action="update">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="ghost"
              size="sm"
              className={
                hasExistingNotes
                  ? "text-blue-600 hover:text-blue-700"
                  : "text-gray-500 hover:text-blue-600"
              }
            >
              {hasExistingNotes ? (
                <StickyNote className="h-4 w-4" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add note
                </>
              )}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes for Payroll Date
            </DialogTitle>
            <DialogDescription>
              {payrollDate ? (
                <span className="text-sm">
                  EFT Date: {safeFormatDate(payrollDate, "dd MMM yyyy")}
                </span>
              ) : (
                "Manage notes for this payroll date"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Notes List */}
            {notes.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {notes.map((note, index) => (
                    <div key={note.id}>
                      {editingNoteId === note.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingText}
                            onChange={e => setEditingText(e.target.value)}
                            className="min-h-[80px]"
                            placeholder="Enter note..."
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditing}
                              disabled={isSaving}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveNote(note.id)}
                              disabled={isSaving || !editingText.trim()}
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="group relative p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="pr-8">
                            <p className="text-sm whitespace-pre-wrap">
                              {note.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {note.updatedAt
                                ? `Updated ${safeFormatDate(note.updatedAt, "dd MMM yyyy h:mm a")}`
                                : `Added ${safeFormatDate(note.createdAt, "dd MMM yyyy h:mm a")}`}
                            </p>
                          </div>
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(note)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {index < notes.length - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <StickyNote className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No notes yet</p>
                <p className="text-sm mt-1">
                  Click below to add the first note
                </p>
              </div>
            )}

            {/* Add New Note Section */}
            {isAddingNew ? (
              <div className="mt-4 space-y-2 pt-4 border-t">
                <Label>New Note</Label>
                <Textarea
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  className="min-h-[80px]"
                  placeholder="Enter your note..."
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewNoteText("");
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    disabled={isSaving || !newNoteText.trim()}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Note
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingNew(true)}
                  disabled={editingNoteId !== null}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Note
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PermissionGuard>
  );
}
