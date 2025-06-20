// graphql/mutations/clients/deleteClient.ts
import { gql } from "@apollo/client";

export const DELETE_CLIENT = gql` 
  mutation DeleteClient($id: uuid!) {
    update_clients_by_pk(
      pk_columns: { id: $id },
      _set: { active: false }
    ) {
      id
      name
    }
  }
`
;
