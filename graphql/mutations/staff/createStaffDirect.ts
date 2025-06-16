import { gql } from '@apollo/client';

export const CREATE_STAFF_DIRECT = gql`
  mutation CreateStaffDirect(
    $name: String!
    $email: String!
    $role: user_role!
    $isStaff: Boolean = true
    $managerId: uuid
  ) {
    insert_users_one(
      object: {
        name: $name
        email: $email
        role: $role
        is_staff: $isStaff
        manager_id: $managerId
      }
      on_conflict: {
        constraint: users_email_key
        update_columns: [name, role, is_staff, manager_id, updated_at]
      }
    ) {
      id
      name
      email
      role
      is_staff
      manager_id
      created_at
      updated_at
    }
  }
`;