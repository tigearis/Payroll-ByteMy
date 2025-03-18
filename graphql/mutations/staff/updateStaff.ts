// graphql/mutations/staff/updateStaff.ts
import { gql } from "@apollo/client";

export const UPDATE_STAFF = gql`
  mutation UpdateStaff(
    $id: uuid!,
    $name: String,
    $email: String,
    $role: user_role,
    $managerId: uuid
  ) {
    update_users_by_pk(
      pk_columns: { id: $id },
      _set: {
        name: $name,
        email: $email,
        role: $role,
        manager_id: $managerId,
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
