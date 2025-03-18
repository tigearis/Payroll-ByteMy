import { gql } from "@apollo/client";

export const UPDATE_NOTE = gql` 
  mutation UpdateNote($id: uuid!, $content: String, $isImportant: Boolean) {
    update_notes_by_pk(
      pk_columns: { id: $id },
      _set: {
        content: $content,
        is_important: $isImportant,
        updated_at: "now()"
      }
    ) {
      id
      updated_at
    }
  }`
  ;