// components/notes-list-with-add.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
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
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AddNote } from "@/components/add-note";
import { GET_NOTES } from "@/graphql/queries/notes/get-notes";
import { UPDATE_NOTE } from "@/graphql/mutations/notes/updateNote";
import { Button } from "./ui/button";
import { safeFormatDateTime } from "@/utils/date-utils";
import { Edit, AlertTriangle, Save, X } from "lucide-react";

interface NotesListWithAddProps {
  entityType: "payroll" | "client";
  entityId: string;
  title?: string;
  description?: string;
  user?: {
    name: string;
    id: string;
  };
}

// Type for the actual GraphQL response structure
interface NoteFromGraphQL {
  id: string;
  content: string;
  is_important: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
  } | null;
}

export function NotesListWithAdd({
  entityType,
  entityId,
  title = "Notes",
  description = "Notes and comments",
}: NotesListWithAddProps) {
  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteFromGraphQL | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editIsImportant, setEditIsImportant] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // GraphQL operations
  const { data, loading, error, refetch } = useQuery<{
    notes: NoteFromGraphQL[];
  }>(GET_NOTES, {
    variables: { entityType, entityId },
    fetchPolicy: "cache-and-network",
  });

  const [updateNote] = useMutation(UPDATE_NOTE, {
    onCompleted: () => {
      setIsUpdating(false);
      setShowEditModal(false);
      setEditingNote(null);
      refetch();
    },
    onError: (error) => {
      console.error("Error updating note:", error);
      setIsUpdating(false);
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

  // Handle saving note updates
  const handleSaveNote = async () => {
    if (!editingNote || !editContent.trim()) return;

    setIsUpdating(true);
    try {
      await updateNote({
        variables: {
          id: editingNote.id,
          content: editContent.trim(),
          isImportant: editIsImportant,
        },
      });
    } catch (error) {
      console.error("Error updating note:", error);
      setIsUpdating(false);
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

  const notes: NoteFromGraphQL[] = data?.notes || [];

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
            <AddNote
              entityType={entityType}
              entityId={entityId}
              onSuccess={() => refetch()}
            />
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              {loading ? "Loading notes..." : "No notes available."}
            </p>
          ) : (
            <div className="space-y-4">
              {notes.map((note: NoteFromGraphQL) => (
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
              Make changes to this note. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="note-content">Note Content</Label>
              <Textarea
                id="note-content"
                placeholder="Enter your note..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px] mt-1"
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="important"
                checked={editIsImportant}
                onCheckedChange={setEditIsImportant}
                disabled={isUpdating}
              />
              <Label
                htmlFor="important"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark as important
              </Label>
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
