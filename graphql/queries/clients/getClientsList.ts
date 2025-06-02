// graphql/queries/clients/getClientsList.ts
import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query GetClient {
    clients {
      id
      name
      contact_person
      contact_email
      contact_phone
      active
      updated_at
      payrolls {
        id
        name
        status
        payroll_cycle {
          name
        }
        payroll_date_type {
          name
        }
        payroll_dates(order_by: { adjusted_eft_date: desc }, limit: 1) {
          adjusted_eft_date
        }
      }
    }
  }
`;
