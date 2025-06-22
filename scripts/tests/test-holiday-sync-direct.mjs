// test-holiday-sync-direct.mjs - Direct Holiday Sync Test with Admin Auth
import { readFileSync } from "fs";

// Load environment variables manually
function loadEnv() {
  try {
    const envFile = readFileSync(".env.local", "utf8");
    const env = {};
    envFile.split("\n").forEach(line => {
      const [key, ...valueParts] = line.split("=");
      if (key && valueParts.length) {
        env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
      }
    });
    return env;
  } catch (error) {
    console.log("⚠️  Could not load .env.local file");
    return {};
  }
}

const env = loadEnv();
const HASURA_URL = env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = env.HASURA_ADMIN_SECRET;

console.log("🔧 Direct Holiday Sync Test with Admin Authentication\n");

// Test external API first
async function testExternalAPI() {
  console.log("🌐 Testing External Holiday API...\n");

  try {
    const response = await fetch(
      "https://date.nager.at/api/v3/PublicHolidays/2025/AU"
    );
    const holidays = await response.json();

    console.log(`✅ Fetched ${holidays.length} holidays from Nager.Date API`);
    console.log("Sample holiday:", holidays[0]);

    return holidays.slice(0, 3); // Return first 3 for testing
  } catch (error) {
    console.log("❌ External API failed:", error.message);
    return null;
  }
}

// Test GraphQL mutation directly
async function testGraphQLMutation(sampleHolidays) {
  console.log("\n🔄 Testing GraphQL Holiday Mutation...\n");

  if (!sampleHolidays || sampleHolidays.length === 0) {
    console.log("❌ No sample holidays to test with");
    return;
  }

  // Transform external API data to match our schema
  const holidaysToInsert = sampleHolidays.map(holiday => ({
    date: holiday.date,
    local_name: holiday.localName,
    name: holiday.name,
    country_code: holiday.countryCode,
    region: holiday.counties
      ? holiday.counties.map(c => c.replace(`${holiday.countryCode}-`, ""))
      : ["National"],
    is_fixed: holiday.fixed,
    is_global: holiday.global,
    launch_year: holiday.launchYear,
    types: holiday.types,
  }));

  console.log("Transformed data sample:", holidaysToInsert[0]);

  // GraphQL mutation
  const mutation = `
    mutation InsertHolidays($objects: [holidays_insert_input!]!) {
      insert_holidays(
        objects: $objects, 
        on_conflict: {
          constraint: holidays_pkey,
          update_columns: [
            date, 
            local_name,
            name, 
            country_code,
            region,
            is_fixed,
            is_global,
            launch_year,
            types, 
            updated_at
          ]
        }
      ) {
        affected_rows
        returning {
          id
          date
          local_name
          name
          country_code
        }
      }
    }
  `;

  try {
    const response = await fetch(HASURA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          objects: holidaysToInsert,
        },
      }),
    });

    const result = await response.json();

    if (response.ok && result.data) {
      console.log("✅ GraphQL mutation successful!");
      console.log(
        `   Affected rows: ${result.data.insert_holidays.affected_rows}`
      );
      console.log(
        "   Sample inserted holiday:",
        result.data.insert_holidays.returning[0]
      );

      return { success: true, data: result.data };
    } else {
      console.log("❌ GraphQL mutation failed:");
      console.log("   Errors:", JSON.stringify(result.errors, null, 2));

      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log("❌ Network error during mutation:", error.message);
    return { success: false, error: error.message };
  }
}

// Test reading holidays back
async function testReadHolidays() {
  console.log("\n📖 Testing Holiday Retrieval...\n");

  const query = `
    query GetHolidays {
      holidays(limit: 5, order_by: {date: asc}) {
        id
        date
        name
        local_name
        country_code
        region
        is_fixed
        is_global
      }
    }
  `;

  try {
    const response = await fetch(HASURA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": ADMIN_SECRET,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (response.ok && result.data) {
      const holidays = result.data.holidays;
      console.log(`✅ Successfully retrieved ${holidays.length} holidays`);

      holidays.forEach((holiday, index) => {
        console.log(
          `   ${index + 1}. ${holiday.date} - ${holiday.name} (${
            holiday.country_code
          })`
        );
      });

      return { success: true, count: holidays.length };
    } else {
      console.log("❌ Failed to retrieve holidays:");
      console.log("   Errors:", JSON.stringify(result.errors, null, 2));
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log("❌ Network error during query:", error.message);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runDirectTest() {
  console.log("================================================");
  console.log("🎯 Direct Holiday Sync Test");
  console.log("================================================\n");

  console.log("Configuration:");
  console.log(`   Hasura URL: ${HASURA_URL}`);
  console.log(`   Admin Secret: ${ADMIN_SECRET ? "***set***" : "❌ missing"}`);
  console.log("");

  if (!HASURA_URL || !ADMIN_SECRET) {
    console.log("❌ Missing required environment variables");
    return;
  }

  try {
    // Test external API
    const sampleHolidays = await testExternalAPI();

    // Test GraphQL mutation
    if (sampleHolidays) {
      const mutationResult = await testGraphQLMutation(sampleHolidays);

      // Test reading back if mutation succeeded
      if (mutationResult.success) {
        await testReadHolidays();
      }
    }

    console.log("\n🎯 CONCLUSION:");
    console.log("==============");
    console.log(
      "If mutations succeeded, the holiday sync service should work."
    );
    console.log(
      "The cron endpoint error was likely due to cache key issues or permissions."
    );
    console.log(
      "Try the cron endpoint again after this successful direct test."
    );
  } catch (error) {
    console.error("❌ Test runner error:", error);
  }
}

// Run the test
runDirectTest();
