#!/usr/bin/env node

console.log("🔍 Testing direct Hasura connection...");
console.log("Environment check:", {
  hasSecret: !!process.env.HASURA_ADMIN_SECRET,
  secretLength: process.env.HASURA_ADMIN_SECRET?.length || 0,
});

const query = `
query GetHolidayCount {
  holidays_aggregate {
    aggregate {
      count
    }
  }
  holidays(limit: 5, order_by: {date: asc}) {
    date
    name
    country_code
  }
}
`;

try {
  console.log("📡 Making request to Hasura...");

  const response = await fetch("https://bytemy.hasura.app/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret":
        process.env.HASURA_ADMIN_SECRET || "admin-secret-from-env",
    },
    body: JSON.stringify({ query }),
  });

  console.log("📡 Response status:", response.status, response.statusText);

  const data = await response.json();
  console.log("📡 Raw response:", JSON.stringify(data, null, 2));

  if (data.data) {
    const count = data.data.holidays_aggregate.aggregate.count;
    const samples = data.data.holidays;

    console.log(`✅ Database connected! Found ${count} holidays`);
    console.log("📋 Sample holidays:");
    samples.forEach((h) => {
      console.log(`   ${h.date}: ${h.name} (${h.country_code})`);
    });
  } else {
    console.log("❌ No data received");
    if (data.errors) {
      console.log("❌ GraphQL errors:", data.errors);
    }
  }
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("❌ Stack:", error.stack);
}
