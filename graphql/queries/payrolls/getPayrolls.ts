// graphql/queries/payrolls/getPayrolls.ts
import { gql } from "@apollo/client";

export const GET_PAYROLLS = gql`
  query GetPayrolls {
    payrolls(
      where: { superseded_date: { _is_null: true } }
      order_by: { updated_at: desc }
    ) {
      id
      name
      client {
        id
        name
      }
      payroll_cycle {
        id
        name
      }
      payroll_date_type {
        id
        name
      }
      userByPrimaryConsultantUserId {
        id
        name
      }
      userByBackupConsultantUserId {
        id
        name
      }
      userByManagerUserId {
        id
        name
      }
      processing_days_before_eft
      payroll_system
      date_value
      employee_count
      processing_time
      status
      created_at
      updated_at
      version_number
      parent_payroll_id
      go_live_date
      superseded_date
      version_reason
      created_by_user_id
      payroll_dates {
        id
        original_eft_date
        adjusted_eft_date
        processing_date
      }
    }
  }
`;

// Fallback query (same as main for now)
export const GET_PAYROLLS_FALLBACK = gql`
  query GetPayrollsFallback {
    payrolls(
      where: { superseded_date: { _is_null: true } }
      order_by: { updated_at: desc }
    ) {
      id
      name
      client {
        id
        name
      }
      payroll_cycle {
        id
        name
      }
      payroll_date_type {
        id
        name
      }
      userByPrimaryConsultantUserId {
        id
        name
      }
      userByBackupConsultantUserId {
        id
        name
      }
      userByManagerUserId {
        id
        name
      }
      processing_days_before_eft
      payroll_system
      date_value
      employee_count
      processing_time
      status
      created_at
      updated_at
      version_number
      parent_payroll_id
      go_live_date
      superseded_date
      version_reason
      created_by_user_id
      payroll_dates {
        id
        original_eft_date
        adjusted_eft_date
        processing_date
      }
    }
  }
`;
