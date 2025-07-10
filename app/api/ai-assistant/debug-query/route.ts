/**
 * Debug endpoint to test AI query generation in isolation
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { langChainService } from "../../../../lib/ai/langchain-service";

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const authResult = await auth();
    const userId = authResult.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message } = body;

    // Simple schema for testing
    const testSchema = `
# Available Tables:
clients (
  id, name, status, manager_id, created_at
  manager ( id, name, email )
)

payrolls (
  id, name, status, client_id, start_date, end_date
  client ( id, name )
)
    `;

    console.log("🧪 [Debug] Testing AI query generation for:", message);

    // Test AI query generation
    const result = await langChainService.generateGraphQLQuery(message, {
      userId,
      userRole: "developer",
      currentPage: "debug",
      availableSchema: testSchema,
    });

    console.log("🧪 [Debug] AI generated result:", result);

    return NextResponse.json({
      success: true,
      original_message: message,
      ai_result: result,
      debug_info: {
        query_length: result.query.length,
        query_first_50: result.query.substring(0, 50),
        query_last_50: result.query.substring(Math.max(0, result.query.length - 50)),
        has_opening_brace: result.query.includes("{"),
        has_closing_brace: result.query.includes("}"),
        brace_count: {
          open: (result.query.match(/{/g) || []).length,
          close: (result.query.match(/}/g) || []).length,
        }
      }
    });

  } catch (error) {
    console.error("🧪 [Debug] Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}