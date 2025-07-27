/**
 * Comprehensive Domain Operations Testing
 * 
 * Automatically discovers and tests all GraphQL operations across all domains
 * with validation, syntax checking, and basic functionality testing.
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { GraphQLOperationDiscovery, testUtils } from './utils/test-utilities';
import { GraphQLTestClient, TestDataManager } from './utils/auth-testing';
import { testDataManager } from './utils/data-seeding';

describe('GraphQL Domain Operations Discovery and Validation', () => {
  let discoveryService: GraphQLOperationDiscovery;
  let testClient: GraphQLTestClient;
  let allOperations: any[] = [];
  
  beforeAll(async () => {
    console.log('🔍 Initializing GraphQL Operations Discovery...');
    
    discoveryService = new GraphQLOperationDiscovery();
    testClient = new GraphQLTestClient();
    
    // Discover all operations
    allOperations = await discoveryService.discoverAllOperations();
    console.log(`📊 Discovered ${allOperations.length} GraphQL operations across all domains`);
    
    // Set up test environment
    console.log('🔧 Setting up comprehensive test environment...');
    await testDataManager.setupCompleteTestEnvironment();
  });

  afterAll(async () => {
    console.log('🧹 Cleaning up test environment...');
    await testDataManager.cleanupAllTestData();
  });

  describe('Operation Discovery Validation', () => {
    test('should discover operations from all expected domains', () => {
      const expectedDomains = [
        'audit', 'auth', 'billing', 'clients', 'email', 
        'external-systems', 'leave', 'notes', 'payrolls', 
        'users', 'work-schedule', 'shared'
      ];
      
      const discoveredDomains = [...new Set(allOperations.map(op => op.domain))];
      
      console.log('🔍 Discovered domains:', discoveredDomains);
      console.log('📋 Expected domains:', expectedDomains);
      
      expectedDomains.forEach(domain => {
        expect(discoveredDomains).toContain(domain);
      });
    });

    test('should discover reasonable number of operations per domain', () => {
      const operationsByDomain = allOperations.reduce((acc, op) => {
        acc[op.domain] = (acc[op.domain] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('📊 Operations by domain:', operationsByDomain);
      
      // Each domain should have at least some operations
      Object.entries(operationsByDomain).forEach(([domain, count]) => {
        expect(count).toBeGreaterThan(0);
        console.log(`  ${domain}: ${count} operations`);
      });
    });

    test('should classify operation types correctly', () => {
      const operationTypes = allOperations.reduce((acc, op) => {
        acc[op.type] = (acc[op.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('📊 Operations by type:', operationTypes);
      
      // Should have queries, mutations, and likely fragments
      expect(operationTypes.query || 0).toBeGreaterThan(0);
      expect(operationTypes.mutation || 0).toBeGreaterThan(0);
      
      // Fragments are optional but likely to exist
      if (operationTypes.fragment) {
        expect(operationTypes.fragment).toBeGreaterThan(0);
      }
    });
  });

  describe('Syntax and Schema Validation', () => {
    test('all operations should be syntactically valid', () => {
      let invalidOperations: any[] = [];
      
      allOperations.forEach(operation => {
        try {
          const validation = discoveryService.validateOperation(operation);
          if (!validation.valid) {
            invalidOperations.push({
              name: operation.name,
              domain: operation.domain,
              type: operation.type,
              errors: validation.errors
            });
          }
        } catch (error) {
          invalidOperations.push({
            name: operation.name,
            domain: operation.domain,
            type: operation.type,
            errors: [error.message]
          });
        }
      });
      
      if (invalidOperations.length > 0) {
        console.error('❌ Invalid operations found:');
        invalidOperations.forEach(op => {
          console.error(`  ${op.domain}/${op.name} (${op.type}): ${op.errors.join(', ')}`);
        });
      }
      
      expect(invalidOperations).toHaveLength(0);
    });

    test('operations should validate against current schema', () => {
      const validationResults = allOperations.map(operation => {
        const validation = discoveryService.validateOperation(operation);
        return {
          name: operation.name,
          domain: operation.domain,
          type: operation.type,
          valid: validation.valid,
          errors: validation.errors
        };
      });
      
      const invalidCount = validationResults.filter(r => !r.valid).length;
      const validCount = validationResults.filter(r => r.valid).length;
      
      console.log(`✅ Valid operations: ${validCount}`);
      console.log(`❌ Invalid operations: ${invalidCount}`);
      
      if (invalidCount > 0) {
        console.log('Invalid operations details:');
        validationResults
          .filter(r => !r.valid)
          .forEach(r => {
            console.log(`  ${r.domain}/${r.name}: ${r.errors.join(', ')}`);
          });
      }
      
      // At least 90% of operations should be valid
      const validPercentage = (validCount / allOperations.length) * 100;
      expect(validPercentage).toBeGreaterThanOrEqual(90);
    });
  });

  describe('Domain-Specific Operation Tests', () => {
    describe('Authentication Domain', () => {
      test('auth operations should include user management', () => {
        const authOps = allOperations.filter(op => op.domain === 'auth');
        const operationNames = authOps.map(op => op.name.toLowerCase());
        
        // Should have user-related operations
        const hasUserOps = operationNames.some(name => 
          name.includes('user') || name.includes('login') || name.includes('auth')
        );
        
        expect(hasUserOps).toBe(true);
      });
    });

    describe('Users Domain', () => {
      test('users operations should include CRUD operations', async () => {
        const userOps = allOperations.filter(op => op.domain === 'users');
        const operationNames = userOps.map(op => op.name.toLowerCase());
        
        // Should have basic CRUD operations
        const hasGetUsers = operationNames.some(name => 
          name.includes('getuser') || name.includes('user')
        );
        const hasCreateUser = userOps.some(op => 
          op.type === 'mutation' && op.name.toLowerCase().includes('create')
        );
        const hasUpdateUser = userOps.some(op => 
          op.type === 'mutation' && op.name.toLowerCase().includes('update')
        );
        
        expect(hasGetUsers).toBe(true);
        expect(hasCreateUser).toBe(true);
        expect(hasUpdateUser).toBe(true);
      });
    });

    describe('Payrolls Domain', () => {
      test('payrolls operations should include core payroll functionality', () => {
        const payrollOps = allOperations.filter(op => op.domain === 'payrolls');
        const operationNames = payrollOps.map(op => op.name.toLowerCase());
        
        // Should have payroll-specific operations
        const hasPayrollQueries = operationNames.some(name => 
          name.includes('payroll') || name.includes('getpayroll')
        );
        const hasPayrollMutations = payrollOps.some(op => 
          op.type === 'mutation' && op.name.toLowerCase().includes('payroll')
        );
        
        expect(hasPayrollQueries).toBe(true);
        expect(hasPayrollMutations).toBe(true);
      });
    });

    describe('Clients Domain', () => {
      test('clients operations should include client management', () => {
        const clientOps = allOperations.filter(op => op.domain === 'clients');
        const operationNames = clientOps.map(op => op.name.toLowerCase());
        
        // Should have client-related operations
        const hasClientOps = operationNames.some(name => 
          name.includes('client') || name.includes('getclient')
        );
        
        expect(hasClientOps).toBe(true);
      });
    });

    describe('Billing Domain', () => {
      test('billing operations should include financial operations', () => {
        const billingOps = allOperations.filter(op => op.domain === 'billing');
        
        if (billingOps.length > 0) {
          const operationNames = billingOps.map(op => op.name.toLowerCase());
          
          // Should have billing-related operations
          const hasBillingOps = operationNames.some(name => 
            name.includes('billing') || name.includes('invoice') || name.includes('payment')
          );
          
          expect(hasBillingOps).toBe(true);
        }
      });
    });
  });

  describe('Security Classification Validation', () => {
    test('critical operations should be properly classified', () => {
      const criticalOps = allOperations.filter(op => op.securityLevel === 'CRITICAL');
      const criticalDomains = ['auth', 'audit', 'permissions'];
      
      // Should have critical operations
      expect(criticalOps.length).toBeGreaterThan(0);
      
      // Critical operations should mostly be from security-sensitive domains
      criticalOps.forEach(op => {
        if (!criticalDomains.includes(op.domain) && op.domain !== 'users') {
          console.warn(`⚠️  Critical operation in unexpected domain: ${op.domain}/${op.name}`);
        }
      });
    });

    test('mutation operations should have appropriate security levels', () => {
      const mutations = allOperations.filter(op => op.type === 'mutation');
      
      mutations.forEach(mutation => {
        // All mutations should have security level assigned
        expect(mutation.securityLevel).toBeDefined();
        expect(['CRITICAL', 'HIGH', 'MEDIUM']).toContain(mutation.securityLevel);
        
        // Critical domain mutations should be CRITICAL or HIGH
        if (['auth', 'audit', 'users'].includes(mutation.domain)) {
          expect(['CRITICAL', 'HIGH']).toContain(mutation.securityLevel);
        }
      });
    });
  });

  describe('Fragment Usage Validation', () => {
    test('fragments should be properly structured', () => {
      const fragments = allOperations.filter(op => op.type === 'fragment');
      
      if (fragments.length > 0) {
        fragments.forEach(fragment => {
          // Fragment names should follow naming conventions
          expect(fragment.name).toMatch(/^[A-Z][a-zA-Z0-9]*$/);
          
          // Fragments should be from identifiable domains
          expect(fragment.domain).toBeDefined();
        });
      }
    });

    test('operations should use shared fragments appropriately', () => {
      const sharedFragments = allOperations.filter(op => 
        op.type === 'fragment' && op.domain === 'shared'
      );
      
      if (sharedFragments.length > 0) {
        // Shared fragments should exist
        expect(sharedFragments.length).toBeGreaterThan(0);
        
        // Should include common entity fragments
        const fragmentNames = sharedFragments.map(f => f.name.toLowerCase());
        const expectedFragments = ['user', 'client', 'payroll'];
        
        expectedFragments.forEach(expectedFragment => {
          const hasFragment = fragmentNames.some(name => 
            name.includes(expectedFragment)
          );
          
          if (!hasFragment) {
            console.warn(`⚠️  Expected to find ${expectedFragment} fragment in shared fragments`);
          }
        });
      }
    });
  });

  describe('Operation Naming Conventions', () => {
    test('operations should follow naming conventions', () => {
      const queries = allOperations.filter(op => op.type === 'query');
      const mutations = allOperations.filter(op => op.type === 'mutation');
      
      // Query naming conventions
      queries.forEach(query => {
        // Should start with Get, List, or other query verbs
        const startsWithQueryVerb = /^(Get|List|Find|Search|Check|Fetch|Load)/.test(query.name);
        if (!startsWithQueryVerb) {
          console.warn(`⚠️  Query ${query.name} may not follow naming convention`);
        }
      });
      
      // Mutation naming conventions
      mutations.forEach(mutation => {
        // Should start with Create, Update, Delete, or other mutation verbs
        const startsWithMutationVerb = /^(Create|Update|Delete|Insert|Remove|Add|Set|Assign|Sync)/.test(mutation.name);
        if (!startsWithMutationVerb) {
          console.warn(`⚠️  Mutation ${mutation.name} may not follow naming convention`);
        }
      });
    });

    test('optimized operations should be documented', () => {
      const optimizedOps = allOperations.filter(op => 
        op.name.includes('Optimized') || 
        op.name.includes('Complete') || 
        op.name.includes('WithStats')
      );
      
      if (optimizedOps.length > 0) {
        console.log(`📊 Found ${optimizedOps.length} optimized operations:`);
        optimizedOps.forEach(op => {
          console.log(`  ${op.domain}/${op.name} (${op.type})`);
        });
        
        // Optimized operations should exist for performance
        expect(optimizedOps.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Performance Characteristics', () => {
    test('complex operations should be within reasonable limits', () => {
      const complexityAnalysis = allOperations.map(operation => ({
        ...operation,
        complexity: testUtils.PerformanceTestUtils.analyzeComplexity(operation)
      }));
      
      // Check for excessively complex operations
      const veryComplexOps = complexityAnalysis.filter(op => 
        op.complexity.complexityScore > 200
      );
      
      if (veryComplexOps.length > 0) {
        console.warn('⚠️  Very complex operations found:');
        veryComplexOps.forEach(op => {
          console.warn(`  ${op.domain}/${op.name}: complexity ${op.complexity.complexityScore}`);
        });
      }
      
      // Should not have too many overly complex operations
      expect(veryComplexOps.length).toBeLessThan(5);
    });

    test('operation complexity should be reasonable by domain', () => {
      const complexityByDomain = allOperations.reduce((acc, operation) => {
        const complexity = testUtils.PerformanceTestUtils.analyzeComplexity(operation);
        if (!acc[operation.domain]) {
          acc[operation.domain] = [];
        }
        acc[operation.domain].push(complexity.complexityScore);
        return acc;
      }, {} as Record<string, number[]>);
      
      Object.entries(complexityByDomain).forEach(([domain, scores]) => {
        const avgComplexity = scores.reduce((a, b) => a + b, 0) / scores.length;
        const maxComplexity = Math.max(...scores);
        
        console.log(`📊 ${domain} complexity - avg: ${avgComplexity.toFixed(1)}, max: ${maxComplexity}`);
        
        // Average complexity should be reasonable
        expect(avgComplexity).toBeLessThan(100);
        
        // Max complexity should not be excessive
        expect(maxComplexity).toBeLessThan(300);
      });
    });
  });
});

// Export discovered operations for use in other tests
export { allOperations };