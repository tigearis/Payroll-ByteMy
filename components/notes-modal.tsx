// components/notes-modal.tsx
// Update to support editing:

'use client';

import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Add this mutation
const UPDATE_NOTE = gql`
  mutation UpdateNote($id: uuid!, $content: String!) {
    update_notes_by_pk(
      pk_columns: { id: $id },
      _set: { content: $content, updated_at: "now()" }
    ) {
      id
      content
      updated_at
    }
  }
`;

interface NotesModalProps {
  note: {
    id: string;
    content: string;
  };
  refetchNotes: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ note, refetchNotes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [noteContent, setNoteContent] = useState(note.content || '');
  
  const [updateNote, { loading }] = useMutation(UPDATE_NOTE, {
    onCompleted: () => {
      toast.success('Note updated successfully');
      setIsOpen(false);
      refetchNotes();
    },
    onError: (error) => {
      toast.error(`Failed to update note: ${error.message}`);
    }
  });

  const handleSave = () => {
    if (!noteContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }
    
    updateNote({
      variables: {
        id: note.id,
        content: noteContent.trim()
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-500 hover:text-blue-700 p-0 h-auto">
          View Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={6}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};