// graphql/queries/payrolls/getPayrollsByMonth.ts
import { gql } from "@apollo/client";

export const GET_PAYROLLS_BY_MONTH = gql`
  query GetPayrollsByMonth($start_date: date!, $end_date: date!) {
    payrolls(
      where: {
        payroll_dates: {
          adjusted_eft_date: { _gte: $start_date, _lt: $end_date }
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
      employee_count
      processing_time
      payroll_dates(
        where: { adjusted_eft_date: { _gte: $start_date, _lt: $end_date } }
        order_by: { adjusted_eft_date: asc }
      ) {
        processing_date
        adjusted_eft_date
        original_eft_date
      }
      payroll_cycle {
        name
      }
      payroll_date_type {
        name
      }
      userByPrimaryConsultantUserId {
        id
        name
        leaves {
          start_date
          end_date
          reason
          leave_type
          status
        }
      }
      userByBackupConsultantUserId {
        id
        name
      }
      userByManagerUserId {
        id
        name
      }
    }
  }
`;
