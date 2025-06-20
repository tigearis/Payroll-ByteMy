// graphql/mutations/staff/deleteStaff.ts
import { gql } from "@apollo/client";

export const DELETE_STAFF = gql`
  mutation DeleteStaff($id: uuid!) {
    update_users_by_pk(
      pk_columns: { id: $id },
      _set: { is_staff: false }
    ) {
      id
      name
      is_staff
    }
  }
`;
