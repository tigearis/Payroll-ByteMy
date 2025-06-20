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
  is_important: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
  } | null;
}
