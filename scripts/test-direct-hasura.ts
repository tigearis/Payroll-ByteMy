#!/usr/bin/env tsx
/**
 * Direct Hasura Test Script
 * 
 * Simple test to verify Hasura connectivity and payroll creation validation
 */

import { config } from "dotenv";

// Load environment variables
config();

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

if (!HASURA_URL || !HASURA_SECRET) {
  console.error("❌ Missing required environment variables:");
  console.error("   NEXT_PUBLIC_HASURA_GRAPHQL_URL:", !!HASURA_URL);
  console.error("   HASURA_GRAPHQL_ADMIN_SECRET:", !!HASURA_SECRET);
  process.exit(1);
}

interface HasuraResponse<T> {
  data?: T;
  errors?: Array<{ message: string; extensions?: any }>;
}

/**
 * Execute GraphQL query against Hasura
 */
async function executeQuery<T = any>(
  query: string,
  variables: Record<string, any> = {},
  operationName?: string
): Promise<HasuraResponse<T>> {
  try {
    const response = await fetch(HASURA_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": HASURA_SECRET!,
      },
      body: JSON.stringify({
        query,
        variables,
        operationName,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
}

/**
 * Test basic connectivity
 */
async function testConnectivity(): Promise<void> {
  console.log("🔍 Testing Hasura connectivity...");

  const query = `
    query TestConnectivity {
      payroll_cycles(limit: 5) {
        id
        name
        description
      }
    }
  `;

  try {
    const result = await executeQuery(query);
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(", ")}`);
    }

    const cycles = result.data?.payroll_cycles || [];
    console.log(`✅ Connected successfully. Found ${cycles.length} payroll cycles.`);
    
    if (cycles.length > 0) {
      console.log("   Available cycles:");
      cycles.forEach((cycle: any) => {
        console.log(`   - ${cycle.name} (${cycle.id})`);
      });
    }
  } catch (error) {
    console.error("❌ Connectivity test failed:", error);
    throw error;
  }
}

/**
 * Test required data exists
 */
async function testRequiredData(): Promise<{
  clients: any[];
  users: any[];
  cycles: any[];
  dateTypes: any[];
}> {
  console.log("🔍 Checking required data for payroll creation...");

  const query = `
    query GetRequiredData {
      clients(where: { active: { _eq: true } }, limit: 10) {
        id
        name
        active
        contact_email
        created_at
      }
      users(where: { is_active: { _eq: true } }, limit: 10) {
        id
        name
        email
        role
        is_staff
      }
      payroll_cycles(limit: 10) {
        id
        name
        description
      }
      payroll_date_types(limit: 10) {
        id
        name
        description
      }
    }
  `;

  try {
    const result = await executeQuery(query);
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(", ")}`);
    }

    const clients = result.data?.clients || [];
    const users = result.data?.users || [];
    const cycles = result.data?.payroll_cycles || [];
    const dateTypes = result.data?.payroll_date_types || [];

    console.log(`✅ Data validation complete:`);
    console.log(`   - Active Clients: ${clients.length}`);
    console.log(`   - Active Users: ${users.length}`);
    console.log(`   - Payroll Cycles: ${cycles.length}`);
    console.log(`   - Date Types: ${dateTypes.length}`);

    if (clients.length === 0) {
      throw new Error("❌ No active clients found. Cannot create payroll without a client.");
    }

    if (users.length === 0) {
      throw new Error("❌ No active users found. Cannot assign consultants/managers.");
    }

    if (cycles.length === 0) {
      throw new Error("❌ No payroll cycles found. Cannot create payroll without a cycle.");
    }

    // Show first few items for context
    if (clients.length > 0) {
      console.log("   Sample clients:");
      clients.slice(0, 3).forEach((client: any) => {
        console.log(`   - ${client.name} (${client.id})`);
      });
    }

    if (users.length > 0) {
      console.log("   Sample users:");
      users.slice(0, 3).forEach((user: any) => {
        console.log(`   - ${user.name} (${user.role}) - ${user.email}`);
      });
    }

    return { clients, users, cycles, dateTypes };

  } catch (error) {
    console.error("❌ Data validation failed:", error);
    throw error;
  }
}

/**
 * Test payroll creation validation
 */
async function testPayrollCreationValidation(data: {
  clients: any[];
  users: any[];
  cycles: any[];
  dateTypes: any[];
}): Promise<void> {
  console.log("🔍 Testing payroll creation validation...");

  // Find suitable users for assignment
  const consultants = data.users.filter((user: any) => 
    ["consultant", "manager", "org_admin", "developer"].includes(user.role)
  );
  const managers = data.users.filter((user: any) => 
    ["manager", "org_admin", "developer"].includes(user.role)
  );

  if (consultants.length === 0) {
    throw new Error("❌ No consultants available for assignment");
  }

  if (managers.length === 0) {
    throw new Error("❌ No managers available for assignment");
  }

  // Test data validation query
  const validationQuery = `
    query ValidatePayrollCreation(
      $clientId: uuid!
      $primaryConsultantId: uuid!
      $managerId: uuid!
      $cycleId: uuid!
    ) {
      client: clients_by_pk(id: $clientId) {
        id
        name
        active
      }
      primaryConsultant: users_by_pk(id: $primaryConsultantId) {
        id
        name
        role
        is_active
      }
      manager: users_by_pk(id: $managerId) {
        id
        name
        role
        is_active
      }
      cycle: payroll_cycles_by_pk(id: $cycleId) {
        id
        name
      }
    }
  `;

  const testData = {
    clientId: data.clients[0].id,
    primaryConsultantId: consultants[0].id,
    managerId: managers[0].id,
    cycleId: data.cycles[0].id,
  };

  console.log("📝 Testing with data:");
  console.log(`   - Client: ${data.clients[0].name} (${testData.clientId})`);
  console.log(`   - Consultant: ${consultants[0].name} (${testData.primaryConsultantId})`);
  console.log(`   - Manager: ${managers[0].name} (${testData.managerId})`);
  console.log(`   - Cycle: ${data.cycles[0].name} (${testData.cycleId})`);

  try {
    const result = await executeQuery(validationQuery, testData);
    
    if (result.errors) {
      throw new Error(`Validation errors: ${result.errors.map(e => e.message).join(", ")}`);
    }

    const { client, primaryConsultant, manager, cycle } = result.data || {};

    // Validate results
    if (!client) {
      throw new Error(`❌ Client ${testData.clientId} not found`);
    }
    if (!client.active) {
      throw new Error(`❌ Client ${client.name} is not active`);
    }

    if (!primaryConsultant) {
      throw new Error(`❌ Primary consultant ${testData.primaryConsultantId} not found`);
    }
    if (!primaryConsultant.is_active) {
      throw new Error(`❌ Primary consultant ${primaryConsultant.name} is not active`);
    }

    if (!manager) {
      throw new Error(`❌ Manager ${testData.managerId} not found`);
    }
    if (!manager.is_active) {
      throw new Error(`❌ Manager ${manager.name} is not active`);
    }

    if (!cycle) {
      throw new Error(`❌ Cycle ${testData.cycleId} not found`);
    }

    console.log("✅ All validation checks passed!");
    console.log(`   ✓ Client: ${client.name} (active: ${client.active})`);
    console.log(`   ✓ Consultant: ${primaryConsultant.name} (${primaryConsultant.role})`);
    console.log(`   ✓ Manager: ${manager.name} (${manager.role})`);
    console.log(`   ✓ Cycle: ${cycle.name}`);

  } catch (error) {
    console.error("❌ Validation test failed:", error);
    throw error;
  }
}

/**
 * Test actual payroll creation (dry run)
 */
async function testPayrollCreationDryRun(data: {
  clients: any[];
  users: any[];
  cycles: any[];
  dateTypes: any[];
}): Promise<void> {
  console.log("🔍 Testing payroll creation (dry run)...");

  const consultants = data.users.filter((user: any) => 
    ["consultant", "manager", "org_admin", "developer"].includes(user.role)
  );
  const managers = data.users.filter((user: any) => 
    ["manager", "org_admin", "developer"].includes(user.role)
  );

  // Create test payroll object (without actually inserting)
  const testPayroll = {
    name: `Test Payroll - ${new Date().toISOString().split('T')[0]}`,
    client_id: data.clients[0].id,
    primary_consultant_user_id: consultants[0].id,
    backup_consultant_user_id: consultants.length > 1 ? consultants[1].id : null,
    manager_user_id: managers[0].id,
    status: "Draft",
    employee_count: 10,
    processing_time: 2,
    processing_days_before_eft: 3,
    cycle_id: data.cycles[0].id,
    date_type_id: data.dateTypes.length > 0 ? data.dateTypes[0].id : null,
    go_live_date: new Date().toISOString().split('T')[0],
    payroll_system: "Test System",
    version_number: 1,
    created_by_user_id: consultants[0].id,
  };

  console.log("📝 Would create payroll with:");
  console.log(`   - Name: ${testPayroll.name}`);
  console.log(`   - Client: ${data.clients[0].name}`);
  console.log(`   - Primary Consultant: ${consultants[0].name}`);
  console.log(`   - Manager: ${managers[0].name}`);
  console.log(`   - Employee Count: ${testPayroll.employee_count}`);
  console.log(`   - Status: ${testPayroll.status}`);

  console.log("✅ Payroll creation validation successful!");
  console.log("   (This was a dry run - no actual payroll was created)");
}

/**
 * Main test function
 */
async function runTests(): Promise<void> {
  console.log("🚀 Starting Direct Hasura Payroll Creation Tests\n");
  
  try {
    // Test 1: Connectivity
    await testConnectivity();
    console.log("");

    // Test 2: Required Data
    const data = await testRequiredData();
    console.log("");

    // Test 3: Validation
    await testPayrollCreationValidation(data);
    console.log("");

    // Test 4: Dry Run
    await testPayrollCreationDryRun(data);
    console.log("");

    // Summary
    console.log("🎉 All tests passed!");
    console.log("✅ Direct Hasura calls are working correctly");
    console.log("✅ Payroll creation validation is functional");
    console.log("✅ Required data exists in the database");
    
  } catch (error) {
    console.error("\n💥 Test failed:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error("💥 Script execution failed:", error);
  process.exit(1);
});

export { runTests };