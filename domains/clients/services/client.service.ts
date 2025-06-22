// Client Domain Service
// Centralized access to client GraphQL operations

// Import generated types and operations
export * from "../graphql/generated";

// Import the graphql function from generated code for proper typing
import { graphql } from "../graphql/generated";

// Re-export common operations using generated types for backward compatibility
export const GET_CLIENTS_BY_ID = graphql(`
  query GetClientById($id: uuid!) {
    clients_by_pk(id: $id) {
      ...ClientWithPayrolls
    }
  }
`);

export const GET_CLIENTS = graphql(`
  query GetClients {
    clients(order_by: { name: asc }) {
      ...ClientListItem
      payrolls {
        id
        name
        status
        employee_count
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
`);

export const CREATE_CLIENT = graphql(`
  mutation CreateClient(
    $name: String!
    $contactPerson: String
    $contact_email: String
    $contactPhone: String
  ) {
    insert_clients_one(
      object: {
        name: $name
        contact_person: $contactPerson
        contact_email: $contact_email
        contact_phone: $contactPhone
        active: true
      }
    ) {
      ...ClientDetailed
    }
  }
`);

export const UPDATE_CLIENT = graphql(`
  mutation UpdateClient(
    $id: uuid!
    $name: String
    $contactPerson: String
    $contact_email: String
    $contactPhone: String
    $active: Boolean
  ) {
    update_clients_by_pk(
      pk_columns: { id: $id }
      _set: {
        name: $name
        contact_person: $contactPerson
        contact_email: $contact_email
        contact_phone: $contactPhone
        active: $active
        updated_at: "now()"
      }
    ) {
      ...ClientDetailed
    }
  }
`);

export const DELETE_CLIENT = graphql(`
  mutation DeleteClient($id: uuid!) {
    update_clients_by_pk(pk_columns: { id: $id }, _set: { active: false }) {
      id
      name
      active
    }
  }
`);
