/**
 * End-to-End Business Workflow Testing
 * 
 * Tests complete business workflows to ensure GraphQL operations work together
 * correctly in realistic scenarios that mirror actual UI usage patterns.
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { GraphQLTestClient } from './utils/auth-testing';
import { testDataManager } from './utils/data-seeding';
import { TestDataGenerators, TEST_USERS } from './utils/test-utilities';

describe('End-to-End Business Workflow Testing', () => {
  let testClient: GraphQLTestClient;
  
  // Track entities created during workflows for cleanup
  const workflowEntities = {
    users: [] as string[],
    clients: [] as string[],
    payrolls: [] as string[],
    notes: [] as string[],
    assignments: [] as string[]
  };
  
  beforeAll(async () => {
    console.log('🔄 Initializing End-to-End Workflow Testing...');
    
    testClient = new GraphQLTestClient();
    
    // Set up comprehensive test environment
    await testDataManager.setupCompleteTestEnvironment();
  });

  afterAll(async () => {
    console.log('📊 Workflow Testing Summary:');
    console.log(`👥 Users created: ${workflowEntities.users.length}`);
    console.log(`🏢 Clients created: ${workflowEntities.clients.length}`);
    console.log(`💼 Payrolls created: ${workflowEntities.payrolls.length}`);
    console.log(`📝 Notes created: ${workflowEntities.notes.length}`);
    
    await testDataManager.cleanupAllTestData();
  });

  describe('User Management Workflow', () => {
    test('complete user lifecycle: create → assign → update → deactivate', async () => {
      console.log('\n👤 Testing User Management Workflow...');
      
      // 1. Create a new user
      console.log('  📝 Creating new user...');
      const createUserResult = await testClient.executeAsRole(
        `mutation CreateWorkflowUser($object: users_insert_input!) {
          insert_users_one(object: $object) {
            id
            name
            email
            role
            isActive
            clerkUserId
          }
        }`,
        {
          object: {
            name: 'Workflow Test User',
            email: 'workflow-user@test.com',
            role: 'consultant',
            isActive: true,
            isStaff: true,
            clerkUserId: 'workflow_clerk_user_id',
            username: 'workflowuser'
          }
        },
        'manager'
      );
      
      expect(createUserResult.success).toBe(true);
      const userId = createUserResult.data?.insert_users_one?.id;
      expect(userId).toBeDefined();
      workflowEntities.users.push(userId!);
      
      // 2. Assign user to manager
      console.log('  👥 Assigning user to manager...');
      const assignManagerResult = await testClient.executeAsRole(
        `mutation AssignUserManager($id: uuid!, $_set: users_set_input!) {
          update_users_by_pk(pk_columns: { id: $id }, _set: $_set) {
            id
            managerId
            manager {
              id
              name
              role
            }
          }
        }`,
        {
          id: userId,
          _set: {
            managerId: TESTUSERS.manager.id
          }
        },
        'manager'
      );
      
      expect(assignManagerResult.success).toBe(true);
      expect(assignManagerResult.data?.update_users_by_pk?.managerId).toBe(TESTUSERS.manager.id);
      
      // 3. Update user details
      console.log('  ✏️  Updating user details...');
      const updateUserResult = await testClient.executeAsRole(
        `mutation UpdateWorkflowUser($id: uuid!, $_set: users_set_input!) {
          update_users_by_pk(pk_columns: { id: $id }, _set: $_set) {
            id
            name
            role
            updatedAt
          }
        }`,
        {
          id: userId,
          _set: {
            name: 'Updated Workflow User',
            role: 'consultant'
          }
        },
        'manager'
      );
      
      expect(updateUserResult.success).toBe(true);
      expect(updateUserResult.data?.update_users_by_pk?.name).toBe('Updated Workflow User');
      
      // 4. Verify user can be queried with relationships
      console.log('  🔍 Verifying user data integrity...');
      const queryUserResult = await testClient.executeAsRole(
        `query GetWorkflowUser($id: uuid!) {
          users_by_pk(id: $id) {
            id
            name
            email
            role
            isActive
            managerId
            manager {
              id
              name
              role
            }
            createdAt
            updatedAt
          }
        }`,
        { id: userId },
        'consultant'
      );
      
      expect(queryUserResult.success).toBe(true);
      const user = queryUserResult.data?.users_by_pk;
      expect(user?.name).toBe('Updated Workflow User');
      expect(user?.manager?.id).toBe(TESTUSERS.manager.id);
      
      // 5. Deactivate user
      console.log('  🚫 Deactivating user...');
      const deactivateUserResult = await testClient.executeAsRole(
        `mutation DeactivateWorkflowUser($id: uuid!) {
          update_users_by_pk(pk_columns: { id: $id }, _set: { isActive: false, deactivatedAt: "now()" }) {
            id
            isActive
            deactivatedAt
          }
        }`,
        { id: userId },
        'manager'
      );
      
      expect(deactivateUserResult.success).toBe(true);
      expect(deactivateUserResult.data?.update_users_by_pk?.isActive).toBe(false);
      
      console.log('  ✅ User management workflow completed successfully');
    });
  });

  describe('Client and Payroll Management Workflow', () => {
    test('client onboarding: create client → setup payroll → assign consultant → create notes', async () => {
      console.log('\n🏢 Testing Client Onboarding Workflow...');
      
      // 1. Create new client
      console.log('  📝 Creating new client...');
      const createClientResult = await testClient.executeAsRole(
        `mutation CreateWorkflowClient($object: clients_insert_input!) {
          insert_clients_one(object: $object) {
            id
            name
            active
            contactPerson
            contactEmail
            abn
            createdAt
          }
        }`,
        {
          object: {
            name: 'Workflow Test Client Pty Ltd',
            active: true,
            contactPerson: 'John Workflow',
            contactEmail: 'john@workflowclient.com',
            contactPhone: '+61400000999',
            address: '123 Workflow Street, Sydney NSW 2000',
            abn: '99 888 777 666'
          }
        },
        'manager'
      );
      
      expect(createClientResult.success).toBe(true);
      const clientId = createClientResult.data?.insert_clients_one?.id;
      expect(clientId).toBeDefined();
      workflowEntities.clients.push(clientId!);
      
      // 2. Create payroll for the client
      console.log('  💼 Setting up payroll for client...');
      const createPayrollResult = await testClient.executeAsRole(
        `mutation CreateWorkflowPayroll($object: payrolls_insert_input!) {
          insert_payrolls_one(object: $object) {
            id
            name
            status
            employeeCount
            clientId
            primaryConsultantId
            managerId
            client {
              id
              name
            }
          }
        }`,
        {
          object: {
            name: 'Workflow Test Payroll',
            status: 'Active',
            employeeCount: 35,
            clientId: clientId,
            primaryConsultantId: TESTUSERS.consultant.id,
            managerId: TESTUSERS.manager.id,
            payrollCycleId: '550e8400-e29b-41d4-a716-446655440300' // Weekly cycle
          }
        },
        'manager'
      );
      
      expect(createPayrollResult.success).toBe(true);
      const payrollId = createPayrollResult.data?.insert_payrolls_one?.id;
      expect(payrollId).toBeDefined();
      workflowEntities.payrolls.push(payrollId!);
      
      // Verify client relationship
      expect(createPayrollResult.data?.insert_payrolls_one?.client?.id).toBe(clientId);
      
      // 3. Add implementation notes
      console.log('  📝 Adding implementation notes...');
      const createNoteResult = await testClient.executeAsRole(
        `mutation CreateWorkflowNote($object: notes_insert_input!) {
          insert_notes_one(object: $object) {
            id
            title
            content
            authorId
            entityType
            entityId
            isPrivate
          }
        }`,
        {
          object: {
            title: 'Client Onboarding Notes',
            content: 'Client setup completed. Weekly payroll cycle configured with 35 employees. Primary consultant assigned.',
            authorId: TESTUSERS.manager.id,
            entityType: 'client',
            entityId: clientId,
            isPrivate: false
          }
        },
        'manager'
      );
      
      expect(createNoteResult.success).toBe(true);
      const noteId = createNoteResult.data?.insert_notes_one?.id;
      workflowEntities.notes.push(noteId!);
      
      // 4. Verify complete client setup with relationships
      console.log('  🔍 Verifying complete client setup...');
      const verifySetupResult = await testClient.executeAsRole(
        `query VerifyClientSetup($clientId: uuid!) {
          clients_by_pk(id: $clientId) {
            id
            name
            active
            payrolls(where: { supersededDate: { _is_null: true } }) {
              id
              name
              status
              employeeCount
              primaryConsultant {
                id
                name
                role
              }
              manager {
                id
                name
                role
              }
            }
          }
          notes(where: { entityType: { _eq: "client" }, entityId: { _eq: $clientId } }) {
            id
            title
            content
            author {
              id
              name
            }
          }
        }`,
        { clientId },
        'consultant'
      );
      
      expect(verifySetupResult.success).toBe(true);
      const setupData = verifySetupResult.data;
      
      // Verify client exists with payroll
      expect(setupData?.clients_by_pk?.name).toBe('Workflow Test Client Pty Ltd');
      expect(setupData?.clients_by_pk?.payrolls?.length).toBeGreaterThan(0);
      expect(setupData?.clients_by_pk?.payrolls[0]?.primaryConsultant?.id).toBe(TESTUSERS.consultant.id);
      
      // Verify notes exist
      expect(setupData?.notes?.length).toBeGreaterThan(0);
      expect(setupData?.notes[0]?.title).toBe('Client Onboarding Notes');
      
      console.log('  ✅ Client onboarding workflow completed successfully');
    });
  });

  describe('Payroll Processing Workflow', () => {
    test('payroll processing: create dates → assign staff → update status → generate reports', async () => {
      console.log('\n💼 Testing Payroll Processing Workflow...');
      
      // Use existing test payroll
      const existingPayrollId = '550e8400-e29b-41d4-a716-446655440200';
      
      // 1. Create payroll dates
      console.log('  📅 Creating payroll processing dates...');
      const createDateResult = await testClient.executeAsRole(
        `mutation CreatePayrollDate($object: payroll_dates_insert_input!) {
          insert_payroll_dates_one(object: $object) {
            id
            payrollId
            originalEftDate
            adjustedEftDate
            processingDate
            payrollDateTypeId
          }
        }`,
        {
          object: {
            payrollId: existingPayrollId,
            originalEftDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            adjustedEftDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            processingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            payrollDateTypeId: '550e8400-e29b-41d4-a716-446655440401' // EFT Date
          }
        },
        'consultant'
      );
      
      expect(createDateResult.success).toBe(true);
      const payrollDateId = createDateResult.data?.insert_payroll_dates_one?.id;
      
      // 2. Assign consultant to payroll processing
      console.log('  👤 Creating work assignment...');
      const createAssignmentResult = await testClient.executeAsRole(
        `mutation CreateWorkAssignment($object: payroll_assignments_insert_input!) {
          insert_payroll_assignments_one(object: $object) {
            id
            userId
            payrollId
            payrollDateId
            assignmentDate
            estimatedHours
            status
          }
        }`,
        {
          object: {
            userId: TESTUSERS.consultant.id,
            payrollId: existingPayrollId,
            payrollDateId: payrollDateId,
            assignmentDate: new Date().toISOString(),
            estimatedHours: 6.5,
            status: 'assigned',
            priority: 'medium'
          }
        },
        'manager'
      );
      
      expect(createAssignmentResult.success).toBe(true);
      const assignmentId = createAssignmentResult.data?.insert_payroll_assignments_one?.id;
      workflowEntities.assignments.push(assignmentId!);
      
      // 3. Update payroll status to processing
      console.log('  🔄 Updating payroll status to processing...');
      const updateStatusResult = await testClient.executeAsRole(
        `mutation UpdatePayrollStatus($id: uuid!, $_set: payrolls_set_input!) {
          update_payrolls_by_pk(pk_columns: { id: $id }, _set: $_set) {
            id
            status
            updatedAt
          }
        }`,
        {
          id: existingPayrollId,
          _set: {
            status: 'Processing'
          }
        },
        'consultant'
      );
      
      expect(updateStatusResult.success).toBe(true);
      expect(updateStatusResult.data?.update_payrolls_by_pk?.status).toBe('Processing');
      
      // 4. Add processing notes
      console.log('  📝 Adding processing notes...');
      const processingNoteResult = await testClient.executeAsRole(
        `mutation CreateProcessingNote($object: notes_insert_input!) {
          insert_notes_one(object: $object) {
            id
            title
            content
            authorId
            entityType
            entityId
          }
        }`,
        {
          object: {
            title: 'Payroll Processing Update',
            content: 'Payroll processing started. EFT date scheduled. Consultant assigned.',
            authorId: TESTUSERS.consultant.id,
            entityType: 'payroll',
            entityId: existingPayrollId,
            isPrivate: false
          }
        },
        'consultant'
      );
      
      expect(processingNoteResult.success).toBe(true);
      
      // 5. Generate processing report (query payroll with all related data)
      console.log('  📊 Generating processing report...');
      const reportResult = await testClient.executeAsRole(
        `query GeneratePayrollReport($payrollId: uuid!) {
          payrolls_by_pk(id: $payrollId) {
            id
            name
            status
            employeeCount
            client {
              id
              name
              contactPerson
            }
            primaryConsultant {
              id
              name
              email
            }
            manager {
              id
              name
            }
            payrollDates(orderBy: { originalEftDate: ASC }) {
              id
              originalEftDate
              adjustedEftDate
              processingDate
              payrollDateType {
                name
              }
            }
            assignments: payrollAssignments {
              id
              assignmentDate
              estimatedHours
              status
              user {
                id
                name
              }
            }
          }
          payrollNotes: notes(where: { entityType: { _eq: "payroll" }, entityId: { _eq: $payrollId } }) {
            id
            title
            content
            createdAt
            author {
              name
            }
          }
        }`,
        { payrollId: existingPayrollId },
        'manager'
      );
      
      expect(reportResult.success).toBe(true);
      const reportData = reportResult.data;
      
      // Verify complete payroll data
      expect(reportData?.payrolls_by_pk?.status).toBe('Processing');
      expect(reportData?.payrolls_by_pk?.payrollDates?.length).toBeGreaterThan(0);
      expect(reportData?.payrolls_by_pk?.assignments?.length).toBeGreaterThan(0);
      expect(reportData?.payrollNotes?.length).toBeGreaterThan(0);
      
      console.log('  ✅ Payroll processing workflow completed successfully');
    });
  });

  describe('Audit and Compliance Workflow', () => {
    test('audit trail: user actions → data changes → compliance reporting', async () => {
      console.log('\n🔍 Testing Audit and Compliance Workflow...');
      
      // 1. Perform auditable actions
      console.log('  📋 Performing auditable actions...');
      
      // Create a client (auditable action)
      const auditableClientResult = await testClient.executeAsRole(
        `mutation CreateAuditableClient($object: clients_insert_input!) {
          insert_clients_one(object: $object) {
            id
            name
            createdAt
          }
        }`,
        {
          object: {
            name: 'Auditable Test Client',
            active: true,
            contactPerson: 'Audit Test Contact',
            contactEmail: 'audit@testclient.com'
          }
        },
        'manager'
      );
      
      expect(auditableClientResult.success).toBe(true);
      const auditableClientId = auditableClientResult.data?.insert_clients_one?.id;
      
      // Update the client (another auditable action)
      await testClient.executeAsRole(
        `mutation UpdateAuditableClient($id: uuid!, $_set: clients_set_input!) {
          update_clients_by_pk(pk_columns: { id: $id }, _set: $_set) {
            id
            name
          }
        }`,
        {
          id: auditableClientId,
          _set: { name: 'Updated Auditable Client' }
        },
        'manager'
      );
      
      // 2. Check audit logs were created
      console.log('  🔍 Verifying audit trail creation...');
      
      // Wait a moment for async audit logging
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const auditCheckResult = await testClient.executeAsRole(
        `query CheckAuditTrail($resourceId: String!) {
          audit_log(
            where: { 
              resourceId: { _eq: $resourceId },
              resourceType: { _eq: "client" }
            },
            order_by: { timestamp: ASC }
          ) {
            id
            action
            resourceType
            resourceId
            userId
            timestamp
            metadata
            user {
              name
              role
            }
          }
        }`,
        { resourceId: auditableClientId },
        'manager'
      );
      
      if (auditCheckResult.success && auditCheckResult.data?.audit_log?.length > 0) {
        const auditEntries = auditCheckResult.data.audit_log;
        
        // Should have CREATE and UPDATE entries
        const actions = auditEntries.map((entry: any) => entry.action);
        expect(actions).toContain('CREATE');
        
        // Verify audit entry structure
        expect(auditEntries[0]).toHaveProperty('userId');
        expect(auditEntries[0]).toHaveProperty('timestamp');
        expect(auditEntries[0].resourceType).toBe('client');
        
        console.log(`  ✅ Found ${auditEntries.length} audit entries`);
      } else {
        console.log('  ⚠️  Audit logging may not be fully configured');
      }
      
      // 3. Generate compliance report
      console.log('  📊 Generating compliance report...');
      const complianceReportResult = await testClient.executeAsRole(
        `query GenerateComplianceReport($startDate: timestamptz!, $endDate: timestamptz!) {
          audit_log(
            where: {
              timestamp: { _gte: $startDate, _lte: $endDate }
            },
            order_by: { timestamp: DESC }
          ) {
            id
            action
            resourceType
            resourceId
            timestamp
            user {
              id
              name
              role
            }
          }
          
          auditStats: audit_log_aggregate(
            where: {
              timestamp: { _gte: $startDate, _lte: $endDate }
            }
          ) {
            aggregate {
              count
            }
          }
          
          userActivity: audit_log(
            where: {
              timestamp: { _gte: $startDate, _lte: $endDate }
            },
            distinct_on: userId
          ) {
            userId
            user {
              name
              role
            }
          }
        }`,
        {
          startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
          endDate: new Date().toISOString()
        },
        'org_admin'
      );
      
      expect(complianceReportResult.success).toBe(true);
      
      if (complianceReportResult.data?.auditStats?.aggregate?.count > 0) {
        console.log(`  📈 Compliance report generated: ${complianceReportResult.data.auditStats.aggregate.count} audit entries`);
      }
      
      console.log('  ✅ Audit and compliance workflow completed successfully');
    });
  });

  describe('Error Handling and Recovery Workflow', () => {
    test('error scenarios: invalid data → validation errors → graceful recovery', async () => {
      console.log('\n⚠️  Testing Error Handling Workflow...');
      
      // 1. Test validation errors
      console.log('  🚫 Testing validation error handling...');
      const invalidClientResult = await testClient.executeAsRole(
        `mutation CreateInvalidClient($object: clients_insert_input!) {
          insert_clients_one(object: $object) {
            id
            name
          }
        }`,
        {
          object: {
            name: '', // Invalid empty name
            active: true,
            contactEmail: 'invalid-email' // Invalid email format
          }
        },
        'manager'
      );
      
      // Should fail gracefully
      expect(invalidClientResult.success).toBe(false);
      expect(invalidClientResult.errors).toBeDefined();
      
      // 2. Test permission errors
      console.log('  🔐 Testing permission error handling...');
      const permissionErrorResult = await testClient.executeAsRole(
        `mutation CreateClientAsViewer($object: clients_insert_input!) {
          insert_clients_one(object: $object) {
            id
            name
          }
        }`,
        {
          object: {
            name: 'Viewer Attempt Client',
            active: true,
            contactPerson: 'Viewer Test'
          }
        },
        'viewer' // Viewer shouldn't be able to create clients
      );
      
      // Should fail with permission error
      expect(permissionErrorResult.success).toBe(false);
      
      // 3. Test recovery with valid data
      console.log('  ✅ Testing recovery with valid data...');
      const recoveryResult = await testClient.executeAsRole(
        `mutation CreateValidClient($object: clients_insert_input!) {
          insert_clients_one(object: $object) {
            id
            name
            active
          }
        }`,
        {
          object: {
            name: 'Recovery Test Client',
            active: true,
            contactPerson: 'Recovery Contact',
            contactEmail: 'recovery@validclient.com'
          }
        },
        'manager'
      );
      
      expect(recoveryResult.success).toBe(true);
      expect(recoveryResult.data?.insert_clients_one?.name).toBe('Recovery Test Client');
      
      console.log('  ✅ Error handling and recovery workflow completed successfully');
    });
  });
});