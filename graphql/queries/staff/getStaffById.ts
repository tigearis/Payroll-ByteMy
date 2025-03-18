// graphql/queries/staff/getStaffById.ts

import { gql } from "@apollo/client";

export const GET_STAFF_BY_ID = gql`
query Staff ($id: uuid!){
    users(where: {is_staff: {_eq: true},id: {_eq: $id}}) {
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