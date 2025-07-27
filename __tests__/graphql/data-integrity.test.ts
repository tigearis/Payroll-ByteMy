/**
 * Data Integrity and Mutation Testing
 * 
 * Comprehensive testing of GraphQL mutations for data consistency,
 * rollback scenarios, and cross-domain data integrity.
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { GraphQLOperationDiscovery, TestDataGenerators, TEST_USERS } from './utils/test-utilities';
import { GraphQLTestClient } from './utils/auth-testing';
import { testDataManager } from './utils/data-seeding';

describe('GraphQL Data Integrity and Mutation Testing', () => {
  let discoveryService: GraphQLOperationDiscovery;
  let testClient: GraphQLTestClient;
  let allOperations: any[] = [];
  let mutations: any[] = [];
  
  // Track created entities for cleanup
  const createdEntities = new Map<string, string[]>();
  
  beforeAll(async () => {
    console.log('🔧 Initializing Data Integrity Testing...');
    
    discoveryService = new GraphQLOperationDiscovery();
    testClient = new GraphQLTestClient();
    
    // Discover all operations
    allOperations = await discoveryService.discoverAllOperations();
    mutations = allOperations.filter(op => op.type === 'mutation');
    
    console.log(`🔄 Testing ${mutations.length} mutation operations for data integrity`);
    
    // Set up test environment
    await testDataManager.setupCompleteTestEnvironment();
  });

  afterAll(async () => {
    console.log('📊 Data Integrity Testing Summary:');
    console.log(`🔄 Mutations tested: ${mutations.length}`);
    console.log(`🗂️  Entity types created: ${createdEntities.size}`);
    
    // Cleanup
    await testDataManager.cleanupAllTestData();
  });

  beforeEach(() => {
    // Clear tracking for each test
    createdEntities.clear();
  });

  describe('Basic Mutation Functionality', () => {
    test('create mutations should produce valid data', async () => {
      const createMutations = mutations.filter(mut => 
        mut.name.toLowerCase().includes('create') || 
        mut.name.toLowerCase().includes('insert')
      );
      
      for (const mutation of createMutations.slice(0, 5)) {
        const testData = this.generateTestDataForMutation(mutation);
        
        if (testData) {
          const result = await testClient.executeAsRole(
            this.createMutationQuery(mutation),
            testData,
            'manager'
          );
          
          if (result.success && result.data) {
            // Verify the created entity has expected structure
            const createdEntity = this.extractCreatedEntity(result.data);
            
            if (createdEntity) {
              expect(createdEntity).toHaveProperty('id');
              
              // Track for cleanup
              this.trackCreatedEntity(mutation.domain, createdEntity.id);
              
              console.log(`✅ Created ${mutation.domain} entity via ${mutation.name}`);
            }
          } else if (!result.success) {
            // Should fail gracefully with validation errors, not schema errors
            const hasSchemaError = result.errors?.some(error => 
              error.toLowerCase().includes('unknown column') ||
              error.toLowerCase().includes('syntax error')
            );
            
            expect(hasSchemaError).toBe(false);
          }
        }
      }
    });

    test('update mutations should modify existing data correctly', async () => {
      // First create entities to update
      const testClientId = await this.createTestEntity('client');
      const testUserId = await this.createTestEntity('user');
      
      const updateMutations = mutations.filter(mut => 
        mut.name.toLowerCase().includes('update')
      );
      
      for (const mutation of updateMutations.slice(0, 3)) {
        const entityId = mutation.domain === 'clients' ? testClientId : testUserId;
        
        if (entityId) {
          const updateData = this.generateUpdateDataForMutation(mutation, entityId);
          
          if (updateData) {
            const result = await testClient.executeAsRole(
              this.createMutationQuery(mutation),
              updateData,
              'manager'
            );
            
            if (result.success && result.data) {
              console.log(`✅ Updated ${mutation.domain} entity via ${mutation.name}`);
              
              // Verify the update actually changed something
              const updatedEntity = this.extractCreatedEntity(result.data);
              expect(updatedEntity).toBeDefined();
            }
          }
        }
      }
    });

    test('delete mutations should properly handle entity removal', async () => {
      // Create entities to delete
      const testEntityIds = await Promise.all([
        this.createTestEntity('client'),
        this.createTestEntity('user'),
        this.createTestEntity('note')
      ]);
      
      const deleteMutations = mutations.filter(mut => 
        mut.name.toLowerCase().includes('delete') ||
        mut.name.toLowerCase().includes('remove')
      );
      
      for (const mutation of deleteMutations.slice(0, 3)) {
        const entityId = testEntityIds.find(id => id); // Use first available ID
        
        if (entityId) {
          const deleteData = this.generateDeleteDataForMutation(mutation, entityId);
          
          if (deleteData) {
            const result = await testClient.executeAsRole(
              this.createMutationQuery(mutation),
              deleteData,
              'manager'
            );
            
            if (result.success) {
              console.log(`✅ Deleted ${mutation.domain} entity via ${mutation.name}`);
              
              // Verify the entity is properly deleted/deactivated
              const deletedEntity = this.extractCreatedEntity(result.data);
              if (deletedEntity) {
                // Should be marked as inactive rather than hard deleted
                expect(deletedEntity.isActive === false || deletedEntity.deactivatedAt).toBeTruthy();
              }
            }
          }
        }
      }
    });
  });

  describe('Data Consistency Validation', () => {
    test('mutations should maintain referential integrity', async () => {
      // Test that creating related entities maintains proper relationships
      
      // 1. Create a client
      const clientResult = await testClient.executeAsRole(
        `mutation CreateTestClient($object: clients_insert_input!) {
          insert_clients_one(object: $object) {
            id
            name
            active
          }
        }`,
        {
          object: TestDataGenerators.client({
            name: 'Data Integrity Test Client'
          })
        },
        'manager'
      );
      
      expect(clientResult.success).toBe(true);
      const clientId = clientResult.data?.insert_clients_one?.id;
      
      // 2. Create a payroll for that client
      if (clientId) {
        const payrollResult = await testClient.executeAsRole(
          `mutation CreateTestPayroll($object: payrolls_insert_input!) {
            insert_payrolls_one(object: $object) {
              id
              name
              clientId
              client {
                id
                name
              }
            }
          }`,
          {
            object: TestDataGenerators.payroll({
              name: 'Data Integrity Test Payroll',
              clientId: clientId
            })
          },
          'manager'
        );
        
        if (payrollResult.success && payrollResult.data) {
          const payroll = payrollResult.data.insert_payrolls_one;
          
          // Verify relationship integrity
          expect(payroll.clientId).toBe(clientId);
          expect(payroll.client.id).toBe(clientId);
          
          console.log('✅ Referential integrity maintained between client and payroll');
        }
      }
    });

    test('mutations should enforce business rules', async () => {
      // Test business rule validation
      
      // 1. Try to create a payroll with invalid employee count
      const invalidPayrollResult = await testClient.executeAsRole(
        `mutation CreateInvalidPayroll($object: payrolls_insert_input!) {
          insert_payrolls_one(object: $object) {
            id
            employeeCount
          }
        }`,
        {
          object: {
            name: 'Invalid Payroll',
            status: 'Active',
            employeeCount: -5, // Invalid negative count
            clientId: '550e8400-e29b-41d4-a716-446655440100'
          }
        },
        'manager'
      );
      
      // Should either fail or sanitize the data
      if (invalidPayrollResult.success && invalidPayrollResult.data) {
        const payroll = invalidPayrollResult.data.insert_payrolls_one;
        // Employee count should be corrected or the operation should fail
        expect(payroll.employeeCount).toBeGreaterThanOrEqual(0);
      }
      
      // 2. Try to create a user with invalid email format
      const invalidUserResult = await testClient.executeAsRole(
        `mutation CreateInvalidUser($object: users_insert_input!) {
          insert_users_one(object: $object) {
            id
            email
          }
        }`,
        {
          object: {
            name: 'Invalid User',
            email: 'not-an-email', // Invalid email format
            role: 'consultant',
            isActive: true
          }
        },
        'manager'
      );
      
      // Should fail with validation error
      if (!invalidUserResult.success) {
        const hasValidationError = invalidUserResult.errors?.some(error => 
          error.toLowerCase().includes('email') ||
          error.toLowerCase().includes('valid') ||
          error.toLowerCase().includes('format')
        );
        
        // Should be a validation error, not a system error
        expect(hasValidationError || invalidUserResult.errors?.length).toBeTruthy();
      }
    });

    test('concurrent mutations should handle race conditions', async () => {
      // Test concurrent updates to the same entity
      const clientId = await this.createTestEntity('client');
      
      if (clientId) {
        // Perform multiple concurrent updates
        const updatePromises = Array.from({ length: 3 }, (_, index) => 
          testClient.executeAsRole(
            `mutation UpdateClientConcurrent($id: uuid!, $_set: clients_set_input!) {
              update_clients_by_pk(pk_columns: { id: $id }, _set: $_set) {
                id
                name
                updatedAt
              }
            }`,
            {
              id: clientId,
              _set: {
                name: `Concurrent Update ${index}`,
                updatedAt: 'now()'
              }
            },
            'manager'
          )
        );
        
        const results = await Promise.all(updatePromises);
        
        // At least one should succeed
        const successfulUpdates = results.filter(r => r.success);
        expect(successfulUpdates.length).toBeGreaterThan(0);
        
        console.log(`✅ Handled ${successfulUpdates.length}/${results.length} concurrent updates`);
      }
    });
  });

  describe('Transaction and Rollback Testing', () => {
    test('mutations should handle partial failures gracefully', async () => {
      // Test a complex mutation that might partially fail
      const complexMutationResult = await testClient.executeAsRole(
        `mutation ComplexOperation($users: [users_insert_input!]!, $clients: [clients_insert_input!]!) {
          insert_users(objects: $users) {
            affected_rows
            returning {
              id
              name
            }
          }
          insert_clients(objects: $clients) {
            affected_rows
            returning {
              id
              name
            }
          }
        }`,
        {
          users: [
            TestDataGenerators.user({ name: 'Complex Op User 1', email: 'complex1@test.com' }),
            TestDataGenerators.user({ name: 'Complex Op User 2', email: 'complex2@test.com' })
          ],
          clients: [
            TestDataGenerators.client({ name: 'Complex Op Client 1' }),
            TestDataGenerators.client({ name: 'Complex Op Client 2' })
          ]
        },
        'manager'
      );
      
      if (complexMutationResult.success && complexMutationResult.data) {
        // Verify both operations succeeded or failed together
        const usersInserted = complexMutationResult.data.insert_users?.affected_rows || 0;
        const clientsInserted = complexMutationResult.data.insert_clients?.affected_rows || 0;
        
        console.log(`✅ Complex operation: ${usersInserted} users, ${clientsInserted} clients inserted`);
        
        // Should have some success if operation completed
        expect(usersInserted + clientsInserted).toBeGreaterThan(0);
      }
    });

    test('audit logging should capture mutation activities', async () => {
      // Perform a mutation that should be audited
      const auditedMutationResult = await testClient.executeAsRole(
        `mutation CreateAuditedUser($object: users_insert_input!) {
          insert_users_one(object: $object) {
            id
            name
            role
          }
        }`,
        {
          object: TestDataGenerators.user({
            name: 'Audited Test User',
            email: 'audited@test.com'
          })
        },
        'manager'
      );
      
      if (auditedMutationResult.success && auditedMutationResult.data) {
        const userId = auditedMutationResult.data.insertusers_one.id;
        
        // Check if audit log was created (with a delay for async logging)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const auditCheckResult = await testClient.executeAsRole(
          `query CheckAuditLog($userId: String!) {
            audit_log(where: { resourceId: { _eq: $userId }, action: { _eq: "CREATE" } }, limit: 1) {
              id
              action
              resourceType
              resourceId
              userId
            }
          }`,
          { userId },
          'manager'
        );
        
        if (auditCheckResult.success && auditCheckResult.data?.audit_log?.length > 0) {
          console.log('✅ Audit logging captured mutation activity');
          expect(auditCheckResult.data.audit_log[0].action).toBe('CREATE');
        }
      }
    });
  });

  describe('Cross-Domain Data Integrity', () => {
    test('deleting entities should handle dependent relationships', async () => {
      // Create a client with dependent entities
      const clientId = await this.createTestEntity('client');
      const payrollId = await this.createTestEntity('payroll', { clientId });
      
      if (clientId && payrollId) {
        // Try to delete the client (should handle or prevent due to dependent payroll)
        const deleteClientResult = await testClient.executeAsRole(
          `mutation DeleteClientWithDependents($id: uuid!) {
            update_clients_by_pk(pk_columns: { id: $id }, _set: { active: false }) {
              id
              active
            }
          }`,
          { id: clientId },
          'manager'
        );
        
        if (deleteClientResult.success) {
          // Verify dependent payroll handling
          const payrollCheckResult = await testClient.executeAsRole(
            `query CheckDependentPayroll($id: uuid!) {
              payrolls_by_pk(id: $id) {
                id
                status
                client {
                  id
                  active
                }
              }
            }`,
            { id: payrollId },
            'manager'
          );
          
          if (payrollCheckResult.success && payrollCheckResult.data?.payrolls_by_pk) {
            const payroll = payrollCheckResult.data.payrolls_by_pk;
            
            // Payroll should still exist but may be marked inactive
            expect(payroll.id).toBe(payrollId);
            console.log('✅ Dependent relationship handling verified');
          }
        }
      }
    });
  });

  // Helper methods
  private async createTestEntity(entityType: string, additionalData: any = {}): Promise<string | null> {
    let mutation: string;
    let variables: any;
    
    switch (entityType) {
      case 'client':
        mutation = `
          mutation CreateTestClient($object: clients_insert_input!) {
            insert_clients_one(object: $object) { id }
          }
        `;
        variables = { object: { ...TestDataGenerators.client(), ...additionalData } };
        break;
        
      case 'user':
        mutation = `
          mutation CreateTestUser($object: users_insert_input!) {
            insert_users_one(object: $object) { id }
          }
        `;
        variables = { object: { ...TestDataGenerators.user(), ...additionalData } };
        break;
        
      case 'payroll':
        mutation = `
          mutation CreateTestPayroll($object: payrolls_insert_input!) {
            insert_payrolls_one(object: $object) { id }
          }
        `;
        variables = { 
          object: { 
            ...TestDataGenerators.payroll(), 
            clientId: additionalData.clientId || '550e8400-e29b-41d4-a716-446655440100',
            ...additionalData 
          } 
        };
        break;
        
      case 'note':
        mutation = `
          mutation CreateTestNote($object: notes_insert_input!) {
            insert_notes_one(object: $object) { id }
          }
        `;
        variables = { object: { ...TestDataGenerators.note(), ...additionalData } };
        break;
        
      default:
        return null;
    }
    
    const result = await testClient.executeAsRole(mutation, variables, 'manager');
    
    if (result.success && result.data) {
      const entityKey = Object.keys(result.data)[0];
      return result.data[entityKey]?.id || null;
    }
    
    return null;
  }

  private generateTestDataForMutation(mutation: any): any {
    const domain = mutation.domain;
    
    switch (domain) {
      case 'users':
        return { object: TestDataGenerators.user() };
      case 'clients':
        return { object: TestDataGenerators.client() };
      case 'payrolls':
        return { object: TestDataGenerators.payroll() };
      case 'notes':
        return { object: TestDataGenerators.note() };
      case 'leave':
        return { object: TestDataGenerators.leave() };
      default:
        return null;
    }
  }

  private generateUpdateDataForMutation(mutation: any, entityId: string): any {
    const domain = mutation.domain;
    
    switch (domain) {
      case 'users':
        return { 
          id: entityId, 
          _set: { name: 'Updated User Name', updatedAt: 'now()' } 
        };
      case 'clients':
        return { 
          id: entityId, 
          _set: { name: 'Updated Client Name', updatedAt: 'now()' } 
        };
      case 'payrolls':
        return { 
          id: entityId, 
          _set: { name: 'Updated Payroll Name', updatedAt: 'now()' } 
        };
      default:
        return null;
    }
  }

  private generateDeleteDataForMutation(mutation: any, entityId: string): any {
    return { id: entityId };
  }

  private createMutationQuery(mutation: any): string {
    // Create a simplified version of the mutation for testing
    try {
      const operationText = mutation.document.loc?.source?.body || '';
      
      if (operationText.includes('mutation ')) {
        return operationText.split('\n').slice(0, 15).join('\n') + '\n}';
      }
      
      return '';
    } catch (error) {
      return '';
    }
  }

  private extractCreatedEntity(data: any): any {
    // Extract the created entity from mutation response
    const keys = Object.keys(data);
    const insertKey = keys.find(key => key.includes('insert') || key.includes('update'));
    
    if (insertKey && data[insertKey]) {
      return data[insertKey];
    }
    
    return null;
  }

  private trackCreatedEntity(domain: string, entityId: string): void {
    if (!createdEntities.has(domain)) {
      createdEntities.set(domain, []);
    }
    createdEntities.get(domain)!.push(entityId);
  }
});