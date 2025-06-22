// test-holiday-sync.js - Holiday Sync Testing Script
const baseUrl = "http://localhost:3000";

// Helper function to make authenticated requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.text();
    let jsonData;

    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = { raw: data };
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: jsonData,
      ok: response.ok,
    };
  } catch (error) {
    return {
      status: 0,
      statusText: "Network Error",
      data: { error: error.message },
      ok: false,
    };
  }
}

// Test 1: Check current holidays in database
async function testGetCurrentHolidays() {
  console.log("\n🔍 Test 1: Fetching current holidays from database...\n");

  const query = `
    query GetHolidays {
      holidays(limit: 10, order_by: {date: asc}) {
        id
        date
        name
        local_name
        country_code
        region
        is_fixed
        is_global
        types
      }
    }
  `;

  const result = await makeRequest(`${baseUrl}/api/graphql`, {
    method: "POST",
    body: JSON.stringify({
      query: query,
    }),
  });

  if (result.ok && result.data.data) {
    const holidays = result.data.data.holidays;
    console.log(`✅ Found ${holidays.length} holidays in database:`);

    holidays.forEach((holiday, index) => {
      console.log(
        `   ${index + 1}. ${holiday.date} - ${holiday.name} (${
          holiday.local_name
        })`
      );
      console.log(
        `      Country: ${holiday.country_code}, Region: ${holiday.region}, Fixed: ${holiday.is_fixed}`
      );
    });

    if (holidays.length === 0) {
      console.log("   📝 No holidays found - database may be empty");
    }
  } else {
    console.log("❌ Failed to fetch holidays:", result.data);
  }

  return result;
}

// Test 2: Test external API directly
async function testExternalHolidayAPI() {
  console.log("\n🌐 Test 2: Testing external holiday API (Nager.Date)...\n");

  const currentYear = new Date().getFullYear();
  const apiUrl = `https://date.nager.at/api/v3/PublicHolidays/${currentYear}/AU`;

  const result = await makeRequest(apiUrl);

  if (result.ok && Array.isArray(result.data)) {
    console.log(
      `✅ External API returned ${result.data.length} Australian holidays for ${currentYear}:`
    );

    result.data.slice(0, 5).forEach((holiday, index) => {
      console.log(
        `   ${index + 1}. ${holiday.date} - ${holiday.name} (${
          holiday.localName
        })`
      );
      console.log(
        `      Counties: ${
          holiday.counties?.join(", ") || "National"
        }, Fixed: ${holiday.fixed}`
      );
    });

    if (result.data.length > 5) {
      console.log(`   ... and ${result.data.length - 5} more holidays`);
    }
  } else {
    console.log("❌ Failed to fetch from external API:", result.data);
  }

  return result;
}

// Test 3: Test manual holiday sync (authenticated)
async function testManualHolidaySync() {
  console.log("\n🔄 Test 3: Testing manual holiday sync endpoint...\n");

  const result = await makeRequest(`${baseUrl}/api/holidays/sync`, {
    method: "POST",
  });

  if (result.ok) {
    console.log("✅ Holiday sync completed successfully:", result.data.message);
  } else if (result.status === 401) {
    console.log(
      "🔐 Holiday sync requires authentication (expected for manual sync)"
    );
    console.log("   This endpoint requires a logged-in user session");
  } else {
    console.log("❌ Holiday sync failed:", result.data);
  }

  return result;
}

// Test 4: Test cron holiday sync (simulated)
async function testCronHolidaySync() {
  console.log("\n⏰ Test 4: Testing cron holiday sync endpoint...\n");

  const result = await makeRequest(`${baseUrl}/api/cron/sync-holidays`);

  if (result.ok) {
    console.log(
      "✅ Cron holiday sync completed successfully:",
      result.data.message
    );
  } else if (result.status === 401) {
    console.log("🔐 Cron holiday sync endpoint is protected (expected)");
    console.log("   This endpoint requires CRON_SECRET authorization");
  } else {
    console.log("❌ Cron holiday sync failed:", result.data);
  }

  return result;
}

// Test 5: Compare before and after sync
async function testSyncEffectiveness() {
  console.log("\n📊 Test 5: Analyzing sync effectiveness...\n");

  // Get holidays count before
  const beforeQuery = `
    query GetHolidaysCount {
      holidays_aggregate {
        aggregate {
          count
        }
      }
      holidays(where: {country_code: {_eq: "AU"}}, limit: 3, order_by: {date: desc}) {
        date
        name
        country_code
      }
    }
  `;

  const beforeResult = await makeRequest(`${baseUrl}/api/graphql`, {
    method: "POST",
    body: JSON.stringify({ query: beforeQuery }),
  });

  if (beforeResult.ok && beforeResult.data.data) {
    const beforeCount =
      beforeResult.data.data.holidaysaggregate.aggregate.count;
    const recentHolidays = beforeResult.data.data.holidays;

    console.log(`📈 Current state:`);
    console.log(`   Total holidays in database: ${beforeCount}`);
    console.log(`   Recent Australian holidays:`);

    recentHolidays.forEach((holiday, index) => {
      console.log(`     ${index + 1}. ${holiday.date} - ${holiday.name}`);
    });

    if (beforeCount === 0) {
      console.log("\n💡 Suggestion: Run holiday sync to populate the database");
      console.log("   You can use: POST /api/holidays/sync (requires auth)");
      console.log("   Or: GET /api/cron/sync-holidays (requires CRON_SECRET)");
    }
  } else {
    console.log("❌ Failed to analyze current state:", beforeResult.data);
  }

  return beforeResult;
}

// Test 6: Validate holiday data structure
async function testHolidayDataStructure() {
  console.log("\n🔍 Test 6: Validating holiday data structure...\n");

  const query = `
    query ValidateHolidayStructure {
      holidays(limit: 1) {
        id
        date
        name
        local_name
        country_code
        region
        is_fixed
        is_global
        launch_year
        types
        created_at
        updated_at
      }
    }
  `;

  const result = await makeRequest(`${baseUrl}/api/graphql`, {
    method: "POST",
    body: JSON.stringify({ query: query }),
  });

  if (result.ok && result.data.data?.holidays?.length > 0) {
    const holiday = result.data.data.holidays[0];
    console.log("✅ Holiday data structure validation:");

    const fields = [
      "id",
      "date",
      "name",
      "local_name",
      "country_code",
      "region",
      "is_fixed",
      "is_global",
      "launch_year",
      "types",
    ];

    fields.forEach(field => {
      const value = holiday[field];
      const status = value !== null && value !== undefined ? "✅" : "❌";
      console.log(`   ${status} ${field}: ${JSON.stringify(value)}`);
    });
  } else {
    console.log("❌ No holidays found for structure validation");
    console.log("   Run holiday sync first to populate data");
  }

  return result;
}

// Main test runner
async function runHolidaySyncTests() {
  console.log("🚀 Starting Holiday Sync Testing Suite...");
  console.log("================================================\n");

  const tests = [
    { name: "Current Holidays", fn: testGetCurrentHolidays },
    { name: "External API", fn: testExternalHolidayAPI },
    { name: "Manual Sync", fn: testManualHolidaySync },
    { name: "Cron Sync", fn: testCronHolidaySync },
    { name: "Sync Analysis", fn: testSyncEffectiveness },
    { name: "Data Structure", fn: testHolidayDataStructure },
  ];

  const results = {};

  for (const test of tests) {
    try {
      results[test.name] = await test.fn();
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    } catch (error) {
      console.log(`❌ Test "${test.name}" failed with error:`, error.message);
      results[test.name] = { error: error.message };
    }
  }

  // Summary
  console.log("\n📋 Test Summary:");
  console.log("================\n");

  Object.entries(results).forEach(([testName, result]) => {
    if (result.error) {
      console.log(`❌ ${testName}: Error - ${result.error}`);
    } else if (result.ok) {
      console.log(`✅ ${testName}: Passed`);
    } else {
      console.log(`⚠️  ${testName}: ${result.status} ${result.statusText}`);
    }
  });

  console.log("\n🎯 Next Steps:");
  console.log("==============");
  console.log(
    "1. 🔐 Sign in to the app to test manual sync: POST /api/holidays/sync"
  );
  console.log(
    "2. ⚙️  Set up CRON_SECRET environment variable for automated sync"
  );
  console.log("3. 📅 Check Vercel cron configuration in vercel.json");
  console.log("4. 🔍 Monitor holiday data in your Hasura console");

  return results;
}

// Run the tests
runHolidaySyncTests().catch(console.error);
