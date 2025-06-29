#!/usr/bin/env tsx
/**
 * Direct Hasura Payroll Creation Test Script
 * 
 * Tests direct calls to Hasura to validate if a payroll can be created.
 * This script bypasses the UI and tests the core GraphQL operations directly.
 */

import { config } from "dotenv";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import {
  CreatePayrollDocument,
  GetPayrollCyclesDocument,
  GetPayrollDateTypesDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import {
  GetClientByIdDocument,
  GetClientsForDropdownDocument,
} from "@/domains/clients/graphql/generated/graphql";
import {
  GetUsersWithRolesDocument,
} from "@/domains/users/graphql/generated/graphql";

// Load environment variables
config();

interface PayrollCreationTest {
  name: string;
  description: string;
  test: () => Promise<void>;
}

class PayrollCreationValidator {
  private static instance: PayrollCreationValidator;
  
  private constructor() {}
  
  static getInstance(): PayrollCreationValidator {
    if (!PayrollCreationValidator.instance) {
      PayrollCreationValidator.instance = new PayrollCreationValidator();
    }
    return PayrollCreationValidator.instance;
  }

  /**
   * Test basic connectivity to Hasura
   */
  async testConnectivity(): Promise<void> {
    console.log("🔍 Testing Hasura connectivity...");
    
    try {
      const result = await adminApolloClient.query({
        query: GetPayrollCyclesDocument,
        fetchPolicy: "network-only",
      });
      
      const cycles = result.data?.payrollCycles || [];
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
   * Validate required data exists for payroll creation
   */
  async validateRequiredData(): Promise<{
    clients: any[];
    users: any[];
    cycles: any[];
    dateTypes: any[];
  }> {
    console.log("🔍 Validating required data for payroll creation...");
    
    try {
      // Get all required data in parallel
      const [clientsResult, usersResult, cyclesResult, dateTypesResult] = await Promise.all([
        adminApolloClient.query({
          query: GetClientsForDropdownDocument,
          fetchPolicy: "network-only",
        }),
        adminApolloClient.query({
          query: GetUsersWithRolesDocument,
          fetchPolicy: "network-only",
        }),
        adminApolloClient.query({
          query: GetPayrollCyclesDocument,
          fetchPolicy: "network-only",
        }),
        adminApolloClient.query({
          query: GetPayrollDateTypesDocument,
          fetchPolicy: "network-only",
        }),
      ]);

      const clients = clientsResult.data?.clients || [];
      const users = usersResult.data?.users || [];
      const cycles = cyclesResult.data?.payrollCycles || [];
      const dateTypes = dateTypesResult.data?.payrollDateTypes || [];

      console.log(`✅ Data validation complete:`);
      console.log(`   - Clients: ${clients.length}`);
      console.log(`   - Users: ${users.length}`);
      console.log(`   - Cycles: ${cycles.length}`);
      console.log(`   - Date Types: ${dateTypes.length}`);

      if (clients.length === 0) {
        throw new Error("❌ No clients found. Cannot create payroll without a client.");
      }

      if (users.length === 0) {
        throw new Error("❌ No users found. Cannot assign consultants/managers.");
      }

      if (cycles.length === 0) {
        throw new Error("❌ No payroll cycles found. Cannot create payroll without a cycle.");
      }

      return { clients, users, cycles, dateTypes };

    } catch (error) {
      console.error("❌ Data validation failed:", error);
      throw error;
    }
  }

  /**
   * Test client-specific validation
   */
  async validateClientForPayroll(clientId: string): Promise<any> {
    console.log(`🔍 Validating client ${clientId} for payroll creation...`);
    
    try {
      const result = await adminApolloClient.query({
        query: GetClientByIdDocument,
        variables: { id: clientId },
        fetchPolicy: "network-only",
      });

      const client = result.data?.client;
      
      if (!client) {
        throw new Error(`❌ Client ${clientId} not found`);
      }

      if (!client.active) {
        throw new Error(`❌ Client ${client.name} is not active`);
      }

      console.log(`✅ Client ${client.name} is valid for payroll creation`);
      console.log(`   - Active: ${client.active}`);
      console.log(`   - Email: ${client.contactEmail}`);
      console.log(`   - Created: ${client.createdAt}`);

      return client;

    } catch (error) {
      console.error("❌ Client validation failed:", error);
      throw error;
    }
  }

  /**
   * Test user assignment validation
   */
  async validateUserAssignments(primaryConsultantId?: string, backupConsultantId?: string, managerId?: string): Promise<void> {
    console.log("🔍 Validating user assignments...");
    
    try {
      const result = await adminApolloClient.query({
        query: GetUsersWithRolesDocument,
        fetchPolicy: "network-only",
      });

      const users = result.data?.users || [];
      const userMap = new Map(users.map((user: any) => [user.id, user]));

      // Validate primary consultant
      if (primaryConsultantId) {
        const consultant = userMap.get(primaryConsultantId);
        if (!consultant) {
          throw new Error(`❌ Primary consultant ${primaryConsultantId} not found`);
        }
        if (!["consultant", "manager", "org_admin", "developer"].includes(consultant.role)) {
          throw new Error(`❌ Primary consultant ${consultant.name} has invalid role: ${consultant.role}`);
        }
        console.log(`✅ Primary consultant: ${consultant.name} (${consultant.role})`);
      }

      // Validate backup consultant
      if (backupConsultantId) {
        const consultant = userMap.get(backupConsultantId);
        if (!consultant) {
          throw new Error(`❌ Backup consultant ${backupConsultantId} not found`);
        }
        if (!["consultant", "manager", "org_admin", "developer"].includes(consultant.role)) {
          throw new Error(`❌ Backup consultant ${consultant.name} has invalid role: ${consultant.role}`);
        }
        console.log(`✅ Backup consultant: ${consultant.name} (${consultant.role})`);
      }

      // Validate manager
      if (managerId) {
        const manager = userMap.get(managerId);
        if (!manager) {
          throw new Error(`❌ Manager ${managerId} not found`);
        }
        if (!["manager", "org_admin", "developer"].includes(manager.role)) {
          throw new Error(`❌ Manager ${manager.name} has invalid role: ${manager.role}`);
        }
        console.log(`✅ Manager: ${manager.name} (${manager.role})`);
      }

    } catch (error) {
      console.error("❌ User assignment validation failed:", error);
      throw error;
    }
  }

  /**
   * Test actual payroll creation
   */
  async testPayrollCreation(data: {
    clients: any[];
    users: any[];
    cycles: any[];
    dateTypes: any[];
  }): Promise<any> {
    console.log("🔍 Testing actual payroll creation...");
    
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

    // Create test payroll data
    const testPayroll = {
      name: `Test Payroll - ${new Date().toISOString().split('T')[0]}`,
      clientId: data.clients[0].id,
      primaryConsultantUserId: consultants[0].id,
      backupConsultantUserId: consultants.length > 1 ? consultants[1].id : null,
      managerUserId: managers[0].id,
      status: "Draft" as const,
      employeeCount: 10,
      processingTime: 2,
      processingDaysBeforeEft: 3,
      cycleId: data.cycles[0].id,
      dateTypeId: data.dateTypes.length > 0 ? data.dateTypes[0].id : null,
      goLiveDate: new Date().toISOString().split('T')[0],
      payrollSystem: "Test System",
      versionNumber: 1,
      createdByUserId: consultants[0].id, // Use consultant as creator for test
    };

    console.log("📝 Test payroll data:");
    console.log(`   - Name: ${testPayroll.name}`);
    console.log(`   - Client: ${data.clients[0].name}`);
    console.log(`   - Primary Consultant: ${consultants[0].name}`);
    console.log(`   - Manager: ${managers[0].name}`);
    console.log(`   - Cycle: ${data.cycles[0].name}`);

    try {
      // First validate all assignments
      await this.validateUserAssignments(
        testPayroll.primaryConsultantUserId,
        testPayroll.backupConsultantUserId,
        testPayroll.managerUserId
      );

      // Validate client
      await this.validateClientForPayroll(testPayroll.clientId);

      // Attempt to create the payroll
      const result = await adminApolloClient.mutate({
        mutation: CreatePayrollDocument,
        variables: {
          object: testPayroll,
        },
      });

      const createdPayroll = result.data?.insertPayroll;
      
      if (!createdPayroll) {
        throw new Error("❌ Payroll creation returned no data");
      }

      console.log("✅ Payroll created successfully!");
      console.log(`   - ID: ${createdPayroll.id}`);
      console.log(`   - Name: ${createdPayroll.name}`);
      console.log(`   - Status: ${createdPayroll.status}`);

      return createdPayroll;

    } catch (error) {
      console.error("❌ Payroll creation failed:", error);
      
      // Parse GraphQL errors for better diagnostics
      if (error instanceof Error && 'graphQLErrors' in error) {
        const gqlError = error as any;
        if (gqlError.graphQLErrors && gqlError.graphQLErrors.length > 0) {
          console.log("📋 GraphQL Error Details:");
          gqlError.graphQLErrors.forEach((err: any, index: number) => {
            console.log(`   ${index + 1}. ${err.message}`);
            if (err.extensions) {
              console.log(`      Code: ${err.extensions.code}`);
              console.log(`      Path: ${err.path?.join(' -> ')}`);
            }
          });
        }
      }
      
      throw error;
    }
  }

  /**
   * Run comprehensive payroll creation validation
   */
  async runValidation(): Promise<void> {
    console.log("🚀 Starting Payroll Creation Validation\n");
    
    try {
      // Test 1: Connectivity
      await this.testConnectivity();
      console.log("");

      // Test 2: Required Data
      const data = await this.validateRequiredData();
      console.log("");

      // Test 3: Payroll Creation
      const createdPayroll = await this.testPayrollCreation(data);
      console.log("");

      // Summary
      console.log("🎉 All validation tests passed!");
      console.log(`✅ Payroll creation is working correctly.`);
      console.log(`✅ Created test payroll: ${createdPayroll.name} (${createdPayroll.id})`);
      
    } catch (error) {
      console.error("\n💥 Validation failed:");
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const validator = PayrollCreationValidator.getInstance();
  await validator.runValidation();
}

// Export for potential reuse
export { PayrollCreationValidator };

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("💥 Script execution failed:", error);
    process.exit(1);
  });
}