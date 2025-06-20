
import { gql } from "@apollo/client";

export const CREATE_LEAVE = gql` 
mutation CreateLeave($userId: uuid!, $startDate: date!, $endDate: date!, $leaveType: String!, $reason: String) {
  insert_leave_one(
    object: {
      user_id: $userId,
      start_date: $startDate,
      end_date: $endDate,
      leave_type: $leaveType,
      reason: $reason,
      status: "Pending"
    }
  ) {
    id
    start_date
    end_date
    leave_type
  }
}`
;
