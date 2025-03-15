// graphql/mutations/payrolls/updatePayrollStatus.ts
import { gql } from "@apollo/client";

export const UPDATE_PAYROLL_STATUS = gql`
  mutation UpdatePayrollStatus(
    $payrollId: uuid!, 
    $status: payroll_status_enum!
  ) {
    update_payrolls_by_pk(
      pk_columns: { id: $payrollId }, 
      _set: { status: $status }
    ) {
      id
      status
    }
  }
`;