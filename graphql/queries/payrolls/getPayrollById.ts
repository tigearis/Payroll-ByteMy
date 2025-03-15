// graphql/queries/payrolls/getPayrollById.ts
import { gql } from "@apollo/client"

export const GET_PAYROLL_BY_ID = gql`
query GetPayrollById($id: uuid!) {
  payrolls(where: {id: {_eq: $id}}) {
    id
    name
    processing_days_before_eft
    status
    payroll_system
    created_at
    updated_at
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