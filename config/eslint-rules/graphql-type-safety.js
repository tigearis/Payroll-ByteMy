/**
 * Custom ESLint Rules for GraphQL Type Safety
 * 
 * These rules catch common GraphQL mistakes that can cause runtime errors:
 * 1. Using String! when schema expects bpchar!
 * 2. Using on_conflict instead of onConflict
 * 3. Accessing affectedRows instead of affected_rows
 */

const graphqlTypeSafetyRules = {
  // Rule: Detect bpchar fields declared as String!  
  "graphql-bpchar-type-mismatch": {
    meta: {
      type: "error",
      docs: {
        description: "Detect String! used where bpchar! is expected",
        category: "GraphQL Type Safety"
      },
      messages: {
        bpcharMismatch: "Field '{{fieldName}}' expects 'bpchar!' type, not 'String!'. Use 'bpchar!' for country codes and fixed-length strings."
      }
    },
    create(context) {
      return {
        // Match GraphQL template literals
        TemplateLiteral(node) {
          if (node.tag && node.tag.name === 'gql') {
            const graphqlContent = node.quasis.map(q => q.value.raw).join('');
            
            // Check for countryCode: String! patterns
            const bpcharFieldPattern = /(\$?\w*[Cc]ountry[Cc]ode)\s*:\s*String!/g;
            let match;
            
            while ((match = bpcharFieldPattern.exec(graphqlContent)) !== null) {
              context.report({
                node,
                messageId: "bpcharMismatch",
                data: {
                  fieldName: match[1]
                }
              });
            }
          }
        }
      };
    }
  },

  // Rule: Detect on_conflict usage instead of onConflict
  "graphql-parameter-naming": {
    meta: {
      type: "error", 
      docs: {
        description: "Enforce camelCase parameter naming in GraphQL operations",
        category: "GraphQL Type Safety"
      },
      messages: {
        snakeCaseParam: "Use camelCase '{{correctName}}' instead of snake_case '{{wrongName}}' in GraphQL operations."
      }
    },
    create(context) {
      return {
        TemplateLiteral(node) {
          if (node.tag && node.tag.name === 'gql') {
            const graphqlContent = node.quasis.map(q => q.value.raw).join('');
            
            // Map of snake_case to camelCase GraphQL parameters
            const parameterMappings = {
              'on_conflict': 'onConflict',
              'update_columns': 'updateColumns',
              'affected_rows': 'affectedRows', // Note: This is different - Hasura actually returns snake_case
              'order_by': 'orderBy',
              'group_by': 'groupBy'
            };
            
            for (const [wrongName, correctName] of Object.entries(parameterMappings)) {
              // Special case: affected_rows is correct in responses, wrong in mutations
              if (wrongName === 'affected_rows') {
                // Only flag if it's in a response access context (not in schema)
                const responseAccessPattern = new RegExp(`data\\.\\w+\\.${wrongName}`, 'g');
                if (responseAccessPattern.test(graphqlContent)) {
                  continue; // This is actually correct for Hasura responses
                }
              }
              
              const pattern = new RegExp(`\\b${wrongName}\\b`, 'g');
              if (pattern.test(graphqlContent)) {
                context.report({
                  node,
                  messageId: "snakeCaseParam",
                  data: {
                    wrongName,
                    correctName
                  }
                });
              }
            }
          }
        }
      };
    }
  },

  // Rule: Detect incorrect response field access
  "graphql-response-field-access": {
    meta: {
      type: "error",
      docs: {
        description: "Ensure correct access to GraphQL response fields",
        category: "GraphQL Type Safety"  
      },
      messages: {
        wrongResponseField: "Hasura returns '{{correctField}}' not '{{wrongField}}'. Use snake_case for response field access."
      }
    },
    create(context) {
      return {
        // Check member expressions like data.insertHolidays.affectedRows
        MemberExpression(node) {
          if (node.property && node.property.name === 'affectedRows') {
            // Check if this is accessing a GraphQL response
            const sourceCode = context.getSourceCode();
            const text = sourceCode.getText(node);
            
            // Pattern: data.someMutation.affectedRows
            if (/data\.\w+\.affectedRows/.test(text)) {
              context.report({
                node,
                messageId: "wrongResponseField",
                data: {
                  wrongField: 'affectedRows',
                  correctField: 'affected_rows'
                }
              });
            }
          }
        }
      };
    }
  },

  // Rule: Detect potential type mismatches with other common fields
  "graphql-common-type-mismatches": {
    meta: {
      type: "warn",
      docs: {
        description: "Detect common GraphQL type mismatches",
        category: "GraphQL Type Safety"
      },
      messages: {
        typeMismatch: "Potential type mismatch: field '{{fieldName}}' might expect '{{expectedType}}' instead of '{{actualType}}'."
      }
    },
    create(context) {
      return {
        TemplateLiteral(node) {
          if (node.tag && node.tag.name === 'gql') {
            const graphqlContent = node.quasis.map(q => q.value.raw).join('');
            
            // Common type mismatches to check for
            const typeMismatches = [
              {
                pattern: /(\$?\w*[Ii]d)\s*:\s*String!/g,
                expectedType: 'uuid!',
                description: 'IDs are usually uuid! not String!'
              },
              {
                pattern: /(\$?\w*[Dd]ate)\s*:\s*String!/g, 
                expectedType: 'date!',
                description: 'Date fields should use date! not String!'
              },
              {
                pattern: /(\$?\w*[Tt]imestamp)\s*:\s*String!/g,
                expectedType: 'timestamptz!', 
                description: 'Timestamps should use timestamptz! not String!'
              }
            ];
            
            typeMismatches.forEach(({ pattern, expectedType, description }) => {
              let match;
              while ((match = pattern.exec(graphqlContent)) !== null) {
                context.report({
                  node,
                  messageId: "typeMismatch",
                  data: {
                    fieldName: match[1],
                    actualType: 'String!',
                    expectedType
                  }
                });
              }
            });
          }
        }
      };
    }
  }
};

module.exports = { rules: graphqlTypeSafetyRules };