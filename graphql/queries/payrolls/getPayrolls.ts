// graphql/queries/payrolls/getPayrolls.ts
import { gql } from '@apollo/client';

export const GET_PAYROLLS = gql`
  query GetPayrolls {
    payrolls {
      id
      name
      client { id name }
      payroll_cycle { id name }
      payroll_date_type { id name }
      userByPrimaryConsultantUserId { id name }
      userByBackupConsultantUserId { id name }
      userByManagerUserId { id name }
      processing_days_before_eft
      payroll_system
      date_value
      employee_count
      processing_time
      status
      created_at
      updated_at
      payroll_dates { 
        id
        original_eft_date
        adjusted_eft_date
        processing_date
      }
    }
  }
`;