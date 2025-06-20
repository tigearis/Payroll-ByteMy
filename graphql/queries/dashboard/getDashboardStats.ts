import { gql } from "@apollo/client";

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    clients_aggregate(where: { active: { _eq: true } }) {
      aggregate {
        count
      }
    }
    payrolls_aggregate(where: { superseded_date: { _is_null: true } }) {
      aggregate {
        count
      }
    }
    active_payrolls: payrolls_aggregate(
      where: {
        superseded_date: { _is_null: true }
        status: { _in: ["Active"] }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_UPCOMING_PAYROLLS = gql`
  query GetUpcomingPayrolls($from_date: date!, $limit: Int = 10) {
    payrolls(
      where: {
        superseded_date: { _is_null: true }
        payroll_dates: { adjusted_eft_date: { _gte: $from_date } }
      }
      order_by: [
        { payroll_dates_aggregate: { min: { adjusted_eft_date: asc } } }
      ]
      limit: $limit
    ) {
      id
      name
      status
      client {
        id
        name
      }
      payroll_dates(
        where: { adjusted_eft_date: { _gte: $from_date } }
        order_by: { adjusted_eft_date: asc }
        limit: 5
      ) {
        id
        adjusted_eft_date
        processing_date
        original_eft_date
      }
      userByPrimaryConsultantUserId {
        id
        name
      }
    }
  }
`;

export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity {
    recent_payrolls: payrolls(
      where: { superseded_date: { _is_null: true } }
      order_by: { updated_at: desc }
      limit: 5
    ) {
      id
      name
      status
      updated_at
      client {
        id
        name
      }
    }
    recent_clients: clients(order_by: { updated_at: desc }, limit: 5) {
      id
      name
      updated_at
      active
    }
  }
`;
