// app/api/payrolls/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServerApolloClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";

export async function GET(_: NextRequest) {
  try {
    const client = await getServerApolloClient();
    
    const { data } = await client.query({
      query: gql`
        query GetPayrolls {
          payrolls {
            name
            payroll_system
            processing_days_before_eft
            status
            date_value
            client {
              name
            }
            payroll_cycle {
              name
            }
            payroll_date_type {
              name
            }
          }
        }
      `
    });

    return NextResponse.json({ payrolls: data.payrolls });
  } catch (error) {
    console.error("Payroll fetch error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ✅ POST: Create a New Payroll using GraphQL
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role for permission check
    const token = await getToken({ template: "hasura" });
    let userRole = "viewer"; // Default role
    
    if (token) {
      // Decode token to get role
      const tokenParts = token.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      const hasuraClaims = payload['https://hasura.io/jwt/claims'];
      userRole = hasuraClaims?.['x-hasura-default-role'] || "viewer";
    }

    // Check role-based access
    if (!["manager", "org_admin", "dev"].includes(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: Manager, admin, or dev access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      clientId,
      name,
      cycleId,
      dateTypeId,
      dateValue,
      primaryConsultantId,
      backupConsultantId,
      managerId,
      payrollSystem,
      processingDaysBeforeEft,
      status,
    } = body;

    // ✅ Validate Required Fields
    if (!clientId || !name || !cycleId || !dateTypeId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get Apollo client with auth context
    const client = await getServerApolloClient();
    
    // Create payroll using GraphQL mutation
    const { data } = await client.mutate({
      mutation: gql`
        mutation CreatePayroll(
          $clientId: ID!, 
          $name: String!, 
          $cycleId: ID!, 
          $dateTypeId: ID!, 
          $dateValue: String,
          $primaryConsultantId: ID,
          $backupConsultantId: ID,
          $managerId: ID,
          $payrollSystem: String,
          $processingDaysBeforeEft: Int!,
          $status: String!
        ) {
          createPayroll(input: {
            client_id: $clientId,
            name: $name,
            cycle_id: $cycleId,
            date_type_id: $dateTypeId,
            date_value: $dateValue,
            primary_consultant_id: $primaryConsultantId,
            backup_consultant_id: $backupConsultantId,
            manager_id: $managerId,
            payroll_system: $payrollSystem,
            processing_days_before_eft: $processingDaysBeforeEft,
            status: $status
          }) {
            id
            name
          }
        }
      `,
      variables: {
        clientId,
        name,
        cycleId,
        dateTypeId,
        dateValue: dateValue || null,
        primaryConsultantId: primaryConsultantId || null,
        backupConsultantId: backupConsultantId || null,
        managerId: managerId || null,
        payrollSystem: payrollSystem || null,
        processingDaysBeforeEft: processingDaysBeforeEft || 2,
        status
      }
    });

    return NextResponse.json({
      success: true,
      message: "Payroll created successfully",
      payroll: data.createPayroll
    });
  } catch (error) {
    console.error("Payroll creation error:", error);
    return NextResponse.json({ 
      error: "Something went wrong", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}