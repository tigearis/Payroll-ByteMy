// graphql/queries/payrolls/getPayrollsByMonth.ts
import { gql } from "@apollo/client";

export const GET_PAYROLLS_BY_MONTH = gql`
  query GetPayrollsByMonth($start_date: date!, $end_date: date!) {
    payrolls(
      where: {
        payroll_dates: {
          _or: [
            { 
              processing_date: { _gte: $start_date, _lt: $end_date }
            },
            { 
              adjusted_eft_date: { _gte: $start_date, _lt: $end_date }
            }
          ]
        }
      }
    ) {
      id
      name
      client {
        name
      }
      payroll_system
      status
      payroll_dates(
        where: {
          _or: [
            { processing_date: { _gte: $start_date, _lt: $end_date } },
            { adjusted_eft_date: { _gte: $start_date, _lt: $end_date } }
          ]
        }
        order_by: { adjusted_eft_date: asc }
        limit: 1
      ) {
        processing_date
        adjusted_eft_date
      }
    }
  }
`;