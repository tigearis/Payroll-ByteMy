// graphql/queries/clients/getClientById.ts
import { gql } from '@apollo/client';

export const GET_CLIENTS_BY_ID = gql`
  query GetClient($id: uuid!) {
    clients_by_pk(id: $id) {
      id
      name
      contact_person
      contact_email
      contact_phone
      active
      created_at
      updated_at
      payrolls {
        id
        name
        status
        date_value
        payroll_cycle {
          name
        }
        payroll_date_type {
          name
        }
        payroll_dates(order_by: {adjusted_eft_date: desc}, limit: 1) {
          adjusted_eft_date
        }
      }
    }
  }
`;
