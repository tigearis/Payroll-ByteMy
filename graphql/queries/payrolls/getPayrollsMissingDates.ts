// graphql/queries/payrolls/getPayrollsMissingDates.ts
import { gql } from "@apollo/client";

export const GET_PAYROLLS_MISSING_DATES = gql`
  query GetPayrollsMissingDates {
    payrolls {
      id
      name
      client {
        name
      }
      status
      payroll_dates_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;