/**
 * GraphQL Schema Parser for AI Assistant
 * 
 * Parses introspection.json to generate comprehensive schema context
 * for improved AI query generation and natural language understanding
 */

import fs from 'fs';
import path from 'path';

interface GraphQLType {
  kind: string;
  name: string;
  fields?: GraphQLField[];
  inputFields?: GraphQLInputField[];
  possibleTypes?: GraphQLType[];
  ofType?: GraphQLType;
}

interface GraphQLField {
  name: string;
  type: GraphQLType;
  args?: GraphQLInputField[];
  description?: string;
}

interface GraphQLInputField {
  name: string;
  type: GraphQLType;
  description?: string;
  defaultValue?: any;
}

interface IntrospectionResult {
  __schema: {
    queryType: GraphQLType;
    mutationType?: GraphQLType;
    subscriptionType?: GraphQLType;
    types: GraphQLType[];
  };
}

interface ParsedTable {
  name: string;
  fields: ParsedField[];
  relationships: ParsedRelationship[];
  aggregateFields: string[];
  filterOperators: string[];
}

interface ParsedField {
  name: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  description?: string;
  isRelationship: boolean;
}

interface ParsedRelationship {
  name: string;
  targetTable: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  description?: string;
}

class SchemaParser {
  private introspection: IntrospectionResult | null = null;
  private parsedTables: Map<string, ParsedTable> = new Map();

  /**
   * Load and parse the introspection schema
   */
  async loadSchema(): Promise<void> {
    try {
      const introspectionPath = path.join(process.cwd(), 'shared/schema/introspection.json');
      const introspectionData = fs.readFileSync(introspectionPath, 'utf-8');
      this.introspection = JSON.parse(introspectionData);
      
      console.log('✅ [Schema Parser] Loaded introspection schema');
      
      // Parse all table types
      await this.parseAllTables();
      
      console.log(`✅ [Schema Parser] Parsed ${this.parsedTables.size} tables`);
    } catch (error) {
      console.error('❌ [Schema Parser] Failed to load schema:', error);
      throw error;
    }
  }

  /**
   * Parse all table types from the introspection
   */
  private async parseAllTables(): Promise<void> {
    if (!this.introspection) {
      throw new Error('Schema not loaded');
    }

    // Find the query root type
    const queryType = this.introspection.schema.types.find(
      type => type.name === 'query_root'
    );

    if (!queryType || !queryType.fields) {
      throw new Error('Query root type not found');
    }

    // Parse each table field
    for (const field of queryType.fields) {
      const tableName = field.name;
      
      // Skip aggregate and subscription fields
      if (tableName.endsWith('Aggregate') || tableName.startsWith('_')) {
        continue;
      }

      // Find the corresponding table type
      const tableType = this.findTableType(field.type);
      if (tableType) {
        const parsedTable = this.parseTableType(tableName, tableType);
        this.parsedTables.set(tableName, parsedTable);
      }
    }
  }

  /**
   * Find the actual table type from a field type (handling lists and non-nulls)
   */
  private findTableType(fieldType: GraphQLType): GraphQLType | null {
    let currentType = fieldType;
    
    // Unwrap LIST and NON_NULL wrappers
    while (currentType.ofType) {
      currentType = currentType.ofType;
    }
    
    // Find the type definition in the schema
    if (this.introspection) {
      return this.introspection.schema.types.find(
        type => type.name === currentType.name && type.kind === 'OBJECT'
      ) || null;
    }
    
    return null;
  }

  /**
   * Parse a table type into our structured format
   */
  private parseTableType(tableName: string, tableType: GraphQLType): ParsedTable {
    const fields: ParsedField[] = [];
    const relationships: ParsedRelationship[] = [];
    const aggregateFields: string[] = [];

    if (tableType.fields) {
      for (const field of tableType.fields) {
        const parsedField = this.parseField(field);
        fields.push(parsedField);

        // Check if this is a relationship field
        if (parsedField.isRelationship) {
          const relationship = this.parseRelationship(field, tableName);
          if (relationship) {
            relationships.push(relationship);
          }
        }

        // Check for aggregate fields
        if (field.name.endsWith('Aggregate') || field.name.includes('aggregate')) {
          aggregateFields.push(field.name);
        }
      }
    }

    return {
      name: tableName,
      fields,
      relationships,
      aggregateFields,
      filterOperators: this.getFilterOperators(tableName),
    };
  }

  /**
   * Parse a field into our structured format
   */
  private parseField(field: GraphQLField): ParsedField {
    const typeInfo = this.analyzeFieldType(field.type);
    
    return {
      name: field.name,
      type: typeInfo.baseType,
      isRequired: typeInfo.isRequired,
      isList: typeInfo.isList,
      ...(field.description && { description: field.description }),
      isRelationship: this.isRelationshipField(field),
    };
  }

  /**
   * Analyze a GraphQL type to extract base type, nullability, and list info
   */
  private analyzeFieldType(fieldType: GraphQLType): {
    baseType: string;
    isRequired: boolean;
    isList: boolean;
  } {
    let currentType = fieldType;
    let isRequired = false;
    let isList = false;

    // Handle NON_NULL wrapper
    if (currentType.kind === 'NON_NULL') {
      isRequired = true;
      currentType = currentType.ofType!;
    }

    // Handle LIST wrapper
    if (currentType.kind === 'LIST') {
      isList = true;
      currentType = currentType.ofType!;
      
      // Handle NON_NULL inside LIST
      if (currentType.kind === 'NON_NULL') {
        currentType = currentType.ofType!;
      }
    }

    return {
      baseType: currentType.name || 'Unknown',
      isRequired,
      isList,
    };
  }

  /**
   * Check if a field represents a relationship
   */
  private isRelationshipField(field: GraphQLField): boolean {
    const typeInfo = this.analyzeFieldType(field.type);
    
    // If the base type is not a scalar type, it's likely a relationship
    const scalarTypes = ['String', 'Int', 'Float', 'Boolean', 'ID', 'uuid', 'timestamptz', 'date', 'numeric', 'bigint', 'json', 'jsonb'];
    return !scalarTypes.includes(typeInfo.baseType) && !typeInfo.baseType.endsWith('_enum');
  }

  /**
   * Parse relationship information
   */
  private parseRelationship(field: GraphQLField, tableName: string): ParsedRelationship | null {
    const typeInfo = this.analyzeFieldType(field.type);
    
    if (!this.isRelationshipField(field)) {
      return null;
    }

    // Determine relationship type based on field characteristics
    let relType: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many' = 'many-to-one';
    
    if (typeInfo.isList) {
      relType = 'one-to-many';
    } else if (field.name.endsWith('Id') || field.name.includes('_id')) {
      relType = 'many-to-one';
    }

    return {
      name: field.name,
      targetTable: typeInfo.baseType,
      type: relType,
      ...(field.description && { description: field.description }),
    };
  }

  /**
   * Get available filter operators for a table
   */
  private getFilterOperators(tableName: string): string[] {
    // Common Hasura filter operators
    return ['_eq', '_neq', '_gt', '_gte', '_lt', '_lte', '_in', '_nin', '_like', '_ilike', '_is_null'];
  }

  /**
   * Generate comprehensive schema context for AI
   */
  generateSchemaContext(): string {
    if (this.parsedTables.size === 0) {
      return this.getFallbackSchemaContext();
    }

    let context = `# GraphQL Schema Context - Enterprise Payroll Management System

## Available Tables and Comprehensive Field Information

The following tables are available for querying with their complete field structures, relationships, and business context:

`;

    // Group tables by business domain
    const businessTables = this.getBusinessTables();
    const systemTables = this.getSystemTables();

    context += `## Core Business Tables (Primary Focus for User Queries)\n\n`;
    
    for (const [tableName, table] of businessTables) {
      context += this.generateTableDocumentation(table);
    }

    context += `## Supporting System Tables (Available but less commonly used)\n\n`;
    
    for (const [tableName, table] of systemTables) {
      context += this.generateTableDocumentation(table, true);
    }

    context += this.generateQueryPatterns();
    context += this.generateBusinessContext();

    return context;
  }

  /**
   * Get core business tables
   */
  private getBusinessTables(): Map<string, ParsedTable> {
    const businessTableNames = [
      'clients', 'payrolls', 'users', 'workSchedule', 'timeEntries', 
      'billingItems', 'payrollDates', 'notes', 'leave', 'userSkill'
    ];
    
    const businessTables = new Map<string, ParsedTable>();
    
    for (const name of businessTableNames) {
      const table = this.parsedTables.get(name);
      if (table) {
        businessTables.set(name, table);
      }
    }
    
    return businessTables;
  }

  /**
   * Get system/support tables
   */
  private getSystemTables(): Map<string, ParsedTable> {
    const businessTableNames = new Set([
      'clients', 'payrolls', 'users', 'workSchedule', 'timeEntries', 
      'billingItems', 'payrollDates', 'notes', 'leave', 'userSkill'
    ]);
    
    const systemTables = new Map<string, ParsedTable>();
    
    for (const [name, table] of this.parsedTables) {
      if (!businessTableNames.has(name)) {
        systemTables.set(name, table);
      }
    }
    
    return systemTables;
  }

  /**
   * Generate documentation for a single table
   */
  private generateTableDocumentation(table: ParsedTable, isSystemTable = false): string {
    let doc = `### ${table.name}\n`;

    // Core fields
    const coreFields = table.fields.filter(f => !f.isRelationship);
    if (coreFields.length > 0) {
      doc += `**Core Fields:**\n`;
      for (const field of coreFields) {
        const required = field.isRequired ? '!' : '';
        const list = field.isList ? '[]' : '';
        doc += `- ${field.name}: ${field.type}${list}${required}`;
        if (field.description) {
          doc += ` - ${field.description}`;
        }
        doc += '\n';
      }
      doc += '\n';
    }

    // Relationships (only for business tables)
    if (!isSystemTable && table.relationships.length > 0) {
      doc += `**Relationships:**\n`;
      for (const rel of table.relationships) {
        doc += `- ${rel.name} → ${rel.targetTable} (${rel.type})`;
        if (rel.description) {
          doc += ` - ${rel.description}`;
        }
        doc += '\n';
      }
      doc += '\n';
    }

    return doc;
  }

  /**
   * Generate query patterns and examples
   */
  private generateQueryPatterns(): string {
    return `
## Common Query Patterns and Best Practices

### Basic Query Structure
\`\`\`graphql
query QueryName {
  tableName(
    where: { field: { _eq: "value" } }
    orderBy: { field: ASC }
    limit: 10
  ) {
    field1
    field2
    relationship {
      relatedField
    }
  }
}
\`\`\`

### Filter Operators Available
- **Equality**: \`_eq\`, \`_neq\`
- **Comparison**: \`_gt\`, \`_gte\`, \`_lt\`, \`_lte\`
- **List Operations**: \`_in\`, \`_nin\`
- **Text Search**: \`_like\`, \`_ilike\`
- **Null Checks**: \`_is_null\`

### Relationship Queries
- Use nested selection to fetch related data
- Example: \`client {{ name contactEmail }}\` within a payroll query
- Prefer specific field selection over \`*\` for performance

### Performance Guidelines
- Always include \`limit\` for large datasets
- Use \`order_by\` for consistent results
- Select only needed fields
- Use appropriate filters to reduce result sets

`;
  }

  /**
   * Generate business context and common use cases
   */
  private generateBusinessContext(): string {
    return `
## Business Context and Common Use Cases

### Payroll Management Queries
- Active payrolls with client information
- Payrolls by status, date range, or consultant
- Payroll profitability and performance metrics
- Time tracking and hours analysis

### Client Management Queries  
- Active clients with contact information
- Client billing status and invoice history
- Client-payroll relationships and activity
- Client profitability and revenue analysis

### Staff and Resource Management
- User capacity and work schedule analysis
- Skill matching for payroll assignments
- Team performance and utilization metrics
- Leave management and availability

### Financial and Billing Queries
- Revenue analysis by client/payroll/period
- Time entry summaries and billing rates
- Invoice generation and payment tracking
- Profitability analysis and cost management

### Reporting and Analytics
- Dashboard metrics and KPIs
- Period-over-period comparisons
- Resource utilization reports
- Client satisfaction and retention metrics

## Field Naming Conventions
- Use camelCase for field names: \`contactEmail\`, \`createdAt\`, \`startDate\`
- Boolean fields often start with \`is\`: \`isActive\`, \`isStaff\`
- ID fields end with \`Id\`: \`clientId\`, \`userId\`, \`payrollId\`
- Timestamp fields often end with \`At\`: \`createdAt\`, \`updatedAt\`

`;
  }

  /**
   * Fallback schema context if parsing fails
   */
  private getFallbackSchemaContext(): string {
    return `
# Basic Schema Context (Fallback)

## Core Business Tables
- clients: id, name, active, contactEmail, contactPerson, contactPhone
- payrolls: id, name, status, clientId, startDate, endDate, managerId
- users: id, name, email, position, role, status, isActive
- workSchedule: id, userId, workDay, workHours, adminTimeHours
- timeEntries: id, clientId, payrollId, hoursSpent, description
- billingItems: id, clientId, payrollId, amount, status

## Common Query Patterns
- Use where: {{ field: {{ _eq: value }} }} for filtering
- Use order_by: {{ field: asc/desc }} for sorting
- Use limit: N to control result size
- Use nested selection for relationships

`;
  }

  /**
   * Get specific table information
   */
  getTableInfo(tableName: string): ParsedTable | null {
    return this.parsedTables.get(tableName) || null;
  }

  /**
   * Get all available table names
   */
  getAvailableTables(): string[] {
    return Array.from(this.parsedTables.keys());
  }

  /**
   * Check if a table exists
   */
  hasTable(tableName: string): boolean {
    return this.parsedTables.has(tableName);
  }
}

// Singleton instance
let schemaParserInstance: SchemaParser | null = null;

/**
 * Get the singleton schema parser instance
 */
export async function getSchemaParser(): Promise<SchemaParser> {
  if (!schemaParserInstance) {
    schemaParserInstance = new SchemaParser();
    await schemaParserInstance.loadSchema();
  }
  return schemaParserInstance;
}

/**
 * Generate comprehensive schema context for AI
 */
export async function generateSchemaContext(): Promise<string> {
  try {
    const parser = await getSchemaParser();
    return parser.generateSchemaContext();
  } catch (error) {
    console.error('❌ [Schema Parser] Failed to generate schema context:', error);
    
    // Return a basic fallback context
    const parser = new SchemaParser();
    return parser.generateSchemaContext();
  }
}

// Export types
export type { ParsedTable, ParsedField, ParsedRelationship };