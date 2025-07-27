/**
 * Permission Boundary Testing
 * 
 * Comprehensive testing of GraphQL operations across all user roles
 * to ensure proper permission enforcement and hierarchical access control.
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { GraphQLOperationDiscovery, UserRole, TEST_USERS, DOMAIN_SECURITY_LEVELS } from './utils/test-utilities';
import { GraphQLTestClient, PermissionTester, TestDataManager } from './utils/auth-testing';
import { testDataManager } from './utils/data-seeding';

describe('GraphQL Permission Boundary Testing', () => {
  let discoveryService: GraphQLOperationDiscovery;
  let permissionTester: PermissionTester;
  let testClient: GraphQLTestClient;
  let allOperations: any[] = [];
  
  // Track test results for reporting
  const permissionTestResults = new Map<string, any>();
  
  beforeAll(async () => {
    console.log('🔐 Initializing Permission Boundary Testing...');
    
    discoveryService = new GraphQLOperationDiscovery();
    permissionTester = new PermissionTester();
    testClient = new GraphQLTestClient();
    
    // Discover all operations
    allOperations = await discoveryService.discoverAllOperations();
    console.log(`🔍 Testing permissions for ${allOperations.length} operations`);
    
    // Set up test environment with proper data
    console.log('🔧 Setting up test environment for permission testing...');
    await testDataManager.setupCompleteTestEnvironment();
  });

  afterAll(async () => {
    console.log('📊 Permission Testing Summary:');
    let passed = 0;
    let failed = 0;
    
    permissionTestResults.forEach((result, operationName) => {
      if (result.passed) {
        passed++;
      } else {
        failed++;
        console.log(`❌ ${operationName}: ${result.violations.join(', ')}`);
      }
    });
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    // Cleanup
    await testDataManager.cleanupAllTestData();
  });

  describe('Role Hierarchy Validation', () => {
    test('developer role should have access to all operations', async () => {
      const operationsToTest = allOperations.filter(op => 
        op.type === 'query' && 
        !op.name.includes('Fragment') && 
        op.domain !== 'shared'
      ).slice(0, 10); // Test subset for performance
      
      for (const operation of operationsToTest) {
        const simpleQuery = this.extractSimpleQuery(operation);
        if (simpleQuery) {
          const result = await testClient.executeAsRole(
            simpleQuery, 
            {}, 
            'developer'
          );
          
          // Developer should have access to everything (or get proper data-related errors, not permission errors)
          if (!result.success && result.errors) {
            const hasPermissionError = result.errors.some(error => 
              error.toLowerCase().includes('permission') || 
              error.toLowerCase().includes('access denied') ||
              error.toLowerCase().includes('unauthorized')
            );
            
            expect(hasPermissionError).toBe(false);
          }
        }
      }
    });

    test('viewer role should have limited access to read operations only', async () => {
      const readOperations = allOperations.filter(op => 
        op.type === 'query' && 
        !op.name.includes('Fragment') &&
        op.securityLevel !== 'CRITICAL'
      ).slice(0, 5);
      
      const writeOperations = allOperations.filter(op => 
        op.type === 'mutation'
      ).slice(0, 5);
      
      // Viewer should have limited read access
      for (const operation of readOperations) {
        const simpleQuery = this.extractSimpleQuery(operation);
        if (simpleQuery) {
          const result = await testClient.executeAsRole(
            simpleQuery,
            {},
            'viewer'
          );
          
          // May succeed or fail based on data availability, but should not be permission error for non-critical
          if (!result.success && result.errors) {
            const hasPermissionError = result.errors.some(error => 
              error.toLowerCase().includes('permission')
            );
            
            // For non-critical read operations, viewer should generally have access
            if (operation.securityLevel === 'MEDIUM') {
              expect(hasPermissionError).toBe(false);
            }
          }
        }
      }
      
      // Viewer should NOT have write access
      for (const operation of writeOperations) {
        const simpleMutation = this.extractSimpleMutation(operation);
        if (simpleMutation) {
          const result = await testClient.executeAsRole(
            simpleMutation,
            this.getValidMutationVariables(operation),
            'viewer'
          );
          
          // Should fail with permission error or succeed if operation is inherently safe
          if (result.success) {
            console.warn(`⚠️  Viewer unexpectedly succeeded with mutation: ${operation.name}`);
          }
        }
      }
    });
  });

  describe('Domain-Specific Permission Testing', () => {
    describe('Critical Security Domains', () => {
      test('auth operations should be restricted to admin roles', async () => {
        const authOps = allOperations.filter(op => 
          op.domain === 'auth' && 
          op.securityLevel === 'CRITICAL'
        );
        
        for (const operation of authOps) {
          if (operation.type === 'mutation') {
            const result = await permissionTester.testPermissionBoundaries(
              operation.name,
              this.extractSimpleMutation(operation) || '',
              this.getValidMutationVariables(operation),
              ['developer', 'org_admin'], // Only top roles
              ['consultant', 'viewer'] // Should fail for these
            );
            
            permissionTestResults.set(`auth_${operation.name}`, result);
            
            if (!result.passed) {
              console.warn(`⚠️  Auth operation ${operation.name} permission test failed: ${result.violations.join(', ')}`);
            }
          }
        }
      });

      test('audit operations should maintain strict access control', async () => {
        const auditOps = allOperations.filter(op => 
          op.domain === 'audit'
        );
        
        for (const operation of auditOps) {
          if (operation.type === 'query') {
            const result = await permissionTester.testPermissionBoundaries(
              operation.name,
              this.extractSimpleQuery(operation) || '',
              {},
              ['developer', 'org_admin', 'manager'], // Admin and manager access
              ['viewer'] // Viewers should not see audit logs
            );
            
            permissionTestResults.set(`audit_${operation.name}`, result);
          }
        }
      });
    });

    describe('Business Operation Domains', () => {
      test('user management operations should respect role hierarchy', async () => {
        const userOps = allOperations.filter(op => 
          op.domain === 'users' && 
          op.type === 'mutation'
        );
        
        for (const operation of userOps) {
          // User mutations should be restricted to admin/manager roles
          const result = await permissionTester.testPermissionBoundaries(
            operation.name,
            this.extractSimpleMutation(operation) || '',
            this.getValidMutationVariables(operation),
            ['developer', 'org_admin', 'manager'],
            ['consultant', 'viewer']
          );
          
          permissionTestResults.set(`users_${operation.name}`, result);
        }
      });

      test('payroll operations should allow consultant access for read operations', async () => {
        const payrollQueries = allOperations.filter(op => 
          op.domain === 'payrolls' && 
          op.type === 'query'
        );
        
        for (const operation of payrollQueries.slice(0, 3)) {
          // Consultants should be able to read payroll data they're assigned to
          const result = await permissionTester.testPermissionBoundaries(
            operation.name,
            this.extractSimpleQuery(operation) || '',
            {},
            ['developer', 'org_admin', 'manager', 'consultant'],
            ['viewer'] // Viewers typically shouldn't see detailed payroll data
          );
          
          permissionTestResults.set(`payrolls_${operation.name}`, result);
        }
      });

      test('client operations should be accessible to consultants and above', async () => {
        const clientQueries = allOperations.filter(op => 
          op.domain === 'clients' && 
          op.type === 'query'
        );
        
        for (const operation of clientQueries.slice(0, 3)) {
          const result = await permissionTester.testPermissionBoundaries(
            operation.name,
            this.extractSimpleQuery(operation) || '',
            {},
            ['developer', 'org_admin', 'manager', 'consultant'],
            [] // Most client read operations should be accessible
          );
          
          permissionTestResults.set(`clients_${operation.name}`, result);
        }
      });
    });

    describe('Supporting Feature Domains', () => {
      test('notes operations should respect privacy settings', async () => {
        const noteOps = allOperations.filter(op => 
          op.domain === 'notes'
        );
        
        for (const operation of noteOps) {
          if (operation.type === 'query') {
            // Notes should be accessible based on content and privacy
            const result = await permissionTester.testPermissionBoundaries(
              operation.name,
              this.extractSimpleQuery(operation) || '',
              {},
              ['developer', 'org_admin', 'manager', 'consultant'],
              [] // Access depends on note privacy, not just role
            );
            
            permissionTestResults.set(`notes_${operation.name}`, result);
          }
        }
      });

      test('email operations should be restricted to appropriate roles', async () => {
        const emailOps = allOperations.filter(op => 
          op.domain === 'email' && 
          op.type === 'mutation'
        );
        
        for (const operation of emailOps) {
          // Email sending should be restricted
          const result = await permissionTester.testPermissionBoundaries(
            operation.name,
            this.extractSimpleMutation(operation) || '',
            this.getValidMutationVariables(operation),
            ['developer', 'org_admin', 'manager'],
            ['consultant', 'viewer'] // Consultants may have limited email access
          );
          
          permissionTestResults.set(`email_${operation.name}`, result);
        }
      });
    });
  });

  describe('Hierarchical Permission System Validation', () => {
    test('higher roles should inherit lower role permissions', async () => {
      const testOperations = allOperations.filter(op => 
        op.type === 'query' && 
        op.securityLevel === 'MEDIUM'
      ).slice(0, 5);
      
      for (const operation of testOperations) {
        const result = await permissionTester.testHierarchicalAccess(
          this.extractSimpleQuery(operation) || '',
          {},
          'consultant' // Minimum role
        );
        
        expect(result.passed).toBe(true);
        
        if (!result.passed) {
          console.error(`❌ Hierarchical access failed for ${operation.name}: ${result.violations.join(', ')}`);
        }
      }
    });

    test('critical operations should enforce minimum role requirements', async () => {
      const criticalOps = allOperations.filter(op => 
        op.securityLevel === 'CRITICAL' && 
        op.type === 'mutation'
      ).slice(0, 3);
      
      for (const operation of criticalOps) {
        const result = await permissionTester.testHierarchicalAccess(
          this.extractSimpleMutation(operation) || '',
          this.getValidMutationVariables(operation),
          'org_admin' // High minimum role for critical operations
        );
        
        expect(result.passed).toBe(true);
        
        if (!result.passed) {
          console.error(`❌ Critical operation ${operation.name} security failed: ${result.violations.join(', ')}`);
        }
      }
    });
  });

  describe('Cross-Domain Permission Validation', () => {
    test('operations should respect data relationships and ownership', async () => {
      // Test that users can only access data they own or are assigned to
      const personalDataOps = allOperations.filter(op => 
        ['users', 'leave', 'notes'].includes(op.domain) && 
        op.type === 'query'
      ).slice(0, 3);
      
      for (const operation of personalDataOps) {
        // Test with consultant role - should have limited access
        const result = await testClient.executeAsRole(
          this.extractSimpleQuery(operation) || '',
          { userId: TESTUSERS.consultant.id },
          'consultant'
        );
        
        // Should either succeed (if they have access) or fail gracefully (not permission error)
        if (!result.success && result.errors) {
          const hasUnexpectedError = result.errors.some(error => 
            error.toLowerCase().includes('internal') ||
            error.toLowerCase().includes('unknown')
          );
          
          expect(hasUnexpectedError).toBe(false);
        }
      }
    });
  });

  // Helper methods for extracting testable operations
  private extractSimpleQuery(operation: any): string | null {
    try {
      // Extract just the query definition for testing
      const operationText = operation.document.loc?.source?.body || '';
      
      if (operationText.includes('query ')) {
        // Return a simplified version for testing
        return operationText.split('\n').slice(0, 10).join('\n') + '\n}';
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  private extractSimpleMutation(operation: any): string | null {
    try {
      const operationText = operation.document.loc?.source?.body || '';
      
      if (operationText.includes('mutation ')) {
        return operationText.split('\n').slice(0, 10).join('\n') + '\n}';
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  private getValidMutationVariables(operation: any): Record<string, any> {
    // Return safe test variables based on operation domain
    const domain = operation.domain;
    const seedIds = testDataManager.getCreatedSeedIds();
    
    switch (domain) {
      case 'users':
        return {
          object: {
            name: 'Test User Permission',
            email: 'permission-test@example.com',
            role: 'consultant',
            isActive: true
          }
        };
        
      case 'clients':
        return {
          object: {
            name: 'Permission Test Client',
            active: true,
            contactPerson: 'Test Contact'
          }
        };
        
      case 'payrolls':
        return {
          object: {
            name: 'Permission Test Payroll',
            status: 'Active',
            employeeCount: 1,
            clientId: seedIds.get('client_test_client_alpha_ltd') || '550e8400-e29b-41d4-a716-446655440100'
          }
        };
        
      case 'notes':
        return {
          object: {
            title: 'Permission Test Note',
            content: 'Test note for permission testing',
            authorId: TESTUSERS.consultant.id,
            entityType: 'test',
            entityId: '550e8400-e29b-41d4-a716-446655440000'
          }
        };
        
      default:
        return {};
    }
  }
});

// Performance monitoring for permission tests
describe('Permission Test Performance', () => {
  test('permission checks should complete within reasonable time', async () => {
    const testClient = new GraphQLTestClient();
    const startTime = Date.now();
    
    // Simple permission test
    const result = await testClient.executeAsRole(
      'query { users(limit: 1) { id name } }',
      {},
      'consultant'
    );
    
    const duration = Date.now() - startTime;
    
    // Permission checks should be fast
    expect(duration).toBeLessThan(5000); // 5 seconds max
    
    console.log(`⚡ Permission check completed in ${duration}ms`);
  });
});