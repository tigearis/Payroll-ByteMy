// graphql/mutations/clients/createClient.ts

import { gql } from "@apollo/client";

export const CREATE_CLIENT = gql` 
mutation CreateClient($name: String!, $contactPerson: String, $contactEmail: String, $contactPhone: String) {
    insert_clients_one(
      object: {
        name: $name,
        contact_person: $contactPerson,
        contact_email: $contactEmail,
        contact_phone: $contactPhone,
        active: true
      }
    ) {
      id
      name
    }
  }`
  ;
