import { NextRequest, NextResponse } from "next/server";
import { soc2Logger, LogLevel, LogCategory, SOC2EventType } from "@/lib/logging/soc2-logger";

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing SOC2 logging from API endpoint...');

    // Test authentication log
    await soc2Logger.log({
      level: LogLevel.INFO,
      category: LogCategory.AUTHENTICATION,
      eventType: SOC2EventType.LOGIN_SUCCESS,
      message: "API test - authentication log",
      userId: "test-user-api-123",
      userEmail: "api-test@example.com",
      metadata: {
        source: "api-test",
        timestamp: new Date().toISOString()
      }
    }, request);

    console.log('✅ Authentication log test completed');

    // Test data access log
    await soc2Logger.log({
      level: LogLevel.INFO,
      category: LogCategory.DATA_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "API test - data access log",
      userId: "test-user-api-123",
      entityType: "test_entities",
      entityId: "test-entity-api-456",
      metadata: {
        source: "api-test",
        fields: ["id", "name"],
        rowCount: 1
      }
    }, request);

    console.log('✅ Data access log test completed');

    return NextResponse.json({
      success: true,
      message: "Logging test completed successfully",
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ API Logging test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: "Logging test failed",
      error: {
        name: error.name,
        message: error.message,
        graphQLErrors: error.graphQLErrors?.map((e: any) => ({
          message: e.message,
          extensions: e.extensions
        })),
        networkError: error.networkError ? {
          message: error.networkError.message,
          statusCode: error.networkError.statusCode
        } : null
      }
    }, { status: 500 });
  }
}