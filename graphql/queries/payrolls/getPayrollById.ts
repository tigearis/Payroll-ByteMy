// graphql/queries/payrolls/getPayrollById.ts
import { gql } from "@apollo/client";

export const GET_PAYROLL_BY_ID = gql`
  query GetPayrollById($id: uuid!) {
    payrolls(where: { id: { _eq: $id } }) {
      id
      name
      client_id
      processing_days_before_eft
      status
      payroll_system
      created_at
      updated_at
      date_value
      cycle_id
      date_type_id
      primary_consultant_user_id
      backup_consultant_user_id
      manager_user_id
      go_live_date
      processing_time
      employee_count
      version_number
      parent_payroll_id
      superseded_date
      version_reason
      created_by_user_id
      client {
        id
        name
        contact_email
        contact_person
        contact_phone
      }
      payroll_cycle {
        id
        name
      }
      payroll_date_type {
        id
        name
      }
      payroll_dates {
        id
        original_eft_date
        adjusted_eft_date
        processing_date
      }
      userByBackupConsultantUserId {
        is_staff
        id
        name
        role
        email
      }
      userByManagerUserId {
        email
        id
        is_staff
        name
        role
      }
      userByPrimaryConsultantUserId {
        email
        id
        is_staff
        name
        role
      }
    }
  }
`;
