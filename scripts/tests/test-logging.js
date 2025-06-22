// Test script to verify SOC2 logging functionality
const {
  soc2Logger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} = require("./lib/logging/soc2-logger");

async function testLogging() {
  console.log("🧪 Testing SOC2 logging functionality...");

  try {
    // Test 1: Basic authentication log
    console.log("📝 Test 1: Authentication log");
    await soc2Logger.log({
      level: LogLevel.INFO,
      category: LogCategory.AUTHENTICATION,
      eventType: SOC2EventType.LOGIN_SUCCESS,
      message: "Test login successful",
      userId: "test-user-123",
      userEmail: "test@example.com",
      metadata: {
        testRun: true,
        timestamp: new Date().toISOString(),
      },
    });
    console.log("✅ Authentication log test completed");

    // Test 2: Data access log
    console.log("📝 Test 2: Data access log");
    await soc2Logger.log({
      level: LogLevel.INFO,
      category: LogCategory.DATA_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "Test data access",
      userId: "test-user-123",
      entityType: "users",
      entityId: "test-entity-456",
      metadata: {
        testRun: true,
        fields: ["id", "name", "email"],
        rowCount: 1,
      },
    });
    console.log("✅ Data access log test completed");

    // Test 3: Security event log
    console.log("📝 Test 3: Security event log");
    await soc2Logger.log({
      level: LogLevel.WARNING,
      category: LogCategory.SECURITY_EVENT,
      eventType: SOC2EventType.SUSPICIOUS_ACTIVITY,
      message: "Test security event",
      userId: "test-user-123",
      metadata: {
        testRun: true,
        reason: "Testing logging functionality",
      },
    });
    console.log("✅ Security event log test completed");

    // Test 4: General audit log
    console.log("📝 Test 4: General audit log");
    await soc2Logger.log({
      level: LogLevel.INFO,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.CONFIG_CHANGED,
      message: "Test configuration change",
      userId: "test-user-123",
      metadata: {
        testRun: true,
        component: "logging-test",
      },
    });
    console.log("✅ General audit log test completed");

    console.log("🎉 All logging tests completed successfully!");

    // Show metrics
    const metrics = soc2Logger.getMetrics
      ? soc2Logger.getMetrics()
      : "No metrics available";
    console.log("📊 Logger metrics:", metrics);
  } catch (error) {
    console.error("❌ Logging test failed:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    // Check if it's a GraphQL error
    if (error.graphQLErrors) {
      console.error("GraphQL Errors:", error.graphQLErrors);
    }

    // Check if it's a network error
    if (error.networkError) {
      console.error("Network Error:", error.networkError);
    }
  }
}

// Run the test
testLogging()
  .then(() => {
    console.log("🏁 Test script completed");
    process.exit(0);
  })
  .catch(error => {
    console.error("💥 Test script failed:", error);
    process.exit(1);
  });
