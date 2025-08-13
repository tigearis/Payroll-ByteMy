import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasMinimumRole } from "@/lib/permissions/role-utils";

export async function GET(request: Request) {
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

    // 3. Return mock metadata for now
    // In a real implementation, this would come from Hasura introspection or a cached schema
    return NextResponse.json({
      domains: {
        payrolls: {
          displayName: "Payrolls",
          description: "Payroll records and processing data",
          fields: [
            {
              name: "id",
              displayName: "ID",
              type: "string",
              description: "Unique identifier",
            },
            {
              name: "employee_id",
              displayName: "Employee",
              type: "string",
              description: "Employee reference",
            },
            {
              name: "period_start",
              displayName: "Period Start",
              type: "date",
              description: "Start date of pay period",
              recommended: true,
            },
            {
              name: "period_end",
              displayName: "Period End",
              type: "date",
              description: "End date of pay period",
              recommended: true,
            },
            {
              name: "gross_amount",
              displayName: "Gross Amount",
              type: "number",
              description: "Gross payment amount",
              recommended: true,
            },
            {
              name: "tax_amount",
              displayName: "Tax Amount",
              type: "number",
              description: "Tax withheld",
              recommended: true,
            },
            {
              name: "net_amount",
              displayName: "Net Amount",
              type: "number",
              description: "Net payment amount",
              recommended: true,
            },
            {
              name: "status",
              displayName: "Status",
              type: "string",
              description: "Processing status",
            },
            {
              name: "created_at",
              displayName: "Created At",
              type: "date",
              description: "Creation timestamp",
            },
            {
              name: "updated_at",
              displayName: "Updated At",
              type: "date",
              description: "Last update timestamp",
            },
          ],
        },
        staff: {
          displayName: "Staff",
          description: "Employee and staff member information",
          fields: [
            {
              name: "id",
              displayName: "ID",
              type: "string",
              description: "Unique identifier",
            },
            {
              name: "first_name",
              displayName: "First Name",
              type: "string",
              description: "First name",
              recommended: true,
            },
            {
              name: "last_name",
              displayName: "Last Name",
              type: "string",
              description: "Last name",
              recommended: true,
            },
            {
              name: "email",
              displayName: "Email",
              type: "string",
              description: "Email address",
              sensitive: true,
            },
            {
              name: "department_id",
              displayName: "Department",
              type: "string",
              description: "Department reference",
            },
            {
              name: "position",
              displayName: "Position",
              type: "string",
              description: "Job position",
            },
            {
              name: "hire_date",
              displayName: "Hire Date",
              type: "date",
              description: "Date of hire",
              recommended: true,
            },
            {
              name: "status",
              displayName: "Status",
              type: "string",
              description: "Employment status",
            },
            {
              name: "created_at",
              displayName: "Created At",
              type: "date",
              description: "Creation timestamp",
            },
            {
              name: "updated_at",
              displayName: "Updated At",
              type: "date",
              description: "Last update timestamp",
            },
          ],
        },
        departments: {
          displayName: "Departments",
          description: "Department information",
          fields: [
            {
              name: "id",
              displayName: "ID",
              type: "string",
              description: "Unique identifier",
            },
            {
              name: "name",
              displayName: "Name",
              type: "string",
              description: "Department name",
              recommended: true,
            },
            {
              name: "manager_id",
              displayName: "Manager",
              type: "string",
              description: "Department manager reference",
            },
            {
              name: "created_at",
              displayName: "Created At",
              type: "date",
              description: "Creation timestamp",
            },
            {
              name: "updated_at",
              displayName: "Updated At",
              type: "date",
              description: "Last update timestamp",
            },
          ],
        },
        leave_requests: {
          displayName: "Leave Requests",
          description: "Employee leave requests",
          fields: [
            {
              name: "id",
              displayName: "ID",
              type: "string",
              description: "Unique identifier",
            },
            {
              name: "employee_id",
              displayName: "Employee",
              type: "string",
              description: "Employee reference",
            },
            {
              name: "start_date",
              displayName: "Start Date",
              type: "date",
              description: "Leave start date",
              recommended: true,
            },
            {
              name: "end_date",
              displayName: "End Date",
              type: "date",
              description: "Leave end date",
              recommended: true,
            },
            {
              name: "type",
              displayName: "Type",
              type: "string",
              description: "Leave type",
              recommended: true,
            },
            {
              name: "status",
              displayName: "Status",
              type: "string",
              description: "Approval status",
              recommended: true,
            },
            {
              name: "reason",
              displayName: "Reason",
              type: "string",
              description: "Leave reason",
              sensitive: true,
            },
            {
              name: "created_at",
              displayName: "Created At",
              type: "date",
              description: "Creation timestamp",
            },
            {
              name: "updated_at",
              displayName: "Updated At",
              type: "date",
              description: "Last update timestamp",
            },
          ],
        },
        clients: {
          displayName: "Clients",
          description: "Client information",
          fields: [
            {
              name: "id",
              displayName: "ID",
              type: "string",
              description: "Unique identifier",
            },
            {
              name: "name",
              displayName: "Name",
              type: "string",
              description: "Client name",
              recommended: true,
            },
            {
              name: "contact_person",
              displayName: "Contact Person",
              type: "string",
              description: "Primary contact",
            },
            {
              name: "email",
              displayName: "Email",
              type: "string",
              description: "Contact email",
              sensitive: true,
            },
            {
              name: "phone",
              displayName: "Phone",
              type: "string",
              description: "Contact phone",
              sensitive: true,
            },
            {
              name: "active",
              displayName: "Active",
              type: "boolean",
              description: "Active status",
            },
            {
              name: "created_at",
              displayName: "Created At",
              type: "date",
              description: "Creation timestamp",
            },
            {
              name: "updated_at",
              displayName: "Updated At",
              type: "date",
              description: "Last update timestamp",
            },
          ],
        },
      },
      relationships: {
        payrolls: {
          employee_id: "staff.id",
        },
        staff: {
          department_id: "departments.id",
        },
        departments: {
          manager_id: "staff.id",
        },
        leave_requests: {
          employee_id: "staff.id",
        },
      },
      fieldTypes: {
        id: "string",
        name: "string",
        email: "string",
        phone: "string",
        date: "date",
        amount: "number",
        status: "string",
        boolean: "boolean",
      },
    });
  } catch (error) {
    console.error("Error fetching report metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch report metadata" },
      { status: 500 }
    );
  }
}
