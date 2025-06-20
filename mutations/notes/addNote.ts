import { gql } from "@apollo/client";

export const ADD_NOTE = gql` 
mutation AddNote($entityType: String!, $entityId: uuid!, $userId: uuid, $content: String!, $isImportant: Boolean) {
    insert_notes_one(
      object: {
        entity_type: $entityType,
        entity_id: $entityId,
        user_id: $userId,
        content: $content,
        is_important: $isImportant
      }
    ) {
      id
      content
      created_at
    }
  }`
  ;

  