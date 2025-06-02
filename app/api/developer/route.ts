// app/api/developer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/server-apollo-client";

// Define GraphQL operations for all tables
const GET_ALL_CLIENTS = gql`
  query GetAllClients {
    clients {
      id
      name
      contact_person
      contact_email
      contact_phone
      active
      created_at
      updated_at
    }
  }
`;

const GET_ALL_PAYROLLS = gql`
  query GetAllPayrolls {
    payrolls {
      id
      name
      client_id
      cycle_id
      date_type_id
      date_value
      primary_consultant_id
      backup_consultant_id
      manager_id
      processing_days_before_eft
      payroll_system
      status
      created_at
      updated_at
    }
  }
`;

const GET_ALL_STAFF = gql`
  query GetAllStaff {
    staff {
      id
      name
      email
      phone
      position
      active
      created_at
      updated_at
    }
  }
`;

const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      email
      role
      created_at
      updated_at
    }
  }
`;

const UPDATE_TABLE_RECORD = gql`
  mutation UpdateRecord($table: String!, $id: ID!, $data: jsonb!) {
    update_generic_by_pk(
      table: $table
      pk_column: "id"
      pk_value: $id
      _set: $data
    ) {
      affected_rows
    }
  }
`;

const DELETE_TABLE_RECORD = gql`
  mutation DeleteRecord($table: String!, $id: ID!) {
    delete_generic_by_pk(table: $table, pk_column: "id", pk_value: $id) {
      affected_rows
    }
  }
`;

const INSERT_TABLE_RECORD = gql`
  mutation InsertRecord($table: String!, $data: jsonb!) {
    insert_generic_one(table: $table, object: $data) {
      id
    }
  }
`;

const GET_PAYROLLS_WITH_DATES = gql`
  query GetPayrollsWithDates {
    payrolls {
      id
      client_id
      pay_period_start
      pay_period_end
      status
      payroll_dates {
        id
        date
        is_holiday
        holiday_name
      }
      client {
        name
      }
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for dev role
    const token = await getToken({ template: "hasura" });
    if (token) {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const role =
        payload["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"];

      if (role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { operation, table, id, data } = await req.json();

    // Execute the requested operation
    switch (operation) {
      case "get_all_clients":
        const clientsResult = await adminApolloClient.query({
          query: GET_ALL_CLIENTS,
        });
        return NextResponse.json({
          success: true,
          clients: clientsResult.data.clients,
        });

      case "get_all_payrolls":
        const payrollsResult = await adminApolloClient.query({
          query: GET_ALL_PAYROLLS,
        });
        return NextResponse.json({
          success: true,
          payrolls: payrollsResult.data.payrolls,
        });

      case "get_all_staff":
        const staffResult = await adminApolloClient.query({
          query: GET_ALL_STAFF,
        });
        return NextResponse.json({
          success: true,
          staff: staffResult.data.staff,
        });

      case "get_all_users":
        const usersResult = await adminApolloClient.query({
          query: GET_ALL_USERS,
        });
        return NextResponse.json({
          success: true,
          users: usersResult.data.users,
        });

      case "update":
        if (!table || !id || !data) {
          return NextResponse.json(
            { error: "Missing required parameters" },
            { status: 400 }
          );
        }
        const updateResult = await adminApolloClient.mutate({
          mutation: UPDATE_TABLE_RECORD,
          variables: { table, id, data },
        });
        return NextResponse.json({
          success: true,
          affected_rows: updateResult.data.update_generic_by_pk.affected_rows,
        });

      case "delete":
        if (!table || !id) {
          return NextResponse.json(
            { error: "Missing required parameters" },
            { status: 400 }
          );
        }
        const deleteResult = await adminApolloClient.mutate({
          mutation: DELETE_TABLE_RECORD,
          variables: { table, id },
        });
        return NextResponse.json({
          success: true,
          affected_rows: deleteResult.data.delete_generic_by_pk.affected_rows,
        });

      case "insert":
        if (!table || !data) {
          return NextResponse.json(
            { error: "Missing required parameters" },
            { status: 400 }
          );
        }
        const insertResult = await adminApolloClient.mutate({
          mutation: INSERT_TABLE_RECORD,
          variables: { table, data },
        });
        return NextResponse.json({
          success: true,
          id: insertResult.data.insert_generic_one.id,
        });

      default:
        return NextResponse.json(
          { error: "Invalid operation" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Developer operation error:", error);
    return NextResponse.json(
      {
        error: "Operation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if user is authenticated and has admin/developer role
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin/developer role
    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const userRole = claims?.["x-hasura-default-role"];

    if (!["admin"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Execute query using admin client
    const { data, errors } = await adminApolloClient.query({
      query: GET_PAYROLLS_WITH_DATES,
      fetchPolicy: "network-only",
    });

    if (errors && errors.length > 0) {
      console.error("GraphQL errors:", errors);
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      payrolls: data.payrolls,
      success: true,
    });
  } catch (error) {
    console.error("Developer API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
