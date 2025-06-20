// graphql/mutations/staff/updateStaff.ts
import { gql } from "@apollo/client";

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($clerkId: String!, $name: String) {
    update_users(
      where: { clerk_user_id: { _eq: $clerkId } },
      _set: {
        name: $name,
        updated_at: "now()"
      }
    ) {
      returning {
        id
        name
        updated_at
        role
      }
    }
  }
`;