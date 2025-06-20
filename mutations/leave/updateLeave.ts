
import { gql } from "@apollo/client";

export const UPDATE_LEAVE = gql` 
mutation UpdateLeaveStatus($id: uuid!, $status: String!) {
    update_leave_by_pk(
      pk_columns: { id: $id },
      _set: { status: $status }
    ) {
      id
      status
    }
  }`
  ;
  