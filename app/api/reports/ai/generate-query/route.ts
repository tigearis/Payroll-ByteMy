import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasMinimumRole } from "@/lib/permissions/role-utils";

const requestSchema = z.object({
  prompt: z.string().min(1).max(1000),
});

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate role
    const role = sessionClaims?.metadata?.role;
    if (!hasMinimumRole(role, "viewer")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // 3. Validate input
    const body = await request.json();
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { prompt } = validationResult.data;

    // 4. Generate query using AI service
    // In a real implementation, this would call an AI service
    // For now, we'll return a mock response

    // Mock schema information
    const schemaInfo = `
      Table: payrolls
      Fields: id, employee_id, period_start, period_end, gross_amount, tax_amount, net_amount, status, created_at, updated_at
      
      Table: employees
      Fields: id, first_name, last_name, email, department_id, position, hire_date, status, created_at, updated_at
      
      Table: departments
      Fields: id, name, manager_id, created_at, updated_at
      
      Table: leave_requests
      Fields: id, employee_id, start_date, end_date, type, status, reason, created_at, updated_at
    `;

    // Generate a mock query based on the prompt
    let generatedQuery = "";
    let explanation = "";

    if (
      prompt.toLowerCase().includes("payroll") &&
      prompt.toLowerCase().includes("department")
    ) {
      generatedQuery = `
query PayrollByDepartment($periodStart: date!, $periodEnd: date!) {
  departments {
    name
    payrolls: employees_aggregate {
      aggregate {
        sum {
          payrolls_aggregate {
            aggregate {
              sum {
                gross_amount
                tax_amount
                net_amount
              }
            }
          }
        }
      }
    }
  }
}`;
      explanation =
        "I've generated a query that shows payroll totals grouped by department. You can filter by date range using the provided variables.";
    } else if (
      prompt.toLowerCase().includes("leave") &&
      prompt.toLowerCase().includes("pending")
    ) {
      generatedQuery = `
query PendingLeaveRequests {
  leave_requests(where: {status: {_eq: "pending"}}) {
    id
    employee {
      first_name
      last_name
      department {
        name
      }
    }
    start_date
    end_date
    type
    reason
    created_at
  }
}`;
      explanation =
        "This query lists all leave requests with 'pending' status, including employee details and department information.";
    } else if (
      prompt.toLowerCase().includes("client") &&
      prompt.toLowerCase().includes("billing")
    ) {
      generatedQuery = `
query ClientBillingComparison($currentMonth: date!, $lastMonth: date!) {
  clients {
    name
    current_month: invoices_aggregate(where: {date: {_gte: $currentMonth}}) {
      aggregate {
        sum {
          amount
        }
      }
    }
    previous_month: invoices_aggregate(where: {date: {_gte: $lastMonth, _lt: $currentMonth}}) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
}`;
      explanation =
        "I've created a query that compares client billing between the current month and previous month. You'll need to provide date parameters.";
    } else {
      generatedQuery = `
query GeneratedQuery {
  # This is a placeholder query based on your description
  # You can customize it further as needed
  payrolls(limit: 10) {
    id
    employee {
      first_name
      last_name
      department {
        name
      }
    }
    period_start
    period_end
    gross_amount
    tax_amount
    net_amount
  }
}`;
      explanation =
        "I've generated a basic query based on your description. You may want to customize it further to meet your specific requirements.";
    }

    // 5. Return the generated query
    return NextResponse.json({
      query: generatedQuery,
      explanation,
      parameters: {},
    });
  } catch (error) {
    console.error("Error generating query:", error);
    return NextResponse.json(
      { error: "Failed to generate query" },
      { status: 500 }
    );
  }
}
