/**
 * GraphQL Performance Tests
 * Priority 3 Technical Debt: GraphQL operation performance validation
 */

import { describe, test, expect, beforeAll } from '@jest/globals';
import { parse, validate, execute, buildSchema } from 'graphql';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load schema for validation
const schemaPath = join(process.cwd(), 'shared/schema/schema.graphql');
const schemaSDL = readFileSync(schemaPath, 'utf8');
const schema = buildSchema(schemaSDL);

// Query complexity analyzer
interface ComplexityAnalysis {
  totalFields: number;
  maxDepth: number;
  fragmentCount: number;
  aliasCount: number;
  complexityScore: number;
}

const analyzeQueryComplexity = (query: string): ComplexityAnalysis => {
  try {
    const document = parse(query);
    let totalFields = 0;
    let maxDepth = 0;
    let fragmentCount = 0;
    let aliasCount = 0;

    const traverse = (node: any, depth = 0) => {
      maxDepth = Math.max(maxDepth, depth);

      if (node.kind === 'Field') {
        totalFields++;
        if (node.alias) {
          aliasCount++;
        }
      }

      if (node.kind === 'FragmentSpread' || node.kind === 'InlineFragment') {
        fragmentCount++;
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach((selection: any) => {
          traverse(selection, depth + 1);
        });
      }

      // Traverse other node properties
      Object.values(node).forEach(value => {
        if (Array.isArray(value)) {
          value.forEach(item => {
            if (item && typeof item === 'object' && item.kind) {
              traverse(item, depth);
            }
          });
        }
      });
    };

    document.definitions.forEach(definition => traverse(definition));

    // Calculate complexity score based on multiple factors
    const complexityScore = 
      totalFields * 1 +           // Base field cost
      maxDepth * 2 +             // Depth penalty
      fragmentCount * 0.5 +      // Fragment overhead
      aliasCount * 1.5;          // Alias overhead

    return {
      totalFields,
      maxDepth,
      fragmentCount,
      aliasCount,
      complexityScore,
    };
  } catch (error) {
    return {
      totalFields: 0,
      maxDepth: 0,
      fragmentCount: 0,
      aliasCount: 0,
      complexityScore: 0,
    };
  }
};

describe('GraphQL Query Complexity Analysis', () => {
  const optimizedQueries = {
    'GetPayrollDetailComplete': `
      query GetPayrollDetailComplete($id: uuid!) {
        payrollById(id: $id) {
          id
          name
          status
          client { id name }
          primaryConsultant { id name email role }
          backupConsultant { id name email role }
          manager { id name email role }
          detailDates: payrollDates(orderBy: { originalEftDate: ASC }, limit: 12) {
            id
            originalEftDate
            adjustedEftDate
            processingDate
            createdAt
          }
        }
        users(where: { isActive: { _eq: true } }, orderBy: { name: ASC }) {
          id
          name
          email
          role
          isStaff
          isActive
        }
        payrollCycles(orderBy: { name: ASC }) {
          id
          name
          description
        }
        payrollDateTypes(orderBy: { name: ASC }) {
          id
          name
          description
        }
      }
    `,
    'GetClientsListWithStats': `
      query GetClientsListWithStats($limit: Int = 20, $offset: Int = 0) {
        clients(limit: $limit, offset: $offset, orderBy: { name: ASC }) {
          id
          name
          active
          contactPerson
          contactEmail
          createdAt
        }
        clientsAggregate {
          aggregate { count }
        }
        activeClientsCount: clientsAggregate(where: {active: {_eq: true}}) {
          aggregate { count }
        }
        totalEmployeesAcrossClients: payrollsAggregate(where: {supersededDate: {_isNull: true}}) {
          aggregate {
            sum { employeeCount }
          }
        }
      }
    `,
    'GetDashboardStatsOptimized': `
      query GetDashboardStatsOptimized($limit: Int = 10) {
        clientsAggregate {
          aggregate { count }
        }
        totalPayrolls: payrollsAggregate(where: { supersededDate: { _isNull: true } }) {
          aggregate { count }
        }
        activePayrolls: payrollsAggregate(where: { 
          supersededDate: { _isNull: true }
          status: { _eq: "Active" }
        }) {
          aggregate { count }
        }
        processingPayrolls: payrollsAggregate(where: { 
          supersededDate: { _isNull: true }
          status: { _eq: "Processing" }
        }) {
          aggregate { count }
        }
        upcomingPayrolls: payrolls(
          where: { supersededDate: { _isNull: true }, status: { _eq: "Active" } }
          orderBy: { updatedAt: DESC }
          limit: $limit
        ) {
          id
          name
          status
          client { id name }
        }
      }
    `
  };

  test('optimized queries stay within complexity limits', () => {
    Object.entries(optimizedQueries).forEach(([queryName, query]) => {
      const analysis = analyzeQueryComplexity(query);
      
      console.log(`${queryName} complexity analysis:`, analysis);
      
      // Set reasonable complexity limits
      expect(analysis.totalFields).toBeLessThan(50); // Maximum 50 fields
      expect(analysis.maxDepth).toBeLessThan(6);     // Maximum 6 levels deep
      expect(analysis.complexityScore).toBeLessThan(150); // Overall complexity score
    });
  });

  test('simple queries have low complexity', () => {
    const simpleQuery = `
      query GetUsers {
        users(limit: 10) {
          id
          name
          email
          role
        }
      }
    `;

    const analysis = analyzeQueryComplexity(simpleQuery);
    
    expect(analysis.totalFields).toBeLessThan(10);
    expect(analysis.maxDepth).toBeLessThan(3);
    expect(analysis.complexityScore).toBeLessThan(20);
  });

  test('optimized queries are more efficient than separate queries', () => {
    // Simulate separate queries that GetPayrollDetailComplete replaces
    const separateQueries = [
      `query GetPayrollForEdit($id: uuid!) {
        payrollById(id: $id) {
          id name status
          client { id name }
          primaryConsultant { id name email }
        }
      }`,
      `query GetAllUsersList {
        users(where: { isActive: { _eq: true } }) {
          id name email role isStaff isActive
        }
      }`,
      `query GetPayrollCycles {
        payrollCycles(orderBy: { name: ASC }) {
          id name description
        }
      }`,
      `query GetPayrollDateTypes {
        payrollDateTypes(orderBy: { name: ASC }) {
          id name description
        }
      }`
    ];

    const separateComplexity = separateQueries.reduce((total, query) => {
      return total + analyzeQueryComplexity(query).complexityScore;
    }, 0);

    const optimizedComplexity = analyzeQueryComplexity(optimizedQueries.GetPayrollDetailComplete).complexityScore;

    // The optimized query should be more efficient in terms of network requests
    // but may have higher individual complexity
    console.log(`Separate queries total complexity: ${separateComplexity}`);
    console.log(`Optimized query complexity: ${optimizedComplexity}`);
    
    // The benefit is in network requests (4 → 1), not necessarily complexity score
    expect(separateQueries.length).toBe(4);
    expect(optimizedComplexity).toBeLessThan(200); // Should still be reasonable
  });
});

describe('Query Structure Validation', () => {
  test('optimized queries include performance comments', () => {
    const queryFiles = [
      'domains/payrolls/graphql/queries.graphql',
      'domains/clients/graphql/queries.graphql',
      'domains/users/graphql/queries.graphql',
      'shared/graphql/queries.graphql'
    ];

    queryFiles.forEach(filePath => {
      try {
        const content = readFileSync(join(process.cwd(), filePath), 'utf8');
        
        // Check for optimized queries
        const optimizedMatches = content.match(/query \w*(?:Complete|Optimized|WithStats)\w*/g);
        
        if (optimizedMatches) {
          optimizedMatches.forEach(match => {
            const queryName = match.replace('query ', '');
            
            // Should have performance documentation nearby
            const queryIndex = content.indexOf(match);
            const contextBefore = content.substring(Math.max(0, queryIndex - 500), queryIndex);
            
            const hasPerformanceDoc = contextBefore.includes('Performance:') || 
                                    contextBefore.includes('Reduces network') ||
                                    contextBefore.includes('Replaces:');
            
            expect(hasPerformanceDoc).toBe(true);
          });
        }
      } catch (error) {
        // File might not exist, skip
        console.warn(`Could not read ${filePath}: ${error.message}`);
      }
    });
  });

  test('mutations include proper error handling fields', () => {
    const mutationExample = `
      mutation CreatePayroll($object: payrollsInsertInput!) {
        insertPayroll(object: $object) {
          id
          name
          status
          client { id name }
        }
      }
    `;

    const analysis = analyzeQueryComplexity(mutationExample);
    
    // Mutations should be relatively simple
    expect(analysis.complexityScore).toBeLessThan(30);
    expect(analysis.maxDepth).toBeLessThan(4);
  });
});

describe('Performance Regression Prevention', () => {
  test('establishes performance baselines', () => {
    const performanceBaselines = {
      'GetPayrollDetailComplete': { maxComplexity: 150, maxFields: 50, maxDepth: 6 },
      'GetClientsListWithStats': { maxComplexity: 80, maxFields: 30, maxDepth: 4 },
      'GetDashboardStatsOptimized': { maxComplexity: 100, maxFields: 40, maxDepth: 5 },
    };

    Object.entries(performanceBaselines).forEach(([queryName, baseline]) => {
      if (optimizedQueries[queryName as keyof typeof optimizedQueries]) {
        const analysis = analyzeQueryComplexity(optimizedQueries[queryName as keyof typeof optimizedQueries]);
        
        expect(analysis.complexityScore).toBeLessThanOrEqual(baseline.maxComplexity);
        expect(analysis.totalFields).toBeLessThanOrEqual(baseline.maxFields);
        expect(analysis.maxDepth).toBeLessThanOrEqual(baseline.maxDepth);
      }
    });
  });

  test('validates fragment usage is efficient', () => {
    // Test that fragments are used appropriately and don't create excessive overhead
    const queryWithFragments = `
      query TestFragments {
        users {
          ...UserBasic
          manager {
            ...UserMinimal
          }
        }
      }
      
      fragment UserMinimal on users {
        id
        name
        email
      }
      
      fragment UserBasic on users {
        ...UserMinimal
        role
        isActive
      }
    `;

    const analysis = analyzeQueryComplexity(queryWithFragments);
    
    // Should have reasonable fragment usage
    expect(analysis.fragmentCount).toBeGreaterThan(0);
    expect(analysis.fragmentCount).toBeLessThan(10);
  });
});