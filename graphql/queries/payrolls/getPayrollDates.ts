// graphql/queries/payrolls/getPayrollDates.ts
import { gql } from "@apollo/client";

export const GET_PAYROLL_DATES = gql`
  query GetPayrollDates($id: uuid!) {
    payroll_dates(
      where: { payroll_id: { _eq: $id } },
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