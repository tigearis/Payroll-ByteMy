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
      primary_consultant_user { id name }
      backup_consultant_user { id name }
      manager_user { id name }
      processing_days_before_eft
      payroll_system
      date_value
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