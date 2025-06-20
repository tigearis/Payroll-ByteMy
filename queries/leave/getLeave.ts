import { gql } from "@apollo/client";

export const GET_LEAVE = gql` 
query GetUserLeaves($userId: uuid!) {
    leave(where: {user_id: {_eq: $userId}}) {
      id
      start_date
      end_date
      leave_type
      reason
      status
    }
  }`
  ;
  