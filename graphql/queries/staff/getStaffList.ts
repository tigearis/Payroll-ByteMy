// graphql/queries/staff/getStaffList.ts
import { gql } from "@apollo/client";

export const GET_STAFF_LIST = gql`
query Staff {
    users(where: {is_staff: {_eq: true}}) {
      email
      image
      is_staff
      name
      role
      manager_id
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
        end_date
        leave_type
        reason
        start_date
        status
      }
    }
  }
  `
  ;