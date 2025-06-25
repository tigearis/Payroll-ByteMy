export interface NotesListWithAddProps {
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
export interface NoteFromGraphQL {
  id: string;
  content: string;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
  } | null;
}

// Extracted from inline types
export interface NotesModalProps {
  note: {
    id: string;
    content: string;
  };
  refetchNotes: () => void;
}

export interface AddNoteProps {
  entityType: "payroll" | "client";
  entityId: string;
  onSuccess?: () => void;
}

export interface NoteData {
  id: string;
  entityId: string;
  entityType: string;
  content: string;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
}
