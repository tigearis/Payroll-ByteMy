/**
 * Notes Domain Types
 * Notes are cross-domain (used by clients and payrolls), so main types are in components.ts
 */

// Re-export core Note type from main types
export type { Note } from "@/types/interfaces";

// Re-export component types from main types
export type {
  NotesListWithAddProps,
  NoteFromGraphQL,
  NotesModalProps,
  AddNoteProps,
  NoteData,
  NoteInput
} from "@/types/components";