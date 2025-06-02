import { gql } from "@apollo/client";

export const GET_URGENT_ALERTS = gql`
  query GetUrgentAlerts {
    # Payrolls without dates (missing processing dates)
    payrolls_missing_dates: payrolls(
      where: {
        superseded_date: { _is_null: true }
        payroll_dates: { id: { _is_null: true } }
        status: { _in: ["active", "pending"] }
      }
      limit: 5
    ) {
      id
      name
      status
      client {
        id
        name
      }
    }

    # Payrolls with dates in the past that haven't been processed
    overdue_payrolls: payrolls(
      where: {
        superseded_date: { _is_null: true }
        status: { _in: ["pending", "active"] }
        payroll_dates: { adjusted_eft_date: { _lt: "now()" } }
      }
      limit: 5
    ) {
      id
      name
      status
      client {
        id
        name
      }
      payroll_dates(
        where: { adjusted_eft_date: { _lt: "now()" } }
        order_by: { adjusted_eft_date: desc }
        limit: 1
      ) {
        id
        adjusted_eft_date
        processing_date
      }
    }

    # Clients without contact information
    clients_missing_contact: clients(
      where: {
        active: { _eq: true }
        _or: [
          { contact_email: { _is_null: true } }
          { contact_email: { _eq: "" } }
          { contact_person: { _is_null: true } }
          { contact_person: { _eq: "" } }
        ]
      }
      limit: 3
    ) {
      id
      name
      contact_person
      contact_email
    }

    # Payrolls without assigned consultants
    unassigned_payrolls: payrolls(
      where: {
        superseded_date: { _is_null: true }
        status: { _in: ["active", "pending"] }
        _and: [
          { primary_consultant_user_id: { _is_null: true } }
          { backup_consultant_user_id: { _is_null: true } }
        ]
      }
      limit: 3
    ) {
      id
      name
      status
      client {
        id
        name
      }
    }
  }
`;

export const GET_USER_UPCOMING_PAYROLLS = gql`
  query GetUserUpcomingPayrolls(
    $userId: uuid!
    $from_date: date!
    $limit: Int = 10
  ) {
    payrolls(
      where: {
        superseded_date: { _is_null: true }
        payroll_dates: { adjusted_eft_date: { _gte: $from_date } }
        _or: [
          { primary_consultant_user_id: { _eq: $userId } }
          { backup_consultant_user_id: { _eq: $userId } }
          { manager_user_id: { _eq: $userId } }
        ]
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
        limit: 1
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
