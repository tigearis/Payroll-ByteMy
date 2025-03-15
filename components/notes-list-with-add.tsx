// components/notes-list-with-add.tsx
'use client';

import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AddNote } from '@/components/add-note';
import { Note } from '@/types/interface';
import { GET_NOTES } from '@/graphql/queries/notes/get-notes';


interface NotesListWithAddProps {
  entityType: 'payroll' | 'client';
  entityId: string;
  title?: string;
  description?: string;
  user?: {
    name: string;
    id: string;
  }
}

export function NotesListWithAdd({ 
  entityType, 
  entityId, 
  title = 'Notes',
  description = 'Notes and comments'
}: NotesListWithAddProps) {
  const { data, loading, error, refetch } = useQuery<{ notes: Note[] }>(GET_NOTES, {
    variables: { entityType, entityId },
    fetchPolicy: 'cache-and-network',
  });
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading notes: {error.message}</p>
        </CardContent>
      </Card>
    );
  }
  
  const notes: Note[] = data?.notes || [];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{title}</CardTitle>
              {loading && <span className="text-xs text-muted-foreground">Loading...</span>}
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
            {loading ? 'Loading notes...' : 'No notes available.'}
          </p>
        ) : (
          <div className="space-y-4">
            {notes.map((note: Note) => (
              <div 
                key={note.id} 
                className={`p-3 rounded-md border ${
                  note.isImportant ? 'border-red-200 bg-red-50' : 'bg-gray-50'
                }`}
              >
                <p className="whitespace-pre-wrap">{note.content}</p>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>
                    {note.user?.name || 'Anonymous'}
                  </span>
                  <span>
                    {format(parseISO(note.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}