// graphql/queries/payrolls/generatePayrollDates.ts
import { gql } from "@apollo/client";

export const GENERATE_PAYROLL_DATES = gql`
  query GetPayrollDates($payrollId: uuid!, $limit: Int) {
    payroll_dates(
      where: {payroll_id: {_eq: $payrollId}},
      order_by: {adjusted_eft_date: asc},
      limit: $limit
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      notes
    }
  }
`;