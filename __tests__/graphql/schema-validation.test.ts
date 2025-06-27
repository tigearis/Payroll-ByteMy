/**
 * GraphQL Schema Validation Tests
 * Priority 3 Technical Debt: GraphQL operation testing implementation
 */

import { describe, test, expect } from '@jest/globals';
import { buildSchema, validateSchema, validate, parse } from 'graphql';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

// Load the schema
const schemaPath = join(process.cwd(), 'shared/schema/schema.graphql');
const schemaSDL = readFileSync(schemaPath, 'utf8');
const schema = buildSchema(schemaSDL);

// Load all GraphQL operation files
const getGraphQLFiles = (pattern: string): string[] => {
  return glob.sync(pattern, { cwd: process.cwd() });
};

const loadGraphQLOperations = (filePaths: string[]) => {
  return filePaths.map(filePath => {
    const content = readFileSync(join(process.cwd(), filePath), 'utf8');
    return { filePath, content };
  });
};

describe('GraphQL Schema Validation', () => {
  test('schema is valid and well-formed', () => {
    const errors = validateSchema(schema);
    expect(errors).toHaveLength(0);
  });

  test('schema contains expected root types', () => {
    const queryType = schema.getQueryType();
    const mutationType = schema.getMutationType();
    const subscriptionType = schema.getSubscriptionType();

    expect(queryType).toBeDefined();
    expect(mutationType).toBeDefined();
    expect(subscriptionType).toBeDefined();
  });

  test('schema has expected core types', () => {
    const typeMap = schema.getTypeMap();
    
    // Check for core business entities
    expect(typeMap.users).toBeDefined();
    expect(typeMap.clients).toBeDefined();
    expect(typeMap.payrolls).toBeDefined();
    expect(typeMap.auditLogs).toBeDefined();
    expect(typeMap.notes).toBeDefined();
  });
});

describe('GraphQL Operations Validation', () => {
  // Load all GraphQL operation files
  const queryFiles = getGraphQLFiles('domains/*/graphql/queries.graphql');
  const mutationFiles = getGraphQLFiles('domains/*/graphql/mutations.graphql');
  const subscriptionFiles = getGraphQLFiles('domains/*/graphql/subscriptions.graphql');
  const fragmentFiles = getGraphQLFiles('domains/*/graphql/fragments.graphql');
  const sharedFiles = getGraphQLFiles('shared/graphql/*.graphql');

  const allFiles = [...queryFiles, ...mutationFiles, ...subscriptionFiles, ...fragmentFiles, ...sharedFiles];
  const operations = loadGraphQLOperations(allFiles);

  test('all GraphQL operations are syntactically valid', () => {
    operations.forEach(({ filePath, content }) => {
      expect(() => {
        // Split content by operation boundaries and parse each
        const operationBlocks = content
          .split(/(?=query\s|mutation\s|subscription\s|fragment\s)/)
          .filter(block => block.trim().length > 0)
          .filter(block => !block.trim().startsWith('#')); // Skip comment-only blocks

        operationBlocks.forEach((block, index) => {
          if (block.trim()) {
            try {
              parse(block);
            } catch (error) {
              throw new Error(`Syntax error in ${filePath} block ${index + 1}: ${error.message}\nBlock content: ${block.substring(0, 200)}...`);
            }
          }
        });
      }).not.toThrow();
    });
  });

  test('all operations validate against schema', () => {
    operations.forEach(({ filePath, content }) => {
      // Skip files with only fragments or comments
      if (!content.includes('query ') && !content.includes('mutation ') && !content.includes('subscription ')) {
        return;
      }

      expect(() => {
        // Parse and validate operations that aren't just fragments
        const operationBlocks = content
          .split(/(?=query\s|mutation\s|subscription\s)/)
          .filter(block => block.trim().length > 0)
          .filter(block => !block.trim().startsWith('#'))
          .filter(block => block.includes('query ') || block.includes('mutation ') || block.includes('subscription '));

        operationBlocks.forEach((block, index) => {
          if (block.trim()) {
            try {
              const document = parse(block);
              const errors = validate(schema, document);
              
              if (errors.length > 0) {
                throw new Error(`Validation errors in ${filePath} block ${index + 1}: ${errors.map(e => e.message).join(', ')}`);
              }
            } catch (error) {
              // Skip parse errors as they're caught by syntax test
              if (!error.message.includes('Syntax Error')) {
                throw error;
              }
            }
          }
        });
      }).not.toThrow();
    });
  });
});

describe('Fragment Validation', () => {
  const fragmentFiles = getGraphQLFiles('**/fragments.graphql');
  const fragments = loadGraphQLOperations(fragmentFiles);

  test('fragments follow naming conventions', () => {
    fragments.forEach(({ filePath, content }) => {
      const fragmentMatches = content.match(/fragment\s+(\w+)\s+on/g);
      
      if (fragmentMatches) {
        fragmentMatches.forEach(match => {
          const fragmentName = match.match(/fragment\s+(\w+)\s+on/)?.[1];
          
          if (fragmentName) {
            // Check PascalCase
            expect(fragmentName).toMatch(/^[A-Z][a-zA-Z0-9]*$/);
            
            // Check for entity + purpose pattern
            const hasEntityPrefix = ['User', 'Client', 'Payroll', 'Audit', 'Permission', 'Billing', 'Work', 'Leave', 'Note', 'External']
              .some(entity => fragmentName.startsWith(entity));
            
            if (!hasEntityPrefix) {
              console.warn(`Fragment ${fragmentName} in ${filePath} may not follow Entity+Purpose naming convention`);
            }
          }
        });
      }
    });
  });

  test('no circular fragment dependencies', () => {
    const fragmentDependencies = new Map<string, Set<string>>();
    
    fragments.forEach(({ content }) => {
      const fragmentMatches = content.match(/fragment\s+(\w+)\s+on[\s\S]*?(?=fragment\s|\z)/g);
      
      if (fragmentMatches) {
        fragmentMatches.forEach(fragmentBlock => {
          const nameMatch = fragmentBlock.match(/fragment\s+(\w+)\s+on/);
          const spreadMatches = fragmentBlock.match(/\.\.\.(\w+)/g);
          
          if (nameMatch) {
            const fragmentName = nameMatch[1];
            const dependencies = new Set<string>();
            
            if (spreadMatches) {
              spreadMatches.forEach(spread => {
                const depName = spread.substring(3); // Remove '...'
                dependencies.add(depName);
              });
            }
            
            fragmentDependencies.set(fragmentName, dependencies);
          }
        });
      }
    });

    // Check for circular dependencies using DFS
    const checkCircular = (fragment: string, visited: Set<string>, path: Set<string>): boolean => {
      if (path.has(fragment)) {
        return true; // Circular dependency found
      }
      
      if (visited.has(fragment)) {
        return false; // Already processed
      }
      
      visited.add(fragment);
      path.add(fragment);
      
      const dependencies = fragmentDependencies.get(fragment) || new Set();
      for (const dep of dependencies) {
        if (checkCircular(dep, visited, path)) {
          return true;
        }
      }
      
      path.delete(fragment);
      return false;
    };

    const visited = new Set<string>();
    for (const fragment of fragmentDependencies.keys()) {
      if (!visited.has(fragment)) {
        const hasCircular = checkCircular(fragment, visited, new Set());
        expect(hasCircular).toBe(false);
      }
    }
  });
});

describe('Optimized Query Performance', () => {
  test('optimized queries are properly structured', () => {
    const optimizedQueries = [
      'GetPayrollDetailComplete',
      'GetClientsListWithStats', 
      'GetStaffDetailComplete',
      'GetDashboardStatsOptimized'
    ];

    const queryFiles = getGraphQLFiles('**/queries.graphql');
    const queryOperations = loadGraphQLOperations(queryFiles);

    optimizedQueries.forEach(queryName => {
      const found = queryOperations.some(({ content }) => content.includes(`query ${queryName}`));
      expect(found).toBe(true);
    });
  });

  test('optimized queries have performance documentation', () => {
    const queryFiles = getGraphQLFiles('**/queries.graphql');
    const queryOperations = loadGraphQLOperations(queryFiles);

    queryOperations.forEach(({ filePath, content }) => {
      // Check for optimized queries (those that mention "Optimized" or "reduces network requests")
      if (content.includes('Optimized') || content.includes('reduces network requests')) {
        // Should have performance documentation
        expect(content).toMatch(/# Performance:|# Replaces:|# Reduces:/);
      }
    });
  });
});