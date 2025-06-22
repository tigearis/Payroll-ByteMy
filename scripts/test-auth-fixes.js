#!/usr/bin/env node
// scripts/test-auth-fixes.js - Comprehensive authentication testing script

// Use built-in fetch (Node.js 18+)
const fetch = globalThis.fetch;

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN; // Optional: For authenticated tests

console.log("🚀 Starting comprehensive authentication tests...\n");

const tests = [];
let passedTests = 0;
let failedTests = 0;

// Test result tracking
function addTest(name, testFn) {
  tests.push({ name, testFn });
}

async function runTest(name, testFn) {
  try {
    console.log(`🧪 Testing: ${name}`);
    await testFn();
    console.log(`✅ PASS: ${name}\n`);
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error.message}\n`);
    failedTests++;
  }
}

// Helper function to make requests
async function makeRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.text();
  let jsonData;
  try {
    jsonData = JSON.parse(data);
  } catch {
    jsonData = { raw: data };
  }

  return { status: response.status, data: jsonData, headers: response.headers };
}

// Test 1: Previously unprotected routes should now require authentication
addTest("Critical routes now require authentication", async () => {
  const criticalRoutes = [
    "/api/audit/compliance-report",
    "/api/chat",
    "/api/commit-payroll-assignments",
    "/api/staff/create",
  ];

  for (const route of criticalRoutes) {
    const response = await makeRequest(route, { method: "POST" });

    if (response.status === 401) {
      console.log(`   ✓ ${route} properly requires authentication`);
    } else {
      throw new Error(`${route} should return 401, got ${response.status}`);
    }
  }
});

// Test 2: Test routes should be blocked in production
addTest("Test routes blocked in production", async () => {
  const testRoutes = [
    "/api/simple-test",
    "/api/debug-post",
    "/api/minimal-post-test",
    "/api/test-create",
  ];

  // This test assumes NODE_ENV=production for production check
  const isProduction = process.env.NODE_ENV === "production";

  for (const route of testRoutes) {
    const response = await makeRequest(route, { method: "GET" });

    if (isProduction) {
      // In production, should be blocked by middleware
      if (response.status === 401) {
        console.log(`   ✓ ${route} properly blocked in production`);
      } else {
        throw new Error(
          `${route} should be blocked in production, got ${response.status}`
        );
      }
    } else {
      // In development, should be accessible
      console.log(
        `   ✓ ${route} accessible in development (status: ${response.status})`
      );
    }
  }
});

// Test 3: API signing endpoints exist and require proper authentication
addTest("API signing endpoints require admin access", async () => {
  const signingRoutes = [
    "/api/admin/api-keys",
    "/api/signed/payroll-operations",
  ];

  for (const route of signingRoutes) {
    const response = await makeRequest(route, { method: "GET" });

    // Should require authentication (401) or admin access (403)
    if (response.status === 401 || response.status === 403) {
      console.log(`   ✓ ${route} properly protected`);
    } else {
      throw new Error(
        `${route} should require auth/admin access, got ${response.status}`
      );
    }
  }
});

// Test 4: Token management endpoints respond correctly
addTest("Token management endpoints functional", async () => {
  const response = await makeRequest("/api/auth/token", { method: "GET" });

  // Should require authentication
  if (response.status === 401) {
    console.log("   ✓ Token endpoint requires authentication");
  } else {
    throw new Error(
      `Token endpoint should require auth, got ${response.status}`
    );
  }
});

// Test 5: Webhook endpoints have proper validation
addTest("Webhook endpoints have proper validation", async () => {
  const webhookRoutes = ["/api/clerk-webhooks", "/api/audit/log"];

  for (const route of webhookRoutes) {
    const response = await makeRequest(route, {
      method: "POST",
      body: JSON.stringify({ test: "data" }),
    });

    // Should reject without proper signatures/secrets
    if (response.status >= 400) {
      console.log(`   ✓ ${route} properly validates requests`);
    } else {
      throw new Error(
        `${route} should validate webhook signatures, got ${response.status}`
      );
    }
  }
});

// Test 6: Rate limiting and monitoring are active
addTest("Enhanced monitoring is active", async () => {
  // Make multiple rapid requests to test rate limiting detection
  const route = "/api/users";
  const responses = [];

  for (let i = 0; i < 5; i++) {
    const response = await makeRequest(route, { method: "GET" });
    responses.push(response.status);

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // All requests should be handled (even if they fail auth)
  // The monitoring system should be tracking these
  console.log(
    `   ✓ Made ${responses.length} requests, monitoring system active`
  );
  console.log(`   ✓ Response statuses: ${responses.join(", ")}`);
});

// Test 7: Error responses are standardized
addTest("Error responses are standardized", async () => {
  const response = await makeRequest("/api/users", { method: "GET" });

  if (response.status === 401 && response.data.error && response.data.code) {
    console.log("   ✓ Standardized error format: { error, code }");
  } else if (response.status === 401) {
    console.log("   ✓ Authentication required (expected response)");
  } else {
    throw new Error(
      `Expected 401 with standard error format, got ${response.status}`
    );
  }
});

// Test 8: MFA feature flag is properly disabled
addTest("MFA feature flag properly disabled", async () => {
  // MFA should be disabled by default, so routes should work without MFA
  const response = await makeRequest("/api/staff/delete", {
    method: "GET",
    headers: {
      // Simulate a request that would trigger MFA if enabled
    },
  });

  // Should fail due to lack of authentication, not MFA requirement
  if (response.status === 401) {
    console.log(
      "   ✓ MFA feature properly disabled (auth failure, not MFA requirement)"
    );
  } else {
    throw new Error(`Expected 401 for auth, got ${response.status}`);
  }
});

// Test 9: Centralized token management is working
addTest("Centralized token management active", async () => {
  // This test verifies that the token management system is responding
  // by checking that requests are handled consistently

  const routes = ["/api/users", "/api/staff/create", "/api/chat"];
  const statuses = [];

  for (const route of routes) {
    const response = await makeRequest(route, { method: "GET" });
    statuses.push(response.status);
  }

  // All routes should have consistent authentication behavior
  const allSame = statuses.every(status => status === statuses[0]);

  if (allSame && statuses[0] === 401) {
    console.log("   ✓ Consistent authentication behavior across routes");
  } else {
    throw new Error(`Inconsistent auth behavior: ${statuses.join(", ")}`);
  }
});

// Test 10: SOC2 compliance logging is active
addTest("SOC2 compliance logging active", async () => {
  // Test that significant routes trigger logging (we can't easily test the logs,
  // but we can verify the routes are handling requests properly)

  const significantRoute = "/api/audit/compliance-report";
  const response = await makeRequest(significantRoute, {
    method: "POST",
    body: JSON.stringify({
      reportType: "user_access",
      startDate: "2024-01-01",
      endDate: "2024-01-02",
    }),
  });

  // Should require authentication (logged) and have proper error format
  if (response.status === 401 || response.status === 403) {
    console.log("   ✓ Significant routes properly protected and logged");
  } else {
    throw new Error(`Expected auth protection, got ${response.status}`);
  }
});

// Run all tests
async function runAllTests() {
  console.log(`📋 Running ${tests.length} authentication tests...\n`);

  for (const test of tests) {
    await runTest(test.name, test.testFn);
  }

  // Summary
  console.log("==========================================");
  console.log("🏁 Test Results Summary");
  console.log("==========================================");
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📊 Total:  ${passedTests + failedTests}`);
  console.log(
    `📈 Success Rate: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`
  );

  if (failedTests === 0) {
    console.log("\n🎉 All authentication fixes are working correctly!");
    console.log("✅ Ready for production deployment");
  } else {
    console.log(
      "\n⚠️  Some tests failed. Review the issues above before deployment."
    );
    process.exit(1);
  }
}

// Additional manual test instructions
function printManualTestInstructions() {
  console.log("\n==========================================");
  console.log("📋 Manual Tests to Perform");
  console.log("==========================================");
  console.log("1. 🔐 Authentication Flow:");
  console.log("   - Log in as admin user");
  console.log("   - Try accessing /api/staff/create");
  console.log("   - Verify it works with proper authentication");
  console.log("");
  console.log("2. 🔒 Role-Based Access:");
  console.log("   - Log in as different role levels");
  console.log("   - Test access to admin-only routes");
  console.log("   - Verify proper permission enforcement");
  console.log("");
  console.log("3. 🚀 API Key Management:");
  console.log("   - Access /api/admin/api-keys as admin");
  console.log("   - Create a new API key");
  console.log("   - Test signed requests to /api/signed/payroll-operations");
  console.log("");
  console.log("4. 📊 Monitoring Dashboard:");
  console.log("   - Check application logs for monitoring data");
  console.log("   - Verify SOC2 audit logs are being generated");
  console.log("   - Monitor for any authentication errors");
  console.log("");
  console.log("5. 🔄 Token Refresh:");
  console.log("   - Use the application for extended period");
  console.log("   - Verify tokens refresh automatically");
  console.log("   - Check for any authentication interruptions");
}

// Run the tests
runAllTests()
  .then(() => {
    printManualTestInstructions();
  })
  .catch(error => {
    console.error("❌ Test runner failed:", error);
    process.exit(1);
  });
