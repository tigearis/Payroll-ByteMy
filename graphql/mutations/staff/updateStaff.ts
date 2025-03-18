// graphql/mutations/staff/updateStaff.ts
import { gql } from "@apollo/client";

export const UPDATE_STAFF = gql`
  mutation UpdateStaff(
    $id: uuid!,
    $role: user_role!
  ) {
    update_users_by_pk(
      pk_columns: { id: $id },
      _set: {
        role: $role,
        updated_at: "now()"
      }
    ) {
      id
      name
      email
      role
      updated_at
    }
  }
`;