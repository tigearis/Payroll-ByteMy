import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";
import { secureHasuraService } from "@/lib/secure-hasura-service";
import { auditLogger, AuditAction, DataClassification } from "@/lib/audit/audit-logger";
import { gql } from "@apollo/client";

const CREATE_STAFF_MUTATION = gql`
  mutation CreateStaff(
    $name: String!
    $email: String!
    $role: user_role!
    $managerId: uuid
  ) {
    insert_users_one(
      object: {
        name: $name
        email: $email
        role: $role
        manager_id: $managerId
        is_staff: true
      }
    ) {
      id
      name
      email
      role
    }
  }
`;

export const POST = withAuth(
  async (request: NextRequest, session) => {
    const requestId = crypto.randomUUID();
    
    try {
      const body = await request.json();
      const { name, email, role, managerId } = body;

      // Validate input
      if (!name || !email || !role) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Create staff member
      const { data, errors } = await secureHasuraService.executeAdminMutation(
        CREATE_STAFF_MUTATION,
        {
          name,
          email,
          role,
          managerId,
        }
      );

      if (errors) {
        // Log failed attempt
        await auditLogger.log({
          userId: session.userId,
          userRole: session.role,
          action: AuditAction.CREATE,
          entityType: "users",
          dataClassification: DataClassification.HIGH, // Contains PII
          fieldsAffected: ["name", "email", "role"],
          newValues: { name, email, role },
          requestId,
          success: false,
          errorMessage: errors[0].message,
        }, request);

        return NextResponse.json(
          { error: "Failed to create staff member", details: errors },
          { status: 500 }
        );
      }

      // Log successful creation
      await auditLogger.log({
        userId: session.userId,
        userRole: session.role,
        action: AuditAction.CREATE,
        entityType: "users",
        entityId: data.insert_users_one.id,
        dataClassification: DataClassification.HIGH,
        fieldsAffected: ["name", "email", "role", "is_staff"],
        newValues: {
          name,
          email,
          role,
          is_staff: true,
        },
        requestId,
        success: true,
      }, request);

      // Also log data access for compliance
      await auditLogger.logDataAccess(
        session.userId,
        "users",
        DataClassification.HIGH,
        1,
        "Create new staff member"
      );

      return NextResponse.json({
        success: true,
        data: data.insert_users_one,
      });
    } catch (error: any) {
      // Log system error
      await auditLogger.logSecurityEvent(
        "staff_creation_error",
        "error",
        {
          error: error.message,
          stack: error.stack,
        },
        session.userId,
        request.headers.get("x-forwarded-for") || undefined
      );

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  { requiredRole: "manager" } // Only managers and above can create staff
);