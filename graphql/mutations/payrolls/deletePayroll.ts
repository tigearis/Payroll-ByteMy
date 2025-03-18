// graphql/mutations/payrolls/deletePayroll.ts
import { gql } from "@apollo/client";

export const DELETE_PAYROLL = gql`
  mutation DeletePayroll($id: uuid!) {
    update_payrolls_by_pk(
      pk_columns: { id: $id },
      _set: { 
        status: "Inactive",
        updated_at: "now()"
      }
    ) {
      id
      name
      status
      updated_at
    }
  }
`;
