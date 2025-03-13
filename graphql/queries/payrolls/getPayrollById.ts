import { gql } from "@apollo/client"

export const GET_PAYROLL_BY_ID = gql`
  query GetPayrollById($id: uuid!) {
    payrolls(where: {id: {_eq: $id}}) {
    name
    processing_days_before_eft
    status
    payroll_system
    created_at
    updated_at
    client { name }
    payroll_cycle { name }
    payroll_date_type { name }
    staff { name }
    staffByManagerId { name }
    staffByPrimaryConsultantId { name }
    payroll_dates {
      adjusted_eft_date
      original_eft_date
      processing_date
    }
  }
}
`
