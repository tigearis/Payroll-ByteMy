// Test script for developer API endpoints
const testEndpoint = async (endpoint, method = "GET", body = null) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log(`\n🧪 Testing ${method} ${endpoint}...`);
    const response = await fetch(`http://localhost:3000${endpoint}`, options);
    const data = await response.json();

    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error(`❌ Error testing ${endpoint}:`, error.message);
    return null;
  }
};

// Test the endpoints (commented out the destructive ones for safety)
const runTests = async () => {
  console.log("🚀 Testing Developer API Endpoints");

  // Test a simple payroll ID check (non-destructive)
  await testEndpoint("/api/developer/clean-single-payroll", "POST", {
    payrollId: "test-id-that-does-not-exist",
  });

  // Test date range validation
  await testEndpoint("/api/developer/regenerate-single-dates", "POST", {
    payrollId: "5c2ef179-308f-4545-bf7b-40c83b55f0c8",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  });

  console.log("\n✅ API endpoint tests completed");
};

// Uncomment to run tests
// runTests();

console.log("Test script loaded. Run runTests() to execute.");
console.log("Individual endpoints can be tested with:");
console.log(
  '- testEndpoint("/api/developer/clean-single-payroll", "POST", { payrollId: "test-id" })'
);
console.log(
  '- testEndpoint("/api/developer/regenerate-single-dates", "POST", { payrollId: "id", startDate: "2024-01-01", endDate: "2024-12-31" })'
);

module.exports = { testEndpoint, runTests };
