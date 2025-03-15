// graphql/subscriptions/payrolls/payrollUpdates.ts
import { gql } from "@apollo/client";

export const PAYROLLS_SUBSCRIPTION = gql`
  subscription payrollSubscription {
    payrolls {
      name
      id
      date_value
      status
      processing_time
      processing_days_before_eft
      payroll_system
      payroll_cycle {
        name
        id
      }
      payroll_date_type {
        name
        id
      }
      payroll_dates {
        original_eft_date
        adjusted_eft_date
        processing_date
        id
        notes
      }
      userByBackupConsultantUserId {
        id
        email
        is_staff
        name
        leaves {
          start_date
          end_date
          id
          leave_type
          reason
          user_id
          status
        }
      }
      userByManagerUserId {
        email
        id
        is_staff
        name
        leaves {
          end_date
          leave_type
          reason
          id
          start_date
          status
          user_id
        }
      }
      userByPrimaryConsultantUserId {
        email
        id
        is_staff
        name
        leaves {
          end_date
          id
          leave_type
          reason
          start_date
          status
        }
      }
    }
  }
`;