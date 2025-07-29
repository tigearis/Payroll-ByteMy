import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

// Introspection query to get schema information
const INTROSPECTION_QUERY = gql`
  query IntrospectSchema {
    __schema {
      types {
        name
        kind
        description
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
          description
        }
        inputFields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
      queryType {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
          args {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    }
  }
`;

// Domains we're interested in for reporting
const REPORT_DOMAINS = [
  "clients",
  "payrolls",
  "payroll_dates",
  "billing",
  "users",
  "user_skills",
  "userroles",
  "roles",
  "payroll_cycles",
  "payroll_date_types",
  "payroll_required_skills",
  "work_schedule",
  "leave",
  "notes",
  "user_invitations",
  "permission_audit_logs",
  "permission_overrides",
  "resources",
  "role_permissions",
];

// Fields to exclude from reports (sensitive or internal)
const EXCLUDED_FIELDS = [
  "password",
  "password_hash",
  "secret",
  "token",
  "api_key",
  "private_key",
  "__typename",
];

export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    // Authorization check - require developer role only
    const userRole = session.role || session.defaultRole;
    const isDeveloper = userRole === 'developer';
    
    if (!isDeveloper) {
      return NextResponse.json(
        { error: "Developer access required for reports schema" },
        { status: 403 }
      );
    }

    // Get schema via introspection using authenticated query helper
    const response = await executeQuery(INTROSPECTION_QUERY);

    console.log('🔍 Introspection response:', JSON.stringify(response, null, 2));
    
    const schema = response.__schema;
    
    if (!schema) {
      console.error('❌ No __schema found in response');
      throw new Error('Invalid schema response: missing __schema');
    }
    
    if (!schema.types || !Array.isArray(schema.types)) {
      console.error('❌ Schema types invalid:', schema.types);
      throw new Error('Invalid schema response: missing or invalid types array');
    }
    
    console.log(`📋 Schema introspection successful: ${schema.types.length} types found`);

    // Extract available fields and relationships
    const availableFields: Record<string, string[]> = {};
    const relationships: Record<string, Record<string, string>> = {};
    const fieldTypes: Record<string, Record<string, string>> = {};

    // Process each type in the schema
    schema.types.forEach((type: any, index: number) => {
      try {
        if (!type) {
          console.warn(`⚠️ Skipping null type at index ${index}`);
          return;
        }
        
        if (!type.kind) {
          console.warn(`⚠️ Type at index ${index} missing 'kind' property:`, JSON.stringify(type, null, 2));
          return;
        }
        
        if (!type.name) {
          console.warn(`⚠️ Type at index ${index} missing 'name' property:`, JSON.stringify(type, null, 2));
          return;
        }
        
        if (type.kind === "OBJECT" && REPORT_DOMAINS.includes(type.name)) {
          const domainName = type.name;
          const fields: string[] = [];
          const types: Record<string, string> = {};

          // Extract fields for this domain
          if (type.fields && Array.isArray(type.fields)) {
            type.fields.forEach((field: any, fieldIndex: number) => {
              try {
                if (!field) {
                  console.warn(`⚠️ Skipping null field at index ${fieldIndex} in type ${domainName}`);
                  return;
                }
                
                if (!field.name) {
                  console.warn(`⚠️ Field at index ${fieldIndex} in type ${domainName} missing 'name'`);
                  return;
                }
                
                if (!EXCLUDED_FIELDS.includes(field.name)) {
                  fields.push(field.name);

                  // Determine field type with safety check
                  if (field.type) {
                    const fieldType = getFieldType(field.type);
                    types[field.name] = fieldType;
                  } else {
                    console.warn(`⚠️ Field ${field.name} in type ${domainName} missing type information`);
                    types[field.name] = "Unknown";
                  }
                }
              } catch (fieldError) {
                console.error(`❌ Error processing field ${fieldIndex} in type ${domainName}:`, fieldError);
              }
            });
          }

          availableFields[domainName] = fields;
          fieldTypes[domainName] = types;
          
          console.log(`✅ Processed domain ${domainName}: ${fields.length} fields`);
        }
      } catch (typeError) {
        console.error(`❌ Error processing type at index ${index}:`, typeError);
        console.error(`❌ Problematic type:`, JSON.stringify(type, null, 2));
      }
    });

    // Build relationships by analyzing field types
    Object.keys(availableFields).forEach(domain => {
      const domainFields = availableFields[domain];
      const domainTypes = fieldTypes[domain];
      const domainRelationships: Record<string, string> = {};

      domainFields.forEach(field => {
        const fieldType = domainTypes[field];

        // Check if this field references another domain
        if (fieldType && REPORT_DOMAINS.includes(fieldType)) {
          domainRelationships[fieldType] = field;
        }

        // Check for array relationships (e.g., payrolls field in clients)
        if (fieldType && fieldType.endsWith("[]")) {
          const baseType = fieldType.slice(0, -2); // Remove '[]'
          if (REPORT_DOMAINS.includes(baseType)) {
            domainRelationships[baseType] = field;
          }
        }
      });

      if (Object.keys(domainRelationships).length > 0) {
        relationships[domain] = domainRelationships;
      }
    });

    // Get query fields to understand available root queries
    const queryFields = schema.queryType?.fields || [];
    const availableQueries = queryFields
      .filter((field: any) => REPORT_DOMAINS.includes(field.name))
      .map((field: any) => field.name);

    return NextResponse.json({
      success: true,
      data: {
        availableFields,
        relationships,
        fieldTypes,
        availableQueries,
        domains: REPORT_DOMAINS,
        schemaVersion: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Schema introspection error:", error);
    return NextResponse.json(
      {
        error: "Failed to introspect schema",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});

function getFieldType(type: any): string {
  if (!type) {
    console.warn('⚠️ getFieldType called with null/undefined type');
    return "Unknown";
  }
  
  if (!type.kind) {
    console.warn('⚠️ getFieldType called with type missing kind property:', JSON.stringify(type, null, 2));
    return type.name || "Unknown";
  }

  if (type.kind === "NON_NULL") {
    if (type.ofType) {
      return getFieldType(type.ofType);
    } else {
      console.warn('⚠️ NON_NULL type missing ofType property');
      return "Unknown";
    }
  }

  if (type.kind === "LIST") {
    if (type.ofType) {
      const baseType = getFieldType(type.ofType);
      return `${baseType}[]`;
    } else {
      console.warn('⚠️ LIST type missing ofType property');
      return "Unknown[]";
    }
  }

  return type.name || "Unknown";
}

// POST endpoint to validate a specific query
export const POST = withAuth(async (request: NextRequest, session) => {
  try {
    const body = await request.json();
    const { query, variables } = body;

    // Validate the query by attempting to parse it
    try {
      const parsedQuery = gql`
        ${query}
      `;

      // Try to execute the query to see if it's valid using authenticated query helper
      const response = await executeQuery(parsedQuery, variables || {});

      return NextResponse.json({
        success: true,
        data: {
          isValid: true,
          hasErrors: false, // executeQuery throws on errors
          errors: [],
          resultCount: response ? Object.keys(response).length : 0,
        },
      });
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        data: {
          isValid: false,
          error:
            parseError instanceof Error
              ? parseError.message
              : "Query parsing failed",
        },
      });
    }
  } catch (error) {
    console.error("Query validation error:", error);
    return NextResponse.json(
      {
        error: "Failed to validate query",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});
