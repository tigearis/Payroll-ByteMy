// graphql/queries/clients/getClientById.ts
import { gql } from "@apollo/client";

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
        created_at
        updated_at
        employee_count
        primary_consultant_user_id
        superseded_date
        go_live_date
        version_number
        userByPrimaryConsultantUserId {
          id
          name
          email
        }
        payroll_cycle {
          name
        }
        payroll_date_type {
          name
        }
        payroll_dates(order_by: { adjusted_eft_date: desc }) {
          id
          adjusted_eft_date
          employee_count
          created_at
          updated_at
        }
      }
    }
  }
`;
