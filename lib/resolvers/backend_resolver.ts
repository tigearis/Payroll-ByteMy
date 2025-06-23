// Backend resolver for commitPayrollAssignments mutation
// This can be implemented as a Hasura Action or custom GraphQL resolver
//
// @future-enhancement Currently unused but valuable for complex GraphQL operations
// @usage Ideal for implementing custom Hasura Actions or GraphQL resolvers
// @benefits Allows complex business logic that can't be expressed in simple GraphQL
// @example
// ```typescript
// // As a Hasura Action:
// // 1. Add this resolver to Hasura Actions
// // 2. Configure endpoint in Hasura console
// // 3. Use in GraphQL queries/mutations
// ```

import { Request, Response } from "express";
import { Pool } from "pg";

interface PayrollAssignmentInput {
  payrollDateId: string;
  payrollId: string;
  fromConsultantId: string;
  toConsultantId: string;
  date: string;
}

interface CommitPayrollAssignmentsInput {
  changes: PayrollAssignmentInput[];
}

interface CommitPayrollAssignmentsResponse {
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
}

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Helper function for error message extraction
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return String(error);
}

export async function commitPayrollAssignments(
  req: Request,
  res: Response
): Promise<void> {
  const client = await pool.connect();

  try {
    const { changes }: CommitPayrollAssignmentsInput = req.body.input;

    if (!changes || changes.length === 0) {
      res.json({
        success: false,
        message: "No changes provided",
        errors: ["Changes array is empty"],
      });
      return;
    }

    await client.query("BEGIN");

    const affected_assignments: any[] = [];
    const errors: any[] = [];

    for (const change of changes) {
      try {
        // Validate the change
        const validationError = await validateChange(client, change);
        if (validationError) {
          errors.push(`${change.payrollId}: ${validationError}`);
          continue;
        }

        // Check if assignment already exists
        const existingAssignment = await client.query(
          `
          SELECT id, consultant_id 
          FROM payroll_assignments 
          WHERE payroll_date_id = $1
        `,
          [change.payrollDateId]
        );

        let assignmentId: string;

        if (existingAssignment.rows.length > 0) {
          // Update existing assignment
          const updateResult = await client.query(
            `
            UPDATE payroll_assignments 
            SET 
              consultant_id = $2,
              updated_at = NOW(),
              assigned_by = $3
            WHERE payroll_date_id = $1
            RETURNING id
          `,
            [
              change.payrollDateId,
              change.toConsultantId,
              req.headers["x-hasura-user-id"], // Assuming user ID from JWT
            ]
          );

          assignmentId = updateResult.rows[0].id;
        } else {
          // Create new assignment
          const insertResult = await client.query(
            `
            INSERT INTO payroll_assignments (
              payroll_date_id,
              consultant_id,
              assigned_by,
              created_at,
              updated_at
            ) VALUES ($1, $2, $3, NOW(), NOW())
            RETURNING id
          `,
            [
              change.payrollDateId,
              change.toConsultantId,
              req.headers["x-hasura-user-id"],
            ]
          );

          assignmentId = insertResult.rows[0].id;
        }

        // Update the payroll_date if the date changed
        if (change.date) {
          await client.query(
            `
            UPDATE payroll_dates 
            SET 
              adjusted_eft_date = $2,
              updated_at = NOW()
            WHERE id = $1
          `,
            [change.payrollDateId, change.date]
          );
        }

        // Log the change for audit trail
        await client.query(
          `
          INSERT INTO payroll_assignment_audit (
            assignment_id,
            payroll_date_id,
            from_consultant_id,
            to_consultant_id,
            changed_by,
            change_reason,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `,
          [
            assignmentId,
            change.payrollDateId,
            change.fromConsultantId,
            change.toConsultantId,
            req.headers["x-hasura-user-id"],
            "Manual reassignment via scheduler",
          ]
        );

        affected_assignments.push({
          id: assignmentId,
          payroll_date_id: change.payrollDateId,
          original_consultant_id: change.fromConsultantId,
          new_consultant_id: change.toConsultantId,
          adjusted_eft_date: change.date,
        });
      } catch (changeError) {
        console.error("Error processing change:", changeError);
        errors.push(
          `${change.payrollId}: Failed to process change - ${getErrorMessage(
            changeError
          )}`
        );
      }
    }

    if (errors.length > 0 && affected_assignments.length === 0) {
      // All changes failed
      await client.query("ROLLBACK");
      res.json({
        success: false,
        message: "All changes failed to process",
        errors,
      });
    } else if (errors.length > 0) {
      // Partial success
      await client.query("COMMIT");
      res.json({
        success: true,
        message: `${affected_assignments.length} changes processed successfully, ${errors.length} failed`,
        errors,
        affected_assignments,
      });
    } else {
      // All successful
      await client.query("COMMIT");
      res.json({
        success: true,
        message: `Successfully processed ${affected_assignments.length} changes`,
        affected_assignments,
      });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: [getErrorMessage(error)],
    });
  } finally {
    client.release();
  }
}

async function validateChange(
  client: any,
  change: PayrollAssignmentInput
): Promise<string | null> {
  try {
    // Check if payroll_date exists
    const payrollDateResult = await client.query(
      `
      SELECT pd.id, pd.adjusted_eft_date, p.name as payroll_name
      FROM payroll_dates pd
      JOIN payrolls p ON pd.payroll_id = p.id
      WHERE pd.id = $1
    `,
      [change.payrollDateId]
    );

    if (payrollDateResult.rows.length === 0) {
      return "Payroll date not found";
    }

    // Check if target consultant exists
    const consultantResult = await client.query(
      `
      SELECT id, name FROM users WHERE id = $1
    `,
      [change.toConsultantId]
    );

    if (consultantResult.rows.length === 0) {
      return "Target consultant not found";
    }

    // Check if consultant is available (not on leave) for the date
    const leaveCheck = await client.query(
      `
      SELECT id FROM leaves 
      WHERE user_id = $1 
        AND status = 'approved'
        AND start_date <= $2 
        AND end_date >= $2
    `,
      [change.toConsultantId, change.date]
    );

    if (leaveCheck.rows.length > 0) {
      return `Consultant ${consultantResult.rows[0].name} is on leave for this date`;
    }

    // Check for scheduling conflicts (optional - depends on business rules)
    const conflictCheck = await client.query(
      `
      SELECT COUNT(*) as conflict_count
      FROM payroll_assignments pa
      JOIN payroll_dates pd ON pa.payroll_date_id = pd.id
      WHERE pa.consultant_id = $1 
        AND pd.adjusted_eft_date = $2
        AND pa.payroll_date_id != $3
    `,
      [change.toConsultantId, change.date, change.payrollDateId]
    );

    const conflictCount = parseInt(conflictCheck.rows[0].conflict_count);
    if (conflictCount >= 5) {
      // Max 5 payrolls per consultant per day
      return `Consultant already has ${conflictCount} assignments for this date (maximum 5 allowed)`;
    }

    return null; // No validation errors
  } catch (error) {
    console.error("Validation error:", error);
    return `Validation failed: ${getErrorMessage(error)}`;
  }
}

// Alternative implementation using Hasura Actions
export const hasuraActionHandler = {
  async commitPayrollAssignments(parent: any, args: any, context: any) {
    // This would be similar to above but using Hasura's context
    // and could leverage Hasura's built-in permissions and relationships

    const { changes } = args;

    // Use Hasura's GraphQL client to perform operations
    const results = await Promise.allSettled(
      changes.map(async (change: PayrollAssignmentInput) => {
        // Validate change using Hasura queries
        const validation = await context.hasura.query({
          query: `
            query ValidateAssignment($payrollDateId: uuid!, $consultantId: uuid!, $date: date!) {
              payroll_dates_by_pk(id: $payrollDateId) {
                id
                payroll {
                  name
                }
              }
              users_by_pk(id: $consultantId) {
                id
                name
                leaves(where: {
                  status: {_eq: "approved"}
                  start_date: {_lte: $date}
                  end_date: {_gte: $date}
                }) {
                  id
                }
              }
            }
          `,
          variables: {
            payrollDateId: change.payrollDateId,
            consultantId: change.toConsultantId,
            date: change.date,
          },
        });

        if (!validation.data.payroll_dates_by_pk) {
          throw new Error("Payroll date not found");
        }

        if (!validation.data.users_by_pk) {
          throw new Error("Consultant not found");
        }

        if (validation.data.usersby_pk.leaves.length > 0) {
          throw new Error("Consultant is on leave");
        }

        // Perform the update
        return await context.hasura.mutation({
          mutation: `
            mutation UpdateAssignment($payrollDateId: uuid!, $consultantId: uuid!) {
              insert_payroll_assignments_one(
                object: {
                  payroll_date_id: $payrollDateId
                  consultant_id: $consultantId
                }
                on_conflict: {
                  constraint: payroll_assignments_payroll_date_id_key
                  update_columns: [consultant_id, updated_at]
                }
              ) {
                id
                payroll_date_id
                consultant_id
              }
            }
          `,
          variables: {
            payrollDateId: change.payrollDateId,
            consultantId: change.toConsultantId,
          },
        });
      })
    );

    const successful = results.filter(r => r.status === "fulfilled");
    const failed = results.filter(r => r.status === "rejected");

    return {
      success: failed.length === 0,
      message: `${successful.length} changes processed successfully${
        failed.length > 0 ? `, ${failed.length} failed` : ""
      }`,
      errors: failed.map(f => f.reason?.message || "Unknown error"),
      affected_assignments: successful.map(s => s.value),
    };
  },
};

/*
SQL SETUP FOR AUDIT TRAIL:

CREATE TABLE payroll_assignment_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES payroll_assignments(id),
  payroll_date_id UUID NOT NULL REFERENCES payroll_dates(id),
  from_consultant_id UUID REFERENCES users(id),
  to_consultant_id UUID NOT NULL REFERENCES users(id),
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_assignment ON payroll_assignment_audit(assignment_id);
CREATE INDEX idx_audit_date ON payroll_assignment_audit(created_at);
CREATE INDEX idx_audit_changed_by ON payroll_assignment_audit(changed_by);

-- Add unique constraint to prevent duplicate assignments
ALTER TABLE payroll_assignments 
ADD CONSTRAINT payroll_assignments_payroll_date_id_key 
UNIQUE (payroll_date_id);
*/
