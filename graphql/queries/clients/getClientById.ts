// graphql/queries/clients/getClientById.ts
import { gql } from '@apollo/client';

export const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      name
      contact_person
      contact_email
      contact_phone
      active
      created_at
      updated_at
      payrolls_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;