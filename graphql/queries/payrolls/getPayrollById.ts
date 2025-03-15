// graphql/queries/payrolls/getPayrollById.ts
import { gql } from "@apollo/client"

export const GET_PAYROLL_BY_ID = gql`
  query GetPayrollById($id: uuid!) {
    payrolls(where: { id: { _eq: $id } }) {
      id
      name
      processing_days_before_eft
      status
      payroll_system
      created_at
      updated_at
      client { id name }
      payroll_cycle { id name }
      payroll_date_type { id name }
      primary_consultant_user { id name }
      backup_consultant_user { id name }
      manager_user { id name }
      payroll_dates {
        id
        original_eft_date
        adjusted_eft_date
        processing_date
      }
    }
  }
`;

