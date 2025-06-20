// components/add-note.tsx
'use client';

import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

// Mutation to add a note
const ADD_NOTE = gql`
  mutation AddNote($entityType: String!, $entityId: uuid!, $content: String!) {
    insert_notes_one(object: {
      entity_type: $entityType,
      entity_id: $entityId,
      content: $content,
      is_important: false
    }) {
      id
      entity_id
      entity_type
      content
      is_important
      created_at
      updated_at
    }
  }
`;

// Query to get notes
const GET_NOTES = gql`
  query GetNotes($entityType: String!, $entityId: uuid!) {
    notes(
      where: {
        entity_type: {_eq: $entityType},
        entity_id: {_eq: $entityId}
      },
      order_by: {created_at: desc}
    ) {
      id
      content
      is_important
      created_at
      updated_at
    }
  }
`;

interface AddNoteProps {
  entityType: 'payroll' | 'client';
  entityId: string;
  onSuccess?: () => void;
}

export function AddNote({ entityType, entityId, onSuccess }: AddNoteProps) {
  const [noteContent, setNoteContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const [addNote, { loading }] = useMutation(ADD_NOTE, {
    refetchQueries: [
      {
        query: GET_NOTES,
        variables: { entityType, entityId }
      }
    ],
    onCompleted: () => {
      setNoteContent('');
      setIsOpen(false);
      toast.success('Note added successfully');
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to add note: ${error.message}`);
    },
    // Define the optimistic response
    optimisticResponse: {
      insert_notes_one: {
        __typename: 'notes',
        id: `temp-${Date.now()}`, // Temporary ID that will be replaced
        entity_id: entityId,
        entity_type: entityType,
        content: noteContent,
        is_important: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    },
    // Update the cache immediately with the optimistic response
    update: (cache, { data }) => {
      // Skip if we don't have data yet (should never happen with optimistic response)
      if (!data?.insert_notes_one) return;
      
      try {
        // Try to read existing notes from the cache
        const existingData = cache.readQuery<{ notes: any[] }>({
          query: GET_NOTES,
          variables: { entityType, entityId }
        });
        
        // If we found existing notes, prepend our new note
        if (existingData && existingData.notes) {
          cache.writeQuery({
            query: GET_NOTES,
            variables: { entityType, entityId },
            data: {
              notes: [data.insert_notes_one, ...existingData.notes]
            }
          });
        } else {
          // If no existing notes, create a new array with just this note
          cache.writeQuery({
            query: GET_NOTES,
            variables: { entityType, entityId },
            data: {
              notes: [data.insert_notes_one]
            }
          });
        }
      } catch (error) {
        // It's okay if this fails, the refetchQuery will update the UI
        console.warn('Failed to update notes cache:', error);
      }
    }
  });
  
  const handleAddNote = () => {
    if (!noteContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }
    
    addNote({
      variables: {
        entityType,
        entityId,
        content: noteContent.trim()
      }
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          Add Note
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        
        <Textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Enter your note here..."
          rows={5}
          className="mt-2"
        />
        
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddNote}
            disabled={loading || !noteContent.trim()}
          >
            {loading ? 'Adding...' : 'Add Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}