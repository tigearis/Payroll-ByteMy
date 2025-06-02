import { gql } from "@apollo/client";

export const COMMIT_PAYROLL_ASSIGNMENTS = gql`
  mutation CommitPayrollAssignments($changes: [PayrollAssignmentInput!]!) {
    commitPayrollAssignments(changes: $changes) {
      success
      message
      errors
      affected_assignments {
        id
        payroll_date_id
        original_consultant_id
        new_consultant_id
        adjusted_eft_date
      }
    }
  }
`;

export interface PayrollAssignmentInput {
  payrollId: string;
  fromConsultantId: string;
  toConsultantId: string;
  date: string;
}

export interface CommitPayrollAssignmentsResponse {
  commitPayrollAssignments: {
    success: boolean;
    message?: string;
    errors?: string[];
    affected_assignments?: Array<{
      id: string;
      payroll_date_id: string;
      original_consultant_id: string;
      new_consultant_id: string;
      adjusted_eft_date: string;
    }>;
  };
}
