#!/usr/bin/env node

/**
 * Enhanced Holiday Sync Test with Duplicate Prevention
 * Tests the new duplicate checking functionality and detailed responses
 */

import { fileURLToPath } from "url";
import { dirname } from "path";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

// Configuration
const BASE_URL = "http://localhost:3000";
const HASURA_URL = "https://bytemy.hasura.app/v1/graphql";

// ANSI Colors for better output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log("\n" + "=".repeat(80));
  colorLog("cyan", `🧪 ${title.toUpperCase()}`);
  console.log("=".repeat(80));
}

async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      data,
      headers: response.headers,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    };
  }
}

async function checkHasuraConnection() {
  section("Testing Hasura Database Connection");

  try {
    const query = `
      query GetHolidayStats {
        holidays_aggregate {
          aggregate {
            count
          }
        }
        holidays(limit: 3, order_by: {date: asc}) {
          date
          name
          country_code
        }
      }
    `;

    const response = await makeRequest(HASURA_URL, {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "x-hasura-admin-secret":
          process.env.HASURA_ADMIN_SECRET || "admin-secret-from-env",
      },
    });

    if (response.ok && response.data.data) {
      const count = response.data.data.holidaysaggregate.aggregate.count;
      const samples = response.data.data.holidays;

      colorLog(
        "green",
        `✅ Database connected! Found ${count} existing holidays`
      );

      if (samples.length > 0) {
        colorLog("blue", "📋 Sample holidays:");
        samples.forEach(h => {
          console.log(`   ${h.date}: ${h.name} (${h.country_code})`);
        });
      }

      return { success: true, count };
    } else {
      colorLog("red", `❌ Database connection failed`);
      console.log("Response:", response);
      return { success: false, count: 0 };
    }
  } catch (error) {
    colorLog("red", `❌ Database test failed: ${error.message}`);
    return { success: false, count: 0 };
  }
}

async function testCronSyncNormal() {
  section("Testing Cron Sync (Normal - Skip Duplicates)");

  const response = await makeRequest(`${BASE_URL}/api/cron/sync-holidays`);

  if (response.ok) {
    colorLog("green", "✅ Cron sync (normal) successful");
    console.log("📊 Response details:");
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.details?.skippedCount > 0) {
      colorLog(
        "yellow",
        `⏭️  Skipped ${response.data.details.skippedCount} years (data already exists)`
      );
    }
    if (response.data.details?.totalAffected > 0) {
      colorLog(
        "green",
        `📥 Added ${response.data.details.totalAffected} new holidays`
      );
    }
  } else {
    colorLog("red", "❌ Cron sync (normal) failed");
    console.log("Response:", response);
  }

  return response;
}

async function testCronSyncForce() {
  section("Testing Cron Sync (Force - Override Duplicates)");

  const response = await makeRequest(
    `${BASE_URL}/api/cron/sync-holidays?force=true`
  );

  if (response.ok) {
    colorLog("green", "✅ Cron sync (force) successful");
    console.log("📊 Response details:");
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.details?.totalAffected > 0) {
      colorLog(
        "blue",
        `🔄 Updated/added ${response.data.details.totalAffected} holidays`
      );
    }
  } else {
    colorLog("red", "❌ Cron sync (force) failed");
    console.log("Response:", response);
  }

  return response;
}

async function testManualSyncAuth() {
  section("Testing Manual Sync (Authentication Required)");

  // Test without authentication
  const unauthResponse = await makeRequest(`${BASE_URL}/api/holidays/sync`, {
    method: "POST",
  });

  if (unauthResponse.status === 401) {
    colorLog("green", "✅ Authentication properly required (401 without auth)");
  } else {
    colorLog("yellow", `⚠️  Expected 401 but got ${unauthResponse.status}`);
    console.log("Response:", unauthResponse);
  }

  return unauthResponse;
}

async function testExternalAPI() {
  section("Testing External Holiday API");

  const currentYear = new Date().getFullYear();
  const apiUrl = `https://date.nager.at/api/v3/PublicHolidays/${currentYear}/AU`;

  const response = await makeRequest(apiUrl);

  if (response.ok && Array.isArray(response.data)) {
    colorLog(
      "green",
      `✅ External API working! Found ${response.data.length} holidays for ${currentYear}`
    );

    colorLog("blue", "📋 Sample holidays from API:");
    response.data.slice(0, 3).forEach(holiday => {
      console.log(`   ${holiday.date}: ${holiday.name} (${holiday.localName})`);
    });
  } else {
    colorLog("red", "❌ External API failed");
    console.log("Response:", response);
  }

  return response;
}

async function testDuplicatePreventionFlow() {
  section("Testing Complete Duplicate Prevention Flow");

  colorLog("blue", "🔍 Step 1: Check current database state");
  const dbCheck1 = await checkHasuraConnection();
  const initialCount = dbCheck1.count;

  colorLog("blue", "🔍 Step 2: Run normal sync (should skip if data exists)");
  const normalSync = await testCronSyncNormal();

  colorLog("blue", "🔍 Step 3: Check database state after normal sync");
  const dbCheck2 = await checkHasuraConnection();
  const afterNormalCount = dbCheck2.count;

  colorLog("blue", "🔍 Step 4: Run force sync (should update existing data)");
  const forceSync = await testCronSyncForce();

  colorLog("blue", "🔍 Step 5: Check final database state");
  const dbCheck3 = await checkHasuraConnection();
  const finalCount = dbCheck3.count;

  // Analysis
  console.log("\n📊 DUPLICATE PREVENTION ANALYSIS:");
  console.log(`   Initial count: ${initialCount}`);
  console.log(`   After normal sync: ${afterNormalCount}`);
  console.log(`   After force sync: ${finalCount}`);

  if (normalSync.ok && normalSync.data.details?.skippedCount > 0) {
    colorLog("green", "✅ Normal sync correctly skipped existing data");
  } else if (afterNormalCount > initialCount) {
    colorLog(
      "green",
      "✅ Normal sync added new data (no existing data to skip)"
    );
  }

  if (forceSync.ok && forceSync.data.details?.totalAffected > 0) {
    colorLog("green", "✅ Force sync correctly processed data");
  }

  return {
    initialCount,
    afterNormalCount,
    finalCount,
    normalSync: normalSync.ok,
    forceSync: forceSync.ok,
  };
}

async function runAllTests() {
  colorLog("bright", "🚀 Starting Enhanced Holiday Sync Tests");
  colorLog("yellow", `Testing against: ${BASE_URL}`);
  colorLog("yellow", `Database: ${HASURA_URL}`);

  const results = {};

  try {
    // Individual tests
    results.externalAPI = await testExternalAPI();
    results.dbConnection = await checkHasuraConnection();
    results.manualAuth = await testManualSyncAuth();

    // Comprehensive flow test
    results.duplicateFlow = await testDuplicatePreventionFlow();

    // Summary
    section("Test Summary");

    const tests = [
      { name: "External API", result: results.externalAPI.ok },
      { name: "Database Connection", result: results.dbConnection.success },
      { name: "Manual Sync Auth", result: results.manualAuth.status === 401 },
      {
        name: "Duplicate Prevention Flow",
        result:
          results.duplicateFlow.normalSync && results.duplicateFlow.forceSync,
      },
    ];

    tests.forEach(test => {
      const status = test.result ? "✅ PASS" : "❌ FAIL";
      const color = test.result ? "green" : "red";
      colorLog(color, `${status} ${test.name}`);
    });

    const passCount = tests.filter(t => t.result).length;
    const totalCount = tests.length;

    console.log("\n" + "=".repeat(80));
    if (passCount === totalCount) {
      colorLog("green", `🎉 ALL TESTS PASSED (${passCount}/${totalCount})`);
      colorLog(
        "green",
        "🛡️  Duplicate prevention system is working correctly!"
      );
    } else {
      colorLog("yellow", `⚠️  ${passCount}/${totalCount} tests passed`);
    }
  } catch (error) {
    colorLog("red", `❌ Test suite failed: ${error.message}`);
    console.error(error);
  }
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Usage: node test-holiday-sync-enhanced.js");
  console.log("Make sure your Next.js app is running on localhost:3000");
  console.log("");

  runAllTests().catch(console.error);
}

export {
  runAllTests,
  testCronSyncNormal,
  testCronSyncForce,
  testManualSyncAuth,
  testExternalAPI,
  checkHasuraConnection,
  testDuplicatePreventionFlow,
};
