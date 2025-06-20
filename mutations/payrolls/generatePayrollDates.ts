// graphql/mutations/payrolls/generatePayrollDates.ts
import { gql } from "@apollo/client";

export const GENERATE_PAYROLL_DATES = gql`
  mutation GeneratePayrollDates($args: GeneratePayrollDates_args!) {
    generatePayrollDates(args: $args) {
      id
    }
  }
`;