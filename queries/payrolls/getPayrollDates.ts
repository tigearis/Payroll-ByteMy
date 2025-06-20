// graphql/queries/payrolls/getPayrollDates.ts
import { gql } from "@apollo/client";

export const GET_PAYROLL_DATES = gql`
  query GetPayrollDates($id: uuid!) {
    payroll_dates(
      where: { payroll_id: { _eq: $id } }
      order_by: { adjusted_eft_date: asc }
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      notes
      payroll_id
    }
  }
`;

// Get all payroll dates from all versions in a payroll family
export const GET_PAYROLL_FAMILY_DATES = gql`
  query GetPayrollFamilyDates($payrollId: uuid!) {
    # First get the current payroll to find the root
    current_payroll: payrolls(where: { id: { _eq: $payrollId } }) {
      id
      parent_payroll_id
      version_number
    }

    # Get all payroll dates from the same family
    payroll_dates(
      where: {
        _or: [
          # Direct match
          { payroll_id: { _eq: $payrollId } }
          # Same parent family
          {
            payroll: {
              _or: [
                { parent_payroll_id: { _eq: $payrollId } }
                { id: { _eq: $payrollId } }
              ]
            }
          }
        ]
      }
      order_by: { adjusted_eft_date: asc }
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      notes
      payroll_id
      payroll {
        id
        name
        version_number
        parent_payroll_id
        go_live_date
        superseded_date
        status
      }
    }
  }
`;

// New efficient split query for past/future dates
export const GET_PAYROLL_DATES_SPLIT = gql`
  query GetPayrollDatesSplit($familyRootId: uuid!, $today: date!) {
    # All past dates (before today)
    past: payroll_dates(
      where: {
        payroll: {
          _or: [
            { id: { _eq: $familyRootId } }
            { parent_payroll_id: { _eq: $familyRootId } }
          ]
        }
        adjusted_eft_date: { _lt: $today }
      }
      order_by: { adjusted_eft_date: asc }
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      notes
      payroll_id
      payroll {
        id
        name
        version_number
        parent_payroll_id
        go_live_date
        superseded_date
        status
      }
    }

    # All future dates (today and after)
    future: payroll_dates(
      where: {
        payroll: {
          _or: [
            { id: { _eq: $familyRootId } }
            { parent_payroll_id: { _eq: $familyRootId } }
          ]
        }
        adjusted_eft_date: { _gte: $today }
      }
      order_by: { adjusted_eft_date: asc }
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      notes
      payroll_id
      payroll {
        id
        name
        version_number
        parent_payroll_id
        go_live_date
        superseded_date
        status
      }
    }
  }
`;

// Helper query to get the family root ID
export const GET_FAMILY_ROOT_ID = gql`
  query GetFamilyRootId($payrollId: uuid!) {
    payrolls(where: { id: { _eq: $payrollId } }) {
      id
      parent_payroll_id
    }
  }
`;

// Fallback query using a more explicit approach
export const GET_PAYROLL_FAMILY_DATES_FALLBACK = gql`
  query GetPayrollFamilyDatesFallback($payrollId: uuid!) {
    # Get the root payroll ID first
    payrolls(where: { id: { _eq: $payrollId } }) {
      id
      parent_payroll_id
    }

    # Get all related payrolls in the family
    related_payrolls: payrolls(
      where: {
        _or: [
          { id: { _eq: $payrollId } }
          { parent_payroll_id: { _eq: $payrollId } }
          {
            _and: [
              { parent_payroll_id: { _is_null: false } }
              {
                _exists: {
                  _table: { name: "payrolls", schema: "public" }
                  _where: {
                    _and: [
                      { id: { _eq: $payrollId } }
                      { parent_payroll_id: { _eq: "$parent_payroll_id" } }
                    ]
                  }
                }
              }
            ]
          }
        ]
      }
    ) {
      id
      name
      version_number
      parent_payroll_id
      go_live_date
      superseded_date
      status
      payroll_dates(order_by: { adjusted_eft_date: asc }) {
        id
        original_eft_date
        adjusted_eft_date
        processing_date
        notes
        payroll_id
      }
    }
  }
`;
