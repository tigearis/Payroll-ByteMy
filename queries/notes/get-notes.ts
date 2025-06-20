import { gql } from "@apollo/client"

export const GET_NOTES = gql`
query GetNotes($entityType: String!, $entityId: uuid!) {
  notes(where: {entity_type: {_eq: $entityType}, entity_id: {_eq: $entityId}}, order_by: {created_at: desc}) {
    id
    content
    is_important
    created_at
    updated_at
    user {
      name
    }
  }
}

`;