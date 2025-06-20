// graphql/mutations/staff/createStaff.ts
import { gql } from "@apollo/client";

export const CREATE_STAFF = gql`
  mutation CreateStaff(
    $name: String!,
    $email: String!,
    $role: user_role!,
    $managerId: uuid,
    $clerkUserId: String
  ) {
    insert_users_one(
      object: {
        name: $name,
        email: $email,
        role: $role,
        is_staff: true,
        manager_id: $managerId,
        clerk_user_id: $clerkUserId
      }
    ) {
      id
      name
      email
      role
      is_staff
      created_at
    }
  }
`;
