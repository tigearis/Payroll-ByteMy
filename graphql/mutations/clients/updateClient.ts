// graphql/mutations/clients/updateClient.ts
import { gql } from "@apollo/client";

export const UPDATE_CLIENT = gql`  
mutation UpdateClient($id: uuid!, $name: String, $contactPerson: String, $contactEmail: String, $contactPhone: String, $active: Boolean) {
    update_clients_by_pk(
      pk_columns: { id: $id },
      _set: {
        name: $name,
        contact_person: $contactPerson,
        contact_email: $contactEmail,
        contact_phone: $contactPhone,
        active: $active,
        updated_at: "now()"
      }
    ) {
      id
      name
      updated_at
    }
  }`
  ;