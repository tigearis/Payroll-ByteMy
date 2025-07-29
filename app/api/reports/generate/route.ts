import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { executeQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

// Schema for report request
const reportRequestSchema = z.object({
  domains: z.array(z.string()),
  fields: z.record(z.string(), z.array(z.string())), // domain -> array of field names
  filters: z.record(z.string(), z.any()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: z.number().optional(),
  includeRelationships: z.boolean().optional().default(true),
});

// Cache for introspection results
let schemaCache: {
  availableFields: Record<string, string[]>;
  relationships: Record<string, Record<string, string>>;
  fieldTypes: Record<string, Record<string, string>>;
  lastUpdated: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Introspection query to get schema information
const INTROSPECTION_QUERY = gql`
  query IntrospectSchema {
    __schema {
      types {
        name
        kind
        fields {
          name
          type {
            name
            kind
            ofType {
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

async function getSchemaViaIntrospection() {
  // Check cache first
  if (schemaCache && Date.now() - schemaCache.lastUpdated < CACHE_DURATION) {
    return schemaCache;
  }

  try {
    console.log('🔍 Executing GraphQL introspection query...');
    const response = await executeQuery(INTROSPECTION_QUERY);
    console.log('✅ GraphQL introspection query successful');

    const schema = response.__schema;
    
    console.log(`📋 Schema types found: ${schema.types?.length || 0}`);

    // Extract available fields and relationships
    const availableFields: Record<string, string[]> = {};
    const relationships: Record<string, Record<string, string>> = {};
    const fieldTypes: Record<string, Record<string, string>> = {};

    // Process each type in the schema
    schema.types.forEach((type: any) => {
      if (type.kind === "OBJECT" && REPORT_DOMAINS.includes(type.name)) {
        const domainName = type.name;
        const fields: string[] = [];
        const types: Record<string, string> = {};

        // Extract fields for this domain
        if (type.fields) {
          type.fields.forEach((field: any) => {
            try {
              if (field && field.name && !EXCLUDED_FIELDS.includes(field.name)) {
                fields.push(field.name);

                // Determine field type
                const fieldType = getFieldType(field.type);
                types[field.name] = fieldType;
              }
            } catch (fieldError) {
              console.warn(`⚠️ Error processing field ${field?.name} in ${domainName}:`, fieldError);
              // Continue processing other fields
            }
          });
        }

        availableFields[domainName] = fields;
        fieldTypes[domainName] = types;
        
        if (domainName === 'clients') {
          console.log(`🔍 Clients fields found:`, fields);
        }
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

    // Update cache
    schemaCache = {
      availableFields,
      relationships,
      fieldTypes,
      lastUpdated: Date.now(),
    };

    return schemaCache;
  } catch (error) {
    console.error("Schema introspection failed:", error);
    throw new Error("Failed to introspect GraphQL schema");
  }
}

function getFieldType(type: any): string {
  if (!type) {
    return "Unknown";
  }

  if (type.kind === "NON_NULL") {
    return getFieldType(type.ofType);
  }

  if (type.kind === "LIST") {
    const baseType = getFieldType(type.ofType);
    return `${baseType}[]`;
  }

  return type.name || "Unknown";
}

export const POST = withAuth(async (request: NextRequest, session) => {
  // Authorization check - require developer access for reports
  const userRole = session.role || session.defaultRole;
  const hasDeveloperAccess = userRole === 'developer';
  
  if (!hasDeveloperAccess) {
    return NextResponse.json(
      { error: "Developer access required for report generation" },
      { status: 403 }
    );
  }

  try {

    const body = await request.json();
    const validatedRequest = reportRequestSchema.parse(body);

    // Get schema via introspection
    const schema = await getSchemaViaIntrospection();

    // Validate that all requested domains exist
    const invalidDomains = validatedRequest.domains.filter(
      domain => !schema.availableFields[domain]
    );
    if (invalidDomains.length > 0) {
      return NextResponse.json(
        { error: `Invalid domains: ${invalidDomains.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate that all requested fields exist
    const invalidFields: string[] = [];
    Object.entries(validatedRequest.fields).forEach(([domain, fields]) => {
      const availableFields = schema.availableFields[domain] || [];
      fields.forEach(field => {
        if (!availableFields.includes(field)) {
          invalidFields.push(`${domain}.${field}`);
        }
      });
    });
    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid fields: ${invalidFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Build dynamic GraphQL query
    const query = buildDynamicQuery(validatedRequest, schema);
    
    console.log('🔍 Generated GraphQL query:', query);

    // Execute query using authenticated query helper
    const response = await executeQuery(gql`${query}`, validatedRequest.filters || {});
    
    console.log('📊 GraphQL response:', JSON.stringify(response, null, 2));
    
    if (!response) {
      throw new Error('No data returned from GraphQL query');
    }

    // Transform data for CSV export
    const transformedData = transformDataForExport(
      response,
      validatedRequest.domains,
      validatedRequest.fields,
      schema
    );

    // Log audit entry
    console.log(
      `[AUDIT] Report generated by user ${session.userId}: ${validatedRequest.domains.join(", ")} domains, ${Object.values(validatedRequest.fields).flat().length} fields`
    );

    return NextResponse.json({
      success: true,
      data: transformedData,
      query: query, // For debugging
      metadata: {
        totalRecords: transformedData.length,
        domains: validatedRequest.domains,
        fields: validatedRequest.fields,
        schemaVersion: new Date(schema.lastUpdated).toISOString(),
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to process report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});

function buildDynamicQuery(
  request: z.infer<typeof reportRequestSchema>,
  schema: any
): string {
  const {
    domains,
    fields,
    filters,
    sortBy,
    sortOrder,
    limit,
    includeRelationships,
  } = request;

  // Start with the primary domain (first in the array)
  const primaryDomain = domains[0];
  const primaryFields = fields[primaryDomain] || [];

  let query = `query GenerateReport`;

  // Add variables if there are filters
  const hasFilters = filters && Object.keys(filters).length > 0;
  if (hasFilters) {
    query += `(${Object.keys(filters)
      .map(key => `$${key}: ${getGraphQLType(key, schema)}`)
      .join(", ")})`;
  }

  query += ` {\n`;

  // Build the main query for the primary domain
  query += `  ${primaryDomain}`;

  // Add where clause if filters exist
  if (hasFilters) {
    query += `(where: {${Object.keys(filters)
      .map(key => `${key}: {_eq: $${key}}`)
      .join(", ")}})`;
  }

  // Add order by if specified
  if (sortBy) {
    query += `(order_by: {${sortBy}: ${sortOrder?.toUpperCase() || "ASC"}})`;
  }

  // Add limit if specified
  if (limit) {
    query += `(limit: ${limit})`;
  }

  query += ` {\n`;

  // Always include id field for Apollo cache normalization
  if (!primaryFields.includes('id')) {
    query += `    id\n`;
  }

  // Add primary domain fields
  primaryFields.forEach(field => {
    query += `    ${field}\n`;
  });

  // Add related domains if relationships are enabled
  if (includeRelationships && domains.length > 1) {
    for (let i = 1; i < domains.length; i++) {
      const domain = domains[i];
      const domainFields = fields[domain] || [];

      // Check if there's a relationship path from primary to this domain
      const relationshipPath = findRelationshipPath(
        primaryDomain,
        domain,
        schema
      );
      if (relationshipPath && domainFields.length > 0) {
        query += `    ${relationshipPath} {\n`;
        domainFields.forEach(field => {
          query += `      ${field}\n`;
        });
        query += `    }\n`;
      }
    }
  }

  query += `  }\n`;
  query += `}`;

  return query;
}

function findRelationshipPath(
  fromDomain: string,
  toDomain: string,
  schema: any
): string | null {
  const relationships = schema.relationships[fromDomain] || {};

  // Direct relationship
  if (relationships[toDomain]) {
    return relationships[toDomain];
  }

  // Check reverse relationship
  const reverseRelationships = schema.relationships[toDomain] || {};
  if (reverseRelationships[fromDomain]) {
    return reverseRelationships[fromDomain];
  }

  // For now, disable hardcoded relationships to avoid conflicts
  // TODO: Implement proper relationship detection from schema

  return null;
}

function getGraphQLType(fieldName: string, schema: any): string {
  // Try to determine type from schema if available
  // For now, use simple heuristics
  if (fieldName.includes("id")) return "uuid";
  if (fieldName.includes("date")) return "timestamptz";
  if (fieldName.includes("amount")) return "numeric";
  if (fieldName.includes("count")) return "Int";
  if (fieldName.includes("active")) return "Boolean";
  return "String";
}

function transformDataForExport(
  data: any,
  domains: string[],
  fields: Record<string, string[]>,
  schema: any
): any[] {
  const primaryDomain = domains[0];
  const primaryData = data[primaryDomain] || [];

  return primaryData.map((item: any) => {
    const transformedItem: any = {};

    // Add primary domain fields
    const primaryFields = fields[primaryDomain] || [];
    primaryFields.forEach(field => {
      transformedItem[`${primaryDomain}_${field}`] = item[field];
    });

    // Add related domain fields
    domains.slice(1).forEach(domain => {
      const domainFields = fields[domain] || [];
      const relationshipPath = findRelationshipPath(
        primaryDomain,
        domain,
        schema
      );

      if (relationshipPath && item[relationshipPath]) {
        const relatedData = Array.isArray(item[relationshipPath])
          ? item[relationshipPath]
          : [item[relationshipPath]];

        // For now, we'll take the first related item or create a summary
        if (relatedData.length > 0) {
          const relatedItem = relatedData[0];
          domainFields.forEach(field => {
            transformedItem[`${domain}_${field}`] = relatedItem[field];
          });

          // Add count for array relationships
          if (Array.isArray(item[relationshipPath])) {
            transformedItem[`${domain}_count`] = item[relationshipPath].length;
          }
        }
      }
    });

    return transformedItem;
  });
}

// GET endpoint to get available fields and relationships via introspection
export const GET = withAuth(async (request: NextRequest, session) => {
  console.log('📊 Reports API GET called');
  
  // Authorization check - require developer access
  const userRole = session.role || session.defaultRole;
  const hasDeveloperAccess = userRole === 'developer';
  
  if (!hasDeveloperAccess) {
    console.log('🚫 Reports API permission denied - developer role required');
    return NextResponse.json(
      { error: "Developer access required for schema introspection" },
      { status: 403 }
    );
  }

  console.log('✅ Reports API permission granted for developer');

  try {
    console.log('🔍 Starting schema introspection...');

    // Get schema via introspection
    const schema = await getSchemaViaIntrospection();
    
    console.log('✅ Schema introspection completed');

    return NextResponse.json({
      success: true,
      data: {
        availableFields: schema.availableFields,
        relationships: schema.relationships,
        fieldTypes: schema.fieldTypes,
        domains: REPORT_DOMAINS,
        schemaVersion: new Date(schema.lastUpdated).toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Report metadata error:", error);
    console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      {
        error: "Failed to get report metadata",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});
