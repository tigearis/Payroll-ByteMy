// GraphQL Queries and Mutations for Advanced Payroll Scheduler

import { gql } from "@apollo/client";

// Updated query that matches your actual data structure
export const GET_PAYROLL_DATA = gql`
  query GetPayrollData($start_date: date!, $end_date: date!) {
    # Get all payroll definitions
    payrolls(where: { status: { _eq: "Active" } }) {
      id
      name
      employee_count
      processing_time
      status
      client {
        id
        name
      }
      userByPrimaryConsultantUserId {
        id
        name
        leaves(where: { status: { _eq: "approved" } }) {
          id
          start_date
          end_date
          leave_type
          reason
          status
        }
      }
      userByBackupConsultantUserId {
        id
        name
        leaves(where: { status: { _eq: "approved" } }) {
          id
          start_date
          end_date
          leave_type
          reason
          status
        }
      }
    }
    
    # Get payroll dates within the specified range
    payroll_dates(
      where: {
        adjusted_eft_date: { _gte: $start_date, _lte: $end_date }
      }
      order_by: { adjusted_eft_date: asc }
    ) {
      id
      payroll_id
      original_eft_date
      adjusted_eft_date
      processing_date
      payroll {
        id
        name
        employee_count
        processing_time
        client {
          id
          name
        }
        userByPrimaryConsultantUserId {
          id
          name
        }
        userByBackupConsultantUserId {
          id
          name
        }
      }
    }
    
    # Get holidays within the date range
    holidays(where: {
      date: { _gte: $start_date, _lte: $end_date }
    }) {
      id
      date
      local_name
      name
      country_code
      region
      is_fixed
      is_global
    }
  }
`;

// Alternative simpler query if you need to troubleshoot
export const GET_PAYROLL_DATA_SIMPLE = gql`
  query GetPayrollDataSimple {
    payrolls(limit: 100) {
      id
      name
      employee_count
      processing_time
      status
      client {
        id
        name
      }
      userByPrimaryConsultantUserId {
        id
        name
      }
      userByBackupConsultantUserId {
        id
        name
      }
    }
    
    payroll_dates(limit: 100, order_by: { adjusted_eft_date: asc }) {
      id
      payroll_id
      original_eft_date
      adjusted_eft_date
      processing_date
    }
    
    holidays(limit: 100) {
      id
      date
      local_name
      name
      country_code
      region
    }
  }
`;

// Get consultants (users) with their leave data
export const GET_CONSULTANTS = gql`
  query GetConsultants {
    users(where: { role: { _in: ["consultant", "developer"] } }) {
      id
      name
      email
      role
      leaves(where: { status: { _eq: "approved" } }) {
        id
        start_date
        end_date
        leave_type
        reason
        status
      }
    }
  }
`;

// Commit payroll assignment changes
export const COMMIT_PAYROLL_ASSIGNMENTS = gql`
  mutation CommitPayrollAssignments($changes: [PayrollAssignmentInput!]!) {
    commitPayrollAssignments(changes: $changes) {
      success
      message
      errors
      affected_assignments {
        id
        payroll_id
        original_consultant_id
        new_consultant_id
        adjusted_eft_date
      }
    }
  }
`;

// Update individual payroll assignment
export const UPDATE_PAYROLL_ASSIGNMENT = gql`
  mutation UpdatePayrollAssignment(
    $payroll_date_id: uuid!
    $new_consultant_id: uuid!
    $new_date: date
  ) {
    update_payroll_assignments(
      where: { payroll_date_id: { _eq: $payroll_date_id } }
      _set: { 
        consultant_id: $new_consultant_id
        updated_at: "now()"
      }
    ) {
      affected_rows
      returning {
        id
        payroll_date_id
        consultant_id
        assigned_date
        updated_at
      }
    }
    
    # If date also needs to be updated
    update_payroll_dates(
      where: { id: { _eq: $payroll_date_id } }
      _set: { 
        adjusted_eft_date: $new_date
        updated_at: "now()"
      }
    ) @include(if: $new_date) {
      affected_rows
      returning {
        id
        adjusted_eft_date
        updated_at
      }
    }
  }
`;

// Input types for mutations
export interface PayrollAssignmentInput {
  payrollDateId: string;
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
      payroll_id: string;
      original_consultant_id: string;
      new_consultant_id: string;
      adjusted_eft_date: string;
    }>;
  };
}

// Types matching your data structure
export interface PayrollData {
  id: string;
  name: string;
  employee_count: number;
  processing_time: number;
  status: string;
  client: {
    id: string;
    name: string;
  };
  userByPrimaryConsultantUserId: {
    id: string;
    name: string;
    leaves?: Leave[];
  };
  userByBackupConsultantUserId?: {
    id: string;
    name: string;
    leaves?: Leave[];
  };
}

export interface PayrollDateData {
  id: string;
  payroll_id: string;
  original_eft_date: string;
  adjusted_eft_date: string;
  processing_date: string;
  payroll?: PayrollData;
}

export interface Leave {
  id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason?: string;
  status: string;
}

export interface Holiday {
  id: string;
  date: string;
  local_name: string;
  name?: string;
  country_code: string;
  region?: string;
  is_fixed?: boolean;
  is_global?: boolean;
}

/*
RECOMMENDED DATABASE SCHEMA UPDATES:

1. Create payroll_assignments table to track consultant assignments:

CREATE TABLE payroll_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_date_id UUID NOT NULL REFERENCES payroll_dates(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES users(id),
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  is_backup BOOLEAN DEFAULT FALSE,
  original_consultant_id UUID REFERENCES users(id), -- for backup assignments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payroll_assignments_payroll_date ON payroll_assignments(payroll_date_id);
CREATE INDEX idx_payroll_assignments_consultant ON payroll_assignments(consultant_id);
CREATE INDEX idx_payroll_assignments_date ON payroll_assignments(assigned_date);

2. Update payroll_dates table if needed:

-- Add any missing columns
ALTER TABLE payroll_dates ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE payroll_dates ADD COLUMN IF NOT EXISTS is_holiday_adjusted BOOLEAN DEFAULT FALSE;
ALTER TABLE payroll_dates ADD COLUMN IF NOT EXISTS adjustment_reason TEXT;

3. Ensure proper relationships in Hasura:

-- Object relationships
payroll_dates -> payroll (via payroll_id)
payroll_assignments -> payroll_dates (via payroll_date_id)
payroll_assignments -> users (via consultant_id)

-- Array relationships  
payrolls -> payroll_dates (via id -> payroll_id)
payroll_dates -> payroll_assignments (via id -> payroll_date_id)
users -> payroll_assignments (via id -> consultant_id)

4. Custom resolver for commitPayrollAssignments:

This would handle the business logic for:
- Creating/updating payroll_assignments records
- Handling backup consultant logic during leave periods
- Validating assignment conflicts
- Maintaining audit trail

5. Views for easier querying:

CREATE VIEW payroll_schedule_view AS
SELECT 
  pd.id as payroll_date_id,
  pd.adjusted_eft_date,
  pd.original_eft_date,
  pd.processing_date,
  p.id as payroll_id,
  p.name as payroll_name,
  p.employee_count,
  p.processing_time,
  c.name as client_name,
  u1.id as primary_consultant_id,
  u1.name as primary_consultant_name,
  u2.id as backup_consultant_id,
  u2.name as backup_consultant_name,
  pa.consultant_id as assigned_consultant_id,
  u3.name as assigned_consultant_name,
  pa.is_backup as is_backup_assignment
FROM payroll_dates pd
LEFT JOIN payrolls p ON pd.payroll_id = p.id
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN users u1 ON p.primary_consultant_user_id = u1.id
LEFT JOIN users u2 ON p.backup_consultant_user_id = u2.id
LEFT JOIN payroll_assignments pa ON pd.id = pa.payroll_date_id
LEFT JOIN users u3 ON pa.consultant_id = u3.id
WHERE p.status = 'Active';
*/