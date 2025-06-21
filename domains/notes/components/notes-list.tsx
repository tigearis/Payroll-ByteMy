// components/notes-list.tsx
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { Edit, AlertTriangle, Save, X, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";

// Use domain GraphQL operations
import { NoteFromGraphQL, NotesListWithAddProps } from "@/domains/notes/types";
import { 
  GetNotesExtractedQuery, 
  GetNotesExtractedDocument,
  UpdateNoteExtractedDocument,
  AddNoteExtractedDocument,
} from "@/domains/notes/graphql/generated/graphql";

import { safeFormatDateTime } from "@/lib/utils/date-utils";

export function NotesList({
  entityType,
  entityId,
  title = "Notes",
  description = "Notes and comments",
}: NotesListWithAddProps) {
  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editIsImportant, setEditIsImportant] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // State for add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addContent, setAddContent] = useState("");
  const [addIsImportant, setAddIsImportant] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // GraphQL operations
  const { data, loading, error, refetch } = useQuery<GetNotesExtractedQuery>(
    GetNotesExtractedDocument,
    {
      variables: { entityType, entityId },
      fetchPolicy: "cache-and-network",
    }
  );

  const [updateNote] = useMutation(UpdateNoteExtractedDocument, {
    onCompleted: () => {
      setIsUpdating(false);
      setShowEditModal(false);
      setEditingNote(null);
      toast.success("Note updated successfully");
      refetch();
    },
    onError: (error) => {
      console.error("Error updating note:", error);
      setIsUpdating(false);
      toast.error(`Failed to update note: ${error.message}`);
    },
  });

  const [addNote] = useMutation(AddNoteExtractedDocument, {
    onCompleted: () => {
      setIsAdding(false);
      setShowAddModal(false);
      setAddContent("");
      setAddIsImportant(false);
      toast.success("Note added successfully");
      refetch();
    },
    onError: (error) => {
      console.error("Error adding note:", error);
      setIsAdding(false);
      toast.error(`Failed to add note: ${error.message}`);
    },
  });

  // Handle opening edit modal
  const handleEditNote = (note: NoteFromGraphQL) => {
    setEditingNote(note);
    setEditContent(note.content);
    setEditIsImportant(note.is_important);
    setShowEditModal(true);
  };

  // Handle closing edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingNote(null);
    setEditContent("");
    setEditIsImportant(false);
  };

  // Handle closing add modal
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddContent("");
    setAddIsImportant(false);
  };

  // Handle saving note updates
  const handleSaveNote = async () => {
    if (!editingNote || !editContent.trim()) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateNote({
        variables: {
          id: editingNote.id,
          content: editContent.trim(),
        },
      });
    } catch (error) {
      console.error("Error updating note:", error);
      setIsUpdating(false);
    }
  };

  // Handle adding new note
  const handleAddNote = async () => {
    if (!addContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }

    setIsAdding(true);
    try {
      await addNote({
        variables: {
          entity_type: entityType,
          entity_id: entityId,
          content: addContent.trim(),
        },
      });
    } catch (error) {
      console.error("Error adding note:", error);
      setIsAdding(false);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            Error loading notes. Please try again later.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const notes = data?.notes || [];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>{title}</CardTitle>
                {loading && (
                  <span className="text-xs text-muted-foreground">
                    Loading...
                  </span>
                )}
              </div>
              <CardDescription>{description}</CardDescription>
            </div>

            {/* Add Note Button */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  className="gap-1.5"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Note
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Note</DialogTitle>
                  <DialogDescription>
                    Add a new note to this item.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="add-note-content">Note Content</Label>
                    <Textarea
                      id="add-note-content"
                      placeholder="Enter your note here..."
                      value={addContent}
                      onChange={(e) => setAddContent(e.target.value)}
                      className="min-h-[100px] mt-1"
                      disabled={isAdding}
                    />
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    onClick={handleCloseAddModal}
                    disabled={isAdding}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddNote}
                    disabled={isAdding || !addContent.trim()}
                  >
                    {isAdding ? (
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <PlusCircle className="w-4 h-4 mr-2" />
                    )}
                    {isAdding ? "Adding..." : "Add Note"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              {loading ? "Loading notes..." : "No notes available."}
            </p>
          ) : (
            <div className="space-y-4">
              {notes.map((note: any) => (
                <div
                  key={note.id}
                  className={`group p-3 rounded-md border cursor-pointer transition-all hover:shadow-md hover:border-gray-300 ${
                    note.is_important
                      ? "border-red-200 bg-red-50"
                      : "bg-gray-50"
                  }`}
                  onClick={() => handleEditNote(note)}
                >
                  <div className="flex items-start justify-between">
                    <p className="whitespace-pre-wrap flex-1 pr-2">
                      {note.content}
                    </p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>{note.user?.name || "Anonymous"}</span>
                      {note.is_important && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="text-xs font-medium">Important</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div>Created: {safeFormatDateTime(note.created_at)}</div>
                      {note.updated_at !== note.created_at && (
                        <div className="text-xs text-gray-500 mt-1">
                          Updated: {safeFormatDateTime(note.updated_at)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Note Modal */}
      <Dialog open={showEditModal} onOpenChange={handleCloseEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to this note. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-note-content">Note Content</Label>
              <Textarea
                id="edit-note-content"
                placeholder="Enter your note..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px] mt-1"
                disabled={isUpdating}
              />
            </div>

            {editingNote && (
              <div className="text-xs text-muted-foreground border-t pt-2">
                <p>Created by: {editingNote.user?.name || "Anonymous"}</p>
                <p>Created: {safeFormatDateTime(editingNote.created_at)}</p>
                {editingNote.updated_at !== editingNote.created_at && (
                  <p>
                    Last updated: {safeFormatDateTime(editingNote.updated_at)}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCloseEditModal}
              disabled={isUpdating}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveNote}
              disabled={isUpdating || !editContent.trim()}
            >
              {isUpdating ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export the consolidated component with the expected name for backward compatibility
export { NotesList as NotesListWithAdd };
