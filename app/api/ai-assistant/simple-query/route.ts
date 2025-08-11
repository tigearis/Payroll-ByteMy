/**
 * Simplified AI Assistant Query API for Testing
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

export async function POST(request: NextRequest) {
  let userId: string | null = null;
  let userRole: string = "viewer";
  let queryRequest: string = "";
  
  try {
    console.log("Simple query API called");
    
    // Authentication check
    const authResult = await auth();
    userId = authResult.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("Auth successful, userId:", userId);

    // Parse request body
    const body = await request.json();
    const { request: requestString, context = {}, executeQuery = false } = body;
    queryRequest = requestString;

    console.log("Request parsed:", { queryRequest, context, executeQuery });

    if (!queryRequest || queryRequest.trim().length === 0) {
      return NextResponse.json(
        { error: "Query request is required" },
        { status: 400 }
      );
    }

    // Get user context and check role-based access
    userRole = (request.headers.get("x-user-role") || "viewer") as string;
    const allowedRoles = ["developer", "org_admin", "manager"];
    
    console.log("User role:", userRole, "allowed roles:", allowedRoles);
    
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { 
          error: "AI assistant access requires elevated permissions",
          requiredRoles: allowedRoles,
          currentRole: userRole
        },
        { status: 403 }
      );
    }

    // Return a simple success response for now
    const response = {
      query: "query { __typename }",
      explanation: `I would generate a query for: "${queryRequest}" but this is a simplified test version.`,
      variables: {},
      data: null,
      errors: null,
      security: {
        isValid: true,
        report: "Test security validation passed",
      },
      metadata: {
        complexity: 1,
        depth: 1,
        fieldCount: 1,
        tablesToAccess: ["test"],
      },
    };

    console.log("Returning response:", response);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Simple Query API Error:", error);
    
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      queryRequest: queryRequest?.substring(0, 100) + "...",
    };
    console.error("Detailed error info:", errorDetails);

    return NextResponse.json(
      { 
        error: "Query generation failed", 
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}