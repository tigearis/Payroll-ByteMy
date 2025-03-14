// graphql/queries/payrolls/generatePayrollDates.ts
import { gql } from "@apollo/client";

export const GENERATE_PAYROLL_DATES = gql`
  mutation GeneratePayrollDates(
    $payrollId: uuid!,
    $startDate: String!,
    $months: Int!
  ) {
    call_generate_payroll_dates(args: {
      p_payroll_id: $payrollId,
      p_start_date: $startDate,
      p_end_date: null,
      p_months: $months
    }) {
      success
    }
  }
`;