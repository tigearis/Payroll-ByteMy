// graphql/queries/payrolls/getPayrollDates.ts
import { gql } from "@apollo/client";

export const GET_PAYROLL_DATES = gql`
  query GetPayrollDates($payroll_id: uuid!) {
    payroll_dates(
      where: { payroll_id: { _eq: $payroll_id } },
      order_by: { adjusted_eft_date: asc }
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      notes
    }
  }
`;