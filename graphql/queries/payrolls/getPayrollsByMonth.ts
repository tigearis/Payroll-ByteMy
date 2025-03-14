// graphql/queries/payrolls/getPayrollsByMonth.ts
import { gql } from "@apollo/client";

export const GET_PAYROLLS_BY_MONTH = gql`
  query GetPayrollsByMonth($startDate: date!, $endDate: date!) {
    payrolls(
      where: {
        payroll_dates: {
          _or: [
            { 
              processing_date: { _gte: $startDate, _lt: $endDate }
            },
            { 
              adjusted_eft_date: { _gte: $startDate, _lt: $endDate }
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
            { processing_date: { _gte: $startDate, _lt: $endDate } },
            { adjusted_eft_date: { _gte: $startDate, _lt: $endDate } }
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