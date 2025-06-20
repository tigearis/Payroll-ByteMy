// graphql/queries/staff/getStaffList.ts
import { gql } from "@apollo/client";

export const GET_STAFF_LIST = gql`
  query Staff {
    users(where: { is_staff: { _eq: true } }) {
      id
      email
      image
      is_staff
      name
      role
      manager_id
      clerk_user_id
      created_at
      updated_at
      manager {
        name
        is_staff
        email
        id
      }
      staffByManager {
        name
        is_staff
        id
        email
        image
        role
      }
      leaves {
        id
        end_date
        leave_type
        reason
        start_date
        status
      }
    }
  }
`;

// New query for developers to see all users
export const GET_ALL_USERS_LIST = gql`
  query AllUsers {
    users(order_by: { created_at: desc }) {
      id
      email
      image
      is_staff
      name
      role
      manager_id
      clerk_user_id
      created_at
      updated_at
      manager {
        name
        is_staff
        email
        id
      }
      staffByManager {
        name
        is_staff
        id
        email
        image
        role
      }
      leaves {
        id
        end_date
        leave_type
        reason
        start_date
        status
      }
    }
  }
`;
