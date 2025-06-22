// test-holiday-sync-simple.js - Simple Holiday Sync Test
console.log("🚀 Holiday Sync Test - Simplified Version\n");

// Test 1: External API Test
async function testNagerDateAPI() {
  console.log("🌐 Testing Nager.Date API (External Holiday Source)...\n");

  const currentYear = new Date().getFullYear();
  const url = `https://date.nager.at/api/v3/PublicHolidays/${currentYear}/AU`;

  try {
    const response = await fetch(url);
    const holidays = await response.json();

    if (response.ok && Array.isArray(holidays)) {
      console.log(
        `✅ Successfully fetched ${holidays.length} Australian holidays for ${currentYear}`
      );
      console.log("\n📋 Sample holidays:");

      holidays.slice(0, 5).forEach((holiday, index) => {
        const date = new Date(holiday.date).toLocaleDateString();
        const regions = holiday.counties?.join(", ") || "National";
        console.log(`   ${index + 1}. ${date} - ${holiday.name}`);
        console.log(`      Local: ${holiday.localName}, Regions: ${regions}`);
      });

      if (holidays.length > 5) {
        console.log(`   ... and ${holidays.length - 5} more holidays\n`);
      }

      return { success: true, count: holidays.length, data: holidays };
    } else {
      console.log("❌ Failed to fetch holidays from API");
      return { success: false, error: "API request failed" };
    }
  } catch (error) {
    console.log("❌ Error fetching from API:", error.message);
    return { success: false, error: error.message };
  }
}

// Test 2: Test Hasura endpoint availability
async function testHasuraEndpoint() {
  console.log("🔗 Testing Hasura GraphQL endpoint...\n");

  const hasuraUrl =
    process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ||
    "https://your-hasura-endpoint.hasura.app/v1/graphql";

  try {
    // Simple introspection query to test connectivity
    const query = {
      query: `
        query {
          __schema {
            types {
              name
            }
          }
        }
      `,
    };

    const response = await fetch(hasuraUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });

    const result = await response.json();

    if (response.ok && result.data) {
      console.log("✅ Hasura GraphQL endpoint is accessible");
      const typeCount = result.data._schema.types.length;
      console.log(`   Schema contains ${typeCount} types`);

      // Check if holidays table exists
      const holidaysType = result.data._schema.types.find(
        t => t.name === "holidays"
      );
      if (holidaysType) {
        console.log("   ✅ holidays table found in schema");
      } else {
        console.log("   ⚠️  holidays table not found in schema");
      }

      return { success: true, accessible: true };
    } else {
      console.log(
        "❌ Hasura endpoint accessible but returned error:",
        result.errors?.[0]?.message || "Unknown error"
      );
      return {
        success: false,
        accessible: true,
        error: result.errors?.[0]?.message,
      };
    }
  } catch (error) {
    console.log("❌ Cannot reach Hasura endpoint:", error.message);
    console.log("   Make sure NEXT_PUBLIC_HASURA_GRAPHQL_URL is set correctly");
    return { success: false, accessible: false, error: error.message };
  }
}

// Test 3: Test API endpoints
async function testAPIEndpoints() {
  console.log("🔄 Testing Holiday Sync API endpoints...\n");

  const endpoints = [
    {
      name: "Manual Sync",
      url: "http://localhost:3000/api/holidays/sync",
      method: "POST",
      description: "User-authenticated holiday sync",
    },
    {
      name: "Cron Sync",
      url: "http://localhost:3000/api/cron/sync-holidays",
      method: "GET",
      description: "Automated cron holiday sync",
    },
  ];

  const results = {};

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, { method: endpoint.method });
      const data = await response.text();

      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch {
        parsedData = { raw: data };
      }

      if (response.ok) {
        console.log(`✅ ${endpoint.name}: SUCCESS`);
        console.log(`   ${parsedData.message || "Sync completed"}`);
      } else if (response.status === 401) {
        console.log(`🔐 ${endpoint.name}: Authentication required (expected)`);
        console.log(`   Status: ${response.status} - ${endpoint.description}`);
      } else {
        console.log(
          `⚠️  ${endpoint.name}: ${response.status} ${response.statusText}`
        );
        if (parsedData.error) {
          console.log(`   Error: ${parsedData.error}`);
        }
        if (parsedData.details) {
          console.log(`   Details: ${parsedData.details.substring(0, 100)}...`);
        }
      }

      results[endpoint.name] = {
        status: response.status,
        success: response.ok,
        data: parsedData,
      };
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Network error - ${error.message}`);
      results[endpoint.name] = { error: error.message };
    }

    console.log(""); // Empty line between tests
  }

  return results;
}

// Test 4: Check environment configuration
async function testEnvironmentConfig() {
  console.log("⚙️  Checking environment configuration...\n");

  const requiredEnvVars = [
    "NEXT_PUBLIC_HASURA_GRAPHQL_URL",
    "HASURA_ADMIN_SECRET",
  ];

  const optionalEnvVars = ["CRON_SECRET"];

  console.log("Required environment variables:");
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const displayValue = varName.includes("SECRET") ? "***hidden***" : value;
      console.log(`   ✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`   ❌ ${varName}: Not set`);
    }
  });

  console.log("\nOptional environment variables:");
  optionalEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ***hidden***`);
    } else {
      console.log(`   ⚠️  ${varName}: Not set (needed for cron auth)`);
    }
  });

  return {
    hasRequiredVars: requiredEnvVars.every(v => process.env[v]),
    hasOptionalVars: optionalEnvVars.every(v => process.env[v]),
  };
}

// Main test runner
async function runSimpleHolidayTests() {
  console.log("================================================");
  console.log("🎯 Holiday Sync Testing - Focused Analysis");
  console.log("================================================\n");

  const results = {};

  try {
    // Run all tests
    results.environment = await testEnvironmentConfig();
    results.externalAPI = await testNagerDateAPI();
    results.hasuraEndpoint = await testHasuraEndpoint();
    results.apiEndpoints = await testAPIEndpoints();

    // Summary
    console.log("📊 TEST SUMMARY");
    console.log("================\n");

    console.log("🌐 External API (Nager.Date):");
    if (results.externalAPI.success) {
      console.log(
        `   ✅ Working - ${results.externalAPI.count} holidays available`
      );
    } else {
      console.log(`   ❌ Failed - ${results.externalAPI.error}`);
    }

    console.log("\n🔗 Hasura GraphQL:");
    if (results.hasuraEndpoint.success) {
      console.log("   ✅ Accessible and working");
    } else if (results.hasuraEndpoint.accessible) {
      console.log("   ⚠️  Accessible but has schema issues");
    } else {
      console.log("   ❌ Not accessible");
    }

    console.log("\n⚙️  Environment:");
    if (results.environment.hasRequiredVars) {
      console.log("   ✅ Required variables set");
    } else {
      console.log("   ❌ Missing required variables");
    }

    console.log("\n🔄 API Endpoints:");
    Object.entries(results.apiEndpoints).forEach(([name, result]) => {
      if (result.success) {
        console.log(`   ✅ ${name}: Working`);
      } else if (result.status === 401) {
        console.log(`   🔐 ${name}: Auth required (normal)`);
      } else {
        console.log(`   ❌ ${name}: Issues detected`);
      }
    });

    console.log("\n🎯 RECOMMENDATIONS:");
    console.log("===================");

    if (results.externalAPI.success) {
      console.log("✅ External API is working - data source is reliable");
    }

    if (!results.hasuraEndpoint.success) {
      console.log("🔧 Fix Hasura connection and schema setup");
    }

    if (!results.environment.hasRequiredVars) {
      console.log("🔧 Set missing environment variables");
    }

    if (results.apiEndpoints["Cron Sync"]?.status === 500) {
      console.log("🔧 Fix GraphQL schema issues in holiday sync service");
    }

    console.log("🔧 Sign in to the app to test manual sync functionality");
  } catch (error) {
    console.error("❌ Test runner error:", error);
  }

  return results;
}

// Run the tests
runSimpleHolidayTests().catch(console.error);
