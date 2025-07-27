/**
 * Test Data Seeding and Management
 * 
 * Comprehensive test data management that leverages existing test user infrastructure
 * and provides domain-specific test data for GraphQL operation testing.
 */

import { TestDataGenerators, TEST_USERS, UserRole } from './test-utilities';
import { GraphQLTestClient } from './auth-testing';

export interface TestDataSeed {
  id: string;
  type: 'user' | 'client' | 'payroll' | 'note' | 'billing' | 'audit' | 'leave' | 'assignment';
  data: Record<string, any>;
  dependencies?: string[]; // IDs of other seeds this depends on
  domain: string;
}

export interface SeedingResult {
  success: boolean;
  seedId: string;
  createdId?: string;
  errors?: string[];
}

/**
 * Comprehensive Test Data Manager
 */
export class ComprehensiveTestDataManager {
  private client: GraphQLTestClient;
  private createdSeeds: Map<string, string> = new Map(); // seedId -> actualId
  
  constructor() {
    this.client = new GraphQLTestClient();
  }

  /**
   * Set up comprehensive test environment with all necessary data
   */
  async setupCompleteTestEnvironment(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // 1. Set up test users (all roles)
      console.log('🔧 Setting up test users...');
      await this.setupTestUsers();
      
      // 2. Set up test clients
      console.log('🔧 Setting up test clients...');
      await this.setupTestClients();
      
      // 3. Set up payroll cycles and date types
      console.log('🔧 Setting up payroll configuration...');
      await this.setupPayrollConfiguration();
      
      // 4. Set up test payrolls
      console.log('🔧 Setting up test payrolls...');
      await this.setupTestPayrolls();
      
      // 5. Set up billing configuration
      console.log('🔧 Setting up billing data...');
      await this.setupBillingData();
      
      // 6. Set up work schedule positions
      console.log('🔧 Setting up work schedule data...');
      await this.setupWorkScheduleData();
      
      console.log('✅ Test environment setup complete');
      return { success: true, errors };
      
    } catch (error) {
      errors.push(`Failed to setup test environment: ${error.message}`);
      return { success: false, errors };
    }
  }

  /**
   * Set up test users for all roles
   */
  private async setupTestUsers(): Promise<void> {
    for (const [role, userData] of Object.entries(TEST_USERS)) {
      const checkQuery = `
        query CheckTestUser($id: uuid!) {
          users_by_pk(id: $id) {
            id
            name
            email
            role
          }
        }
      `;

      const existing = await this.client.executeAsAdmin(checkQuery, { id: userData.id });
      
      if (!existing.data?.users_by_pk) {
        const createMutation = `
          mutation CreateTestUser($object: users_insert_input!) {
            insert_users_one(object: $object) {
              id
              name
              email
              role
            }
          }
        `;

        const result = await this.client.executeAsAdmin(createMutation, {
          object: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            clerkUserId: userData.clerkUserId,
            isActive: true,
            isStaff: true,
            username: userData.email.split('@')[0],
            image: null,
            managerId: role === 'consultant' ? TEST_USERS.manager.id : null
          }
        });

        if (!result.success) {
          throw new Error(`Failed to create test user ${role}: ${result.errors?.join(', ')}`);
        }
        
        this.createdSeeds.set(`user_${role}`, userData.id);
      }
    }
  }

  /**
   * Set up test clients
   */
  private async setupTestClients(): Promise<void> {
    const testClients = [
      {
        id: '550e8400-e29b-41d4-a716-446655440100',
        name: 'Test Client Alpha Ltd',
        active: true,
        contactPerson: 'Alice Johnson',
        contactEmail: 'alice@testclientalpha.com',
        contactPhone: '+61400000001',
        address: '123 Alpha Street, Sydney NSW 2000',
        abn: '12 345 678 901'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440101',
        name: 'Test Client Beta Pty Ltd',
        active: true,
        contactPerson: 'Bob Smith',
        contactEmail: 'bob@testclientbeta.com',
        contactPhone: '+61400000002',
        address: '456 Beta Avenue, Melbourne VIC 3000',
        abn: '23 456 789 012'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440102',
        name: 'Test Client Gamma Corp',
        active: false, // Inactive client for testing
        contactPerson: 'Charlie Brown',
        contactEmail: 'charlie@testclientgamma.com',
        contactPhone: '+61400000003',
        address: '789 Gamma Road, Brisbane QLD 4000',
        abn: '34 567 890 123'
      }
    ];

    for (const clientData of testClients) {
      const checkQuery = `
        query CheckTestClient($id: uuid!) {
          clients_by_pk(id: $id) { id name }
        }
      `;

      const existing = await this.client.executeAsAdmin(checkQuery, { id: clientData.id });
      
      if (!existing.data?.clients_by_pk) {
        const createMutation = `
          mutation CreateTestClient($object: clients_insert_input!) {
            insert_clients_one(object: $object) {
              id
              name
            }
          }
        `;

        await this.client.executeAsAdmin(createMutation, {
          object: clientData
        });
        
        this.createdSeeds.set(`client_${clientData.name.toLowerCase().replace(/\s+/g, '_')}`, clientData.id);
      }
    }
  }

  /**
   * Set up payroll configuration (cycles and date types)
   */
  private async setupPayrollConfiguration(): Promise<void> {
    // Payroll cycles
    const payrollCycles = [
      { id: '550e8400-e29b-41d4-a716-446655440300', name: 'Weekly', description: 'Weekly payroll cycle' },
      { id: '550e8400-e29b-41d4-a716-446655440301', name: 'Fortnightly', description: 'Fortnightly payroll cycle' },
      { id: '550e8400-e29b-41d4-a716-446655440302', name: 'Monthly', description: 'Monthly payroll cycle' }
    ];

    for (const cycle of payrollCycles) {
      const checkQuery = `
        query CheckPayrollCycle($id: uuid!) {
          payroll_cycles_by_pk(id: $id) { id name }
        }
      `;

      const existing = await this.client.executeAsAdmin(checkQuery, { id: cycle.id });
      
      if (!existing.data?.payroll_cycles_by_pk) {
        const createMutation = `
          mutation CreatePayrollCycle($object: payroll_cycles_insert_input!) {
            insert_payroll_cycles_one(object: $object) {
              id
              name
            }
          }
        `;

        await this.client.executeAsAdmin(createMutation, { object: cycle });
        this.createdSeeds.set(`cycle_${cycle.name.toLowerCase()}`, cycle.id);
      }
    }

    // Payroll date types
    const dateTypes = [
      { id: '550e8400-e29b-41d4-a716-446655440400', name: 'Pay Date', description: 'Employee pay date' },
      { id: '550e8400-e29b-41d4-a716-446655440401', name: 'EFT Date', description: 'Electronic funds transfer date' },
      { id: '550e8400-e29b-41d4-a716-446655440402', name: 'Processing Date', description: 'Payroll processing date' }
    ];

    for (const dateType of dateTypes) {
      const checkQuery = `
        query CheckDateType($id: uuid!) {
          payroll_date_types_by_pk(id: $id) { id name }
        }
      `;

      const existing = await this.client.executeAsAdmin(checkQuery, { id: dateType.id });
      
      if (!existing.data?.payroll_date_types_by_pk) {
        const createMutation = `
          mutation CreateDateType($object: payroll_date_types_insert_input!) {
            insert_payroll_date_types_one(object: $object) {
              id
              name
            }
          }
        `;

        await this.client.executeAsAdmin(createMutation, { object: dateType });
        this.createdSeeds.set(`date_type_${dateType.name.toLowerCase().replace(/\s+/g, '_')}`, dateType.id);
      }
    }
  }

  /**
   * Set up test payrolls
   */
  private async setupTestPayrolls(): Promise<void> {
    const testPayrolls = [
      {
        id: '550e8400-e29b-41d4-a716-446655440200',
        name: 'Alpha Corp Weekly Payroll',
        status: 'Active',
        employeeCount: 25,
        clientId: '550e8400-e29b-41d4-a716-446655440100', // Alpha client
        primaryConsultantId: TEST_USERS.consultant.id,
        backupConsultantId: null,
        managerId: TEST_USERS.manager.id,
        payrollCycleId: '550e8400-e29b-41d4-a716-446655440300' // Weekly
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440201',
        name: 'Beta Pty Fortnightly Payroll',
        status: 'Active',
        employeeCount: 50,
        clientId: '550e8400-e29b-41d4-a716-446655440101', // Beta client
        primaryConsultantId: TEST_USERS.consultant.id,
        backupConsultantId: null,
        managerId: TEST_USERS.manager.id,
        payrollCycleId: '550e8400-e29b-41d4-a716-446655440301' // Fortnightly
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440202',
        name: 'Gamma Corp Monthly Payroll',
        status: 'Inactive',
        employeeCount: 15,
        clientId: '550e8400-e29b-41d4-a716-446655440102', // Gamma client (inactive)
        primaryConsultantId: TEST_USERS.consultant.id,
        backupConsultantId: null,
        managerId: TEST_USERS.manager.id,
        payrollCycleId: '550e8400-e29b-41d4-a716-446655440302' // Monthly
      }
    ];

    for (const payroll of testPayrolls) {
      const checkQuery = `
        query CheckTestPayroll($id: uuid!) {
          payrolls_by_pk(id: $id) { id name }
        }
      `;

      const existing = await this.client.executeAsAdmin(checkQuery, { id: payroll.id });
      
      if (!existing.data?.payrolls_by_pk) {
        const createMutation = `
          mutation CreateTestPayroll($object: payrolls_insert_input!) {
            insert_payrolls_one(object: $object) {
              id
              name
              status
            }
          }
        `;

        await this.client.executeAsAdmin(createMutation, { object: payroll });
        this.createdSeeds.set(`payroll_${payroll.name.toLowerCase().replace(/\s+/g, '_')}`, payroll.id);
      }
    }
  }

  /**
   * Set up billing test data
   */
  private async setupBillingData(): Promise<void> {
    // Create billing plans
    const billingPlans = [
      {
        id: '550e8400-e29b-41d4-a716-446655440500',
        name: 'Standard Payroll Plan',
        description: 'Standard payroll processing plan',
        baseRate: 150.00,
        perEmployeeRate: 5.00,
        active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440501',
        name: 'Premium Payroll Plan',
        description: 'Premium payroll processing with additional services',
        baseRate: 250.00,
        perEmployeeRate: 7.50,
        active: true
      }
    ];

    for (const plan of billingPlans) {
      const checkQuery = `
        query CheckBillingPlan($id: uuid!) {
          billing_plan_by_pk(id: $id) { id name }
        }
      `;

      const existing = await this.client.executeAsAdmin(checkQuery, { id: plan.id });
      
      if (!existing.data?.billing_plan_by_pk) {
        const createMutation = `
          mutation CreateBillingPlan($object: billing_plan_insert_input!) {
            insert_billing_plan_one(object: $object) {
              id
              name
            }
          }
        `;

        await this.client.executeAsAdmin(createMutation, { object: plan });
        this.createdSeeds.set(`billing_plan_${plan.name.toLowerCase().replace(/\s+/g, '_')}`, plan.id);
      }
    }
  }

  /**
   * Set up work schedule test data
   */
  private async setupWorkScheduleData(): Promise<void> {
    // Create positions
    const positions = [
      {
        id: '550e8400-e29b-41d4-a716-446655440600',
        name: 'Senior Payroll Consultant',
        description: 'Senior level payroll consultant',
        requiredSkills: ['payroll_processing', 'client_management', 'ato_compliance'],
        hourlyRate: 85.00
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440601',
        name: 'Payroll Consultant',
        description: 'Standard payroll consultant',
        requiredSkills: ['payroll_processing', 'basic_compliance'],
        hourlyRate: 65.00
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440602',
        name: 'Payroll Administrator',
        description: 'Junior payroll administrator',
        requiredSkills: ['data_entry', 'basic_payroll'],
        hourlyRate: 45.00
      }
    ];

    for (const position of positions) {
      const checkQuery = `
        query CheckPosition($name: String!) {
          positions(where: { name: { _eq: $name } }) { id name }
        }
      `;

      const existing = await this.client.executeAsAdmin(checkQuery, { name: position.name });
      
      if (!existing.data?.positions?.length) {
        const createMutation = `
          mutation CreatePosition($object: positions_insert_input!) {
            insert_positions_one(object: $object) {
              id
              name
            }
          }
        `;

        await this.client.executeAsAdmin(createMutation, { object: position });
        this.createdSeeds.set(`position_${position.name.toLowerCase().replace(/\s+/g, '_')}`, position.id);
      }
    }
  }

  /**
   * Create sample test data for a specific domain
   */
  async createDomainTestData(domain: string): Promise<{ success: boolean; created: string[] }> {
    const created: string[] = [];
    
    switch (domain) {
      case 'notes':
        await this.createTestNotes();
        created.push('test_notes');
        break;
        
      case 'leave':
        await this.createTestLeaveData();
        created.push('test_leave');
        break;
        
      case 'audit':
        await this.createTestAuditData();
        created.push('test_audit');
        break;
        
      case 'email':
        await this.createTestEmailData();
        created.push('test_email');
        break;
        
      default:
        console.warn(`No specific test data setup for domain: ${domain}`);
    }
    
    return { success: true, created };
  }

  /**
   * Create test notes
   */
  private async createTestNotes(): Promise<void> {
    const testNotes = [
      {
        id: '550e8400-e29b-41d4-a716-446655440700',
        title: 'Payroll Processing Note',
        content: 'This is a test note for payroll processing',
        authorId: TEST_USERS.consultant.id,
        entityType: 'payroll',
        entityId: '550e8400-e29b-41d4-a716-446655440200',
        isPrivate: false
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440701',
        title: 'Client Communication',
        content: 'Private note about client communication',
        authorId: TEST_USERS.manager.id,
        entityType: 'client',
        entityId: '550e8400-e29b-41d4-a716-446655440100',
        isPrivate: true
      }
    ];

    for (const note of testNotes) {
      const createMutation = `
        mutation CreateTestNote($object: notes_insert_input!) {
          insert_notes_one(object: $object) {
            id
            title
          }
        }
      `;

      await this.client.executeAsAdmin(createMutation, { object: note });
    }
  }

  /**
   * Create test leave data
   */
  private async createTestLeaveData(): Promise<void> {
    const testLeave = [
      {
        id: '550e8400-e29b-41d4-a716-446655440800',
        userId: TEST_USERS.consultant.id,
        leaveType: 'annual',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalDays: 7,
        status: 'approved',
        reason: 'Annual vacation'
      }
    ];

    for (const leave of testLeave) {
      const createMutation = `
        mutation CreateTestLeave($object: leave_insert_input!) {
          insert_leave_one(object: $object) {
            id
            leaveType
          }
        }
      `;

      await this.client.executeAsAdmin(createMutation, { object: leave });
    }
  }

  /**
   * Create test audit data
   */
  private async createTestAuditData(): Promise<void> {
    const auditEntries = [
      {
        id: '550e8400-e29b-41d4-a716-446655440900',
        userId: TEST_USERS.consultant.id,
        action: 'READ',
        resourceType: 'payroll',
        resourceId: '550e8400-e29b-41d4-a716-446655440200',
        ipAddress: '192.168.1.100',
        userAgent: 'GraphQL Test Suite',
        metadata: { test: true }
      }
    ];

    for (const entry of auditEntries) {
      const createMutation = `
        mutation CreateAuditEntry($object: audit_log_insert_input!) {
          insert_audit_log_one(object: $object) {
            id
            action
          }
        }
      `;

      await this.client.executeAsAdmin(createMutation, { object: entry });
    }
  }

  /**
   * Create test email data
   */
  private async createTestEmailData(): Promise<void> {
    const emailTemplates = [
      {
        id: '550e8400-e29b-41d4-a716-446655441000',
        name: 'Payroll Completion Notification',
        subject: 'Payroll Completed - {{payroll_name}}',
        content: 'Your payroll {{payroll_name}} has been completed successfully.',
        templateType: 'payroll_notification',
        isActive: true,
        createdBy: TEST_USERS.manager.id
      }
    ];

    for (const template of emailTemplates) {
      const createMutation = `
        mutation CreateEmailTemplate($object: email_templates_insert_input!) {
          insert_email_templates_one(object: $object) {
            id
            name
          }
        }
      `;

      await this.client.executeAsAdmin(createMutation, { object: template });
    }
  }

  /**
   * Clean up all test data
   */
  async cleanupAllTestData(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // Clean up in reverse dependency order
      await this.cleanupByTable('notes', 'id');
      await this.cleanupByTable('leave', 'id');
      await this.cleanupByTable('audit_log', 'id');
      await this.cleanupByTable('email_templates', 'id');
      await this.cleanupByTable('payroll_assignments', 'id');
      await this.cleanupByTable('payroll_dates', 'id');
      await this.cleanupByTable('payrolls', 'id');
      await this.cleanupByTable('billing_event_log', 'id');
      await this.cleanupByTable('billing_plan', 'id');
      await this.cleanupByTable('clients', 'id');
      await this.cleanupByTable('payroll_date_types', 'id');
      await this.cleanupByTable('payroll_cycles', 'id');
      await this.cleanupByTable('positions', 'id');
      
      // Deactivate test users instead of deleting
      await this.deactivateTestUsers();
      
      this.createdSeeds.clear();
      
      return { success: true, errors };
    } catch (error) {
      errors.push(`Cleanup failed: ${error.message}`);
      return { success: false, errors };
    }
  }

  /**
   * Generic cleanup by table
   */
  private async cleanupByTable(tableName: string, idField: string): Promise<void> {
    const deleteQuery = `
      mutation CleanupTable($ids: [uuid!]!) {
        delete_${tableName}(where: { ${idField}: { _in: $ids } }) {
          affected_rows
        }
      }
    `;

    const seedIds = Array.from(this.createdSeeds.values());
    if (seedIds.length > 0) {
      await this.client.executeAsAdmin(deleteQuery, { ids: seedIds });
    }
  }

  /**
   * Deactivate test users instead of deleting
   */
  private async deactivateTestUsers(): Promise<void> {
    const userIds = Object.values(TEST_USERS).map(user => user.id);
    
    const deactivateQuery = `
      mutation DeactivateTestUsers($ids: [uuid!]!) {
        update_users(
          where: { id: { _in: $ids } }
          _set: { isActive: false, deactivatedAt: "now()" }
        ) {
          affected_rows
        }
      }
    `;

    await this.client.executeAsAdmin(deactivateQuery, { ids: userIds });
  }

  /**
   * Get created seed IDs for reference in tests
   */
  getCreatedSeedIds(): Map<string, string> {
    return new Map(this.createdSeeds);
  }
}

// Export the test data manager
export const testDataManager = new ComprehensiveTestDataManager();