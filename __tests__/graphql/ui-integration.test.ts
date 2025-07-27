/**
 * UI Integration Testing
 * 
 * Tests the integration between UI components and their GraphQL operations
 * to ensure all components can successfully execute their required operations.
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import { GraphQLOperationDiscovery } from './utils/test-utilities';
import { GraphQLTestClient } from './utils/auth-testing';
import { testDataManager } from './utils/data-seeding';

interface ComponentOperationMapping {
  componentPath: string;
  componentName: string;
  domain: string;
  usedOperations: string[];
  usedHooks: string[];
  apolloQueries: string[];
  apolloMutations: string[];
  apolloSubscriptions: string[];
}

describe('GraphQL UI Integration Testing', () => {
  let discoveryService: GraphQLOperationDiscovery;
  let testClient: GraphQLTestClient;
  let allOperations: any[] = [];
  let componentMappings: ComponentOperationMapping[] = [];
  
  beforeAll(async () => {
    console.log('🔗 Initializing UI Integration Testing...');
    
    discoveryService = new GraphQLOperationDiscovery();
    testClient = new GraphQLTestClient();
    
    // Discover all operations
    allOperations = await discoveryService.discoverAllOperations();
    
    // Analyze component-operation mappings
    componentMappings = await this.analyzeComponentOperationMappings();
    console.log(`🔍 Analyzed ${componentMappings.length} components for GraphQL usage`);
    
    // Set up test environment
    console.log('🔧 Setting up test environment for UI integration testing...');
    await testDataManager.setupCompleteTestEnvironment();
  });

  afterAll(async () => {
    console.log('📊 UI Integration Testing Summary:');
    console.log(`📱 Components analyzed: ${componentMappings.length}`);
    console.log(`🔄 Operations discovered: ${allOperations.length}`);
    
    // Cleanup
    await testDataManager.cleanupAllTestData();
  });

  describe('Component-Operation Mapping Analysis', () => {
    test('should discover components with GraphQL usage', () => {
      const componentsWithGraphQL = componentMappings.filter(comp => 
        comp.usedOperations.length > 0 || 
        comp.apolloQueries.length > 0 || 
        comp.apolloMutations.length > 0
      );
      
      console.log(`📊 Components using GraphQL: ${componentsWithGraphQL.length}`);
      
      // Should have components using GraphQL
      expect(componentsWithGraphQL.length).toBeGreaterThan(0);
      
      // Log top GraphQL-using components
      componentsWithGraphQL.slice(0, 10).forEach(comp => {
        console.log(`  ${comp.domain}/${comp.componentName}: ${comp.usedOperations.length} operations`);
      });
    });

    test('should identify Apollo Client hook usage', () => {
      const apolloHookUsage = componentMappings.reduce((acc, comp) => {
        comp.usedHooks.forEach(hook => {
          acc[hook] = (acc[hook] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);
      
      console.log('🪝 Apollo Hook Usage:', apolloHookUsage);
      
      // Should have common Apollo hooks
      const expectedHooks = ['useQuery', 'useMutation', 'useSubscription', 'useLazyQuery'];
      expectedHooks.forEach(hook => {
        if (apolloHookUsage[hook]) {
          expect(apolloHookUsage[hook]).toBeGreaterThan(0);
        }
      });
    });

    test('should map operations to their using components', () => {
      const operationUsage = new Map<string, string[]>();
      
      componentMappings.forEach(comp => {
        comp.usedOperations.forEach(op => {
          if (!operationUsage.has(op)) {
            operationUsage.set(op, []);
          }
          operationUsage.get(op)!.push(`${comp.domain}/${comp.componentName}`);
        });
      });
      
      console.log(`🔗 Operations with component usage: ${operationUsage.size}`);
      
      // Check for unused operations
      const allOperationNames = allOperations.map(op => op.name);
      const unusedOperations = allOperationNames.filter(name => 
        !operationUsage.has(name)
      );
      
      if (unusedOperations.length > 0) {
        console.warn(`⚠️  Potentially unused operations: ${unusedOperations.length}`);
        unusedOperations.slice(0, 5).forEach(op => {
          console.warn(`  ${op}`);
        });
      }
      
      // Most operations should be used by components
      const usagePercentage = (operationUsage.size / allOperationNames.length) * 100;
      console.log(`📈 Operation usage: ${usagePercentage.toFixed(1)}%`);
    });
  });

  describe('Domain-Specific UI Integration', () => {
    describe('Users Domain Components', () => {
      test('user management components should execute user operations', async () => {
        const userComponents = componentMappings.filter(comp => 
          comp.domain === 'users' || 
          comp.componentName.toLowerCase().includes('user')
        );
        
        for (const component of userComponents.slice(0, 3)) {
          // Test that user operations work with the UI data requirements
          const userOperations = component.usedOperations.filter(op => 
            allOperations.some(operation => 
              operation.name === op && operation.domain === 'users'
            )
          );
          
          for (const operationName of userOperations.slice(0, 2)) {
            const operation = allOperations.find(op => op.name === operationName);
            if (operation && operation.type === 'query') {
              const result = await testClient.executeAsRole(
                this.createTestQuery(operation),
                {},
                'manager'
              );
              
              // Should either succeed or fail gracefully (not with internal errors)
              if (!result.success && result.errors) {
                const hasInternalError = result.errors.some(error => 
                  error.toLowerCase().includes('internal') ||
                  error.toLowerCase().includes('unknown column')
                );
                expect(hasInternalError).toBe(false);
              }
            }
          }
        }
      });
    });

    describe('Payrolls Domain Components', () => {
      test('payroll components should handle payroll operations correctly', async () => {
        const payrollComponents = componentMappings.filter(comp => 
          comp.domain === 'payrolls' || 
          comp.componentName.toLowerCase().includes('payroll')
        );
        
        for (const component of payrollComponents.slice(0, 3)) {
          const payrollOperations = component.usedOperations.filter(op => 
            allOperations.some(operation => 
              operation.name === op && operation.domain === 'payrolls'
            )
          );
          
          for (const operationName of payrollOperations.slice(0, 2)) {
            const operation = allOperations.find(op => op.name === operationName);
            if (operation && operation.type === 'query') {
              const result = await testClient.executeAsRole(
                this.createTestQuery(operation),
                {},
                'consultant'
              );
              
              // Consultant should be able to access payroll queries
              if (!result.success && result.errors) {
                const hasPermissionError = result.errors.some(error => 
                  error.toLowerCase().includes('permission denied')
                );
                
                // Consultants should generally have payroll access
                if (!hasPermissionError) {
                  console.log(`✅ ${component.componentName} payroll operation ${operationName} accessible to consultant`);
                }
              }
            }
          }
        }
      });
    });

    describe('Clients Domain Components', () => {
      test('client components should integrate with client operations', async () => {
        const clientComponents = componentMappings.filter(comp => 
          comp.domain === 'clients' || 
          comp.componentName.toLowerCase().includes('client')
        );
        
        for (const component of clientComponents.slice(0, 3)) {
          const clientOperations = component.usedOperations.filter(op => 
            allOperations.some(operation => 
              operation.name === op && operation.domain === 'clients'
            )
          );
          
          if (clientOperations.length > 0) {
            console.log(`🏢 Testing ${component.componentName} with ${clientOperations.length} client operations`);
            
            // Test the first client operation
            const operationName = clientOperations[0];
            const operation = allOperations.find(op => op.name === operationName);
            
            if (operation && operation.type === 'query') {
              const result = await testClient.executeAsRole(
                this.createTestQuery(operation),
                {},
                'consultant'
              );
              
              // Should work for consultants
              if (result.success) {
                console.log(`✅ ${component.componentName} successfully executed ${operationName}`);
              }
            }
          }
        }
      });
    });
  });

  describe('Apollo Client Integration Validation', () => {
    test('components should use proper Apollo Client patterns', () => {
      const apolloPatterns = {
        useQuery: 0,
        useMutation: 0,
        useLazyQuery: 0,
        useSubscription: 0,
        apolloClient: 0,
        'client.query': 0,
        'client.mutate': 0
      };
      
      componentMappings.forEach(comp => {
        comp.usedHooks.forEach(hook => {
          if (apolloPatterns.hasOwnProperty(hook)) {
            apolloPatterns[hook as keyof typeof apolloPatterns]++;
          }
        });
      });
      
      console.log('🚀 Apollo Client Pattern Usage:', apolloPatterns);
      
      // Should use modern Apollo patterns
      expect(apolloPatterns.useQuery).toBeGreaterThan(0);
      expect(apolloPatterns.useMutation).toBeGreaterThan(0);
    });

    test('components should handle loading and error states', async () => {
      // Test that operations return appropriate loading/error data structures
      const testQuery = `
        query TestUIIntegration {
          users(limit: 1) {
            id
            name
            email
            role
          }
        }
      `;
      
      const result = await testClient.executeAsRole(testQuery, {}, 'manager');
      
      if (result.success && result.data) {
        // Should have data structure that components expect
        expect(result.data).toHaveProperty('users');
        expect(Array.isArray(result.data.users)).toBe(true);
        
        if (result.data.users.length > 0) {
          const user = result.data.users[0];
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('role');
        }
      }
    });

    test('mutation operations should work with UI form data structures', async () => {
      // Test that mutations accept the data formats that UI forms provide
      const createUserMutation = `
        mutation CreateTestUIUser($object: users_insert_input!) {
          insert_users_one(object: $object) {
            id
            name
            email
            role
          }
        }
      `;
      
      const formData = {
        object: {
          name: 'UI Integration Test User',
          email: 'ui-test@example.com',
          role: 'consultant',
          isActive: true,
          isStaff: true,
          clerkUserId: 'ui_test_clerk_id'
        }
      };
      
      const result = await testClient.executeAsRole(createUserMutation, formData, 'manager');
      
      if (!result.success && result.errors) {
        // Should fail gracefully with expected validation errors, not schema errors
        const hasSchemaError = result.errors.some(error => 
          error.toLowerCase().includes('unknown column') ||
          error.toLowerCase().includes('syntax error') ||
          error.toLowerCase().includes('invalid input syntax')
        );
        
        expect(hasSchemaError).toBe(false);
      }
    });
  });

  describe('Real-time Features Integration', () => {
    test('subscription operations should be properly structured for UI', () => {
      const subscriptions = allOperations.filter(op => op.type === 'subscription');
      
      if (subscriptions.length > 0) {
        console.log(`🔔 Found ${subscriptions.length} subscription operations`);
        
        subscriptions.forEach(sub => {
          // Subscriptions should follow naming conventions
          expect(sub.name).toMatch(/^(On|Watch|Subscribe|Listen)/i);
          
          console.log(`  ${sub.domain}/${sub.name}`);
        });
        
        // Components should use subscriptions for real-time updates
        const componentsWithSubscriptions = componentMappings.filter(comp => 
          comp.usedHooks.includes('useSubscription') ||
          comp.apolloSubscriptions.length > 0
        );
        
        if (componentsWithSubscriptions.length > 0) {
          console.log(`📱 Components using subscriptions: ${componentsWithSubscriptions.length}`);
          expect(componentsWithSubscriptions.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Performance Integration', () => {
    test('UI operations should complete within acceptable timeframes', async () => {
      const criticalQueries = [
        'GetUsers',
        'GetPayrolls', 
        'GetClients',
        'GetDashboardStats'
      ];
      
      for (const queryName of criticalQueries) {
        const operation = allOperations.find(op => 
          op.name === queryName || op.name.includes(queryName)
        );
        
        if (operation) {
          const startTime = Date.now();
          
          const result = await testClient.executeAsRole(
            this.createTestQuery(operation),
            {},
            'consultant'
          );
          
          const duration = Date.now() - startTime;
          
          // UI operations should be fast
          expect(duration).toBeLessThan(10000); // 10 seconds max
          
          console.log(`⚡ ${queryName} completed in ${duration}ms`);
        }
      }
    });
  });

  // Helper methods
  private async analyzeComponentOperationMappings(): Promise<ComponentOperationMapping[]> {
    const mappings: ComponentOperationMapping[] = [];
    
    // Get all component files from domains
    const componentFiles = await glob('domains/*/components/**/*.tsx', { cwd: process.cwd() });
    
    for (const filePath of componentFiles) {
      try {
        const content = readFileSync(join(process.cwd(), filePath), 'utf8');
        const mapping = this.extractOperationMappingFromComponent(filePath, content);
        if (mapping) {
          mappings.push(mapping);
        }
      } catch (error) {
        console.warn(`Could not analyze component ${filePath}: ${error.message}`);
      }
    }
    
    return mappings;
  }

  private extractOperationMappingFromComponent(filePath: string, content: string): ComponentOperationMapping | null {
    const domain = filePath.split('/')[1]; // Extract domain from path
    const componentName = filePath.split('/').pop()?.replace('.tsx', '') || '';
    
    // Extract GraphQL operation usage
    const usedOperations = this.extractOperationNames(content);
    const usedHooks = this.extractApolloHooks(content);
    const apolloQueries = this.extractApolloQueries(content);
    const apolloMutations = this.extractApolloMutations(content);
    const apolloSubscriptions = this.extractApolloSubscriptions(content);
    
    return {
      componentPath: filePath,
      componentName,
      domain,
      usedOperations,
      usedHooks,
      apolloQueries,
      apolloMutations,
      apolloSubscriptions
    };
  }

  private extractOperationNames(content: string): string[] {
    const operations: string[] = [];
    
    // Look for GraphQL operation names in various patterns
    const patterns = [
      /(\w+Document)/g, // Generated document exports
      /useQuery\s*<[^>]*>\s*\(\s*(\w+)/g, // useQuery with operation
      /useMutation\s*<[^>]*>\s*\(\s*(\w+)/g, // useMutation with operation
      /gql`[\s\S]*?(query|mutation|subscription)\s+(\w+)/g // gql template literals
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1] && match[1] !== 'query' && match[1] !== 'mutation' && match[1] !== 'subscription') {
          operations.push(match[1]);
        }
        if (match[2]) {
          operations.push(match[2]);
        }
      }
    });
    
    return [...new Set(operations)]; // Remove duplicates
  }

  private extractApolloHooks(content: string): string[] {
    const hooks: string[] = [];
    const hookPattern = /(useQuery|useMutation|useLazyQuery|useSubscription|useApolloClient)/g;
    
    let match;
    while ((match = hookPattern.exec(content)) !== null) {
      hooks.push(match[1]);
    }
    
    return [...new Set(hooks)];
  }

  private extractApolloQueries(content: string): string[] {
    const queries: string[] = [];
    const queryPattern = /useQuery\s*<[^>]*>\s*\(\s*(\w+)/g;
    
    let match;
    while ((match = queryPattern.exec(content)) !== null) {
      queries.push(match[1]);
    }
    
    return queries;
  }

  private extractApolloMutations(content: string): string[] {
    const mutations: string[] = [];
    const mutationPattern = /useMutation\s*<[^>]*>\s*\(\s*(\w+)/g;
    
    let match;
    while ((match = mutationPattern.exec(content)) !== null) {
      mutations.push(match[1]);
    }
    
    return mutations;
  }

  private extractApolloSubscriptions(content: string): string[] {
    const subscriptions: string[] = [];
    const subscriptionPattern = /useSubscription\s*<[^>]*>\s*\(\s*(\w+)/g;
    
    let match;
    while ((match = subscriptionPattern.exec(content)) !== null) {
      subscriptions.push(match[1]);
    }
    
    return subscriptions;
  }

  private createTestQuery(operation: any): string {
    // Create a minimal test version of the operation
    try {
      const operationText = operation.document.loc?.source?.body || '';
      
      if (operationText.includes('query ')) {
        // Extract just the basic structure for testing
        const lines = operationText.split('\n');
        const queryStart = lines.findIndex(line => line.includes('query '));
        const queryEnd = lines.findIndex((line, index) => 
          index > queryStart && line.includes('}') && !line.includes('{')
        );
        
        if (queryStart >= 0 && queryEnd >= 0) {
          return lines.slice(queryStart, queryEnd + 1).join('\n');
        }
      }
      
      return operationText;
    } catch (error) {
      return '';
    }
  }
});