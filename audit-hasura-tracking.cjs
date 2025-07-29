/**
 * Audit Hasura Tracking vs Database Schema
 * Compares actual database tables/columns with what Hasura is tracking
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function loadDatabaseUrl() {
  const envFiles = ['.env.development.local', '.env.local', '.env'];
  
  for (const envFile of envFiles) {
    const envPath = path.resolve(envFile);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('DATABASE_URL=')) {
          return line.split('=')[1].trim().replace(/['"]/g, '');
        }
      }
    }
  }
  
  throw new Error('DATABASE_URL not found in environment files');
}

function extractGraphQLTables() {
  const schemaContent = fs.readFileSync('shared/schema/schema.graphql', 'utf8');
  
  // Extract table types (not aggregates or utility types)
  const tableMatches = schemaContent.match(/^type ([a-z][a-zA-Z0-9_]*) \{/gm);
  if (!tableMatches) return [];
  
  return tableMatches
    .map(match => match.replace(/^type ([a-z][a-zA-Z0-9_]*) \{/, '$1'))
    .filter(name => !name.includes('Aggregate') && 
                   !name.includes('Response') && 
                   !name.includes('Result') &&
                   !name.includes('Input') &&
                   !name.includes('Comparison') &&
                   !name.includes('Order') &&
                   !name.includes('Insert') &&
                   !name.includes('Update') &&
                   !name.includes('Boolean') &&
                   !name.includes('Mutation') &&
                   !name.includes('Fields') &&
                   !name.includes('_root') &&
                   !name.includes('Sum') &&
                   !name.includes('Max') &&
                   !name.includes('Min') &&
                   !name.includes('Avg') &&
                   !name.includes('Stddev') &&
                   !name.includes('Variance') &&
                   !name.includes('VarPop') &&
                   !name.includes('VarSamp'))
    .sort();
}

async function getDatabaseTables(client) {
  const result = await client.query(`
    SELECT 
      schemaname,
      tablename,
      schemaname || '.' || tablename as full_name
    FROM pg_tables 
    WHERE schemaname IN ('public', 'audit')
    ORDER BY schemaname, tablename
  `);
  
  return result.rows;
}

async function getTableColumns(client, schemaName, tableName) {
  const result = await client.query(`
    SELECT 
      column_name,
      data_type,
      is_nullable,
      column_default,
      udt_name
    FROM information_schema.columns 
    WHERE table_schema = $1 AND table_name = $2
    ORDER BY ordinal_position
  `, [schemaName, tableName]);
  
  return result.rows;
}

function convertTableNameToGraphQL(tableName) {
  // Convert snake_case to camelCase for GraphQL comparison
  return tableName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function convertColumnNameToGraphQL(columnName) {
  // Convert snake_case to camelCase
  return columnName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function getGraphQLFieldsForTable(schemaContent, tableName) {
  // Try both camelCase and original name
  const camelCaseName = convertTableNameToGraphQL(tableName);
  
  const typeRegex = new RegExp(`type ${camelCaseName} \\{([\\s\\S]*?)^\\}`, 'm');
  const match = schemaContent.match(typeRegex);
  
  if (!match) {
    // Try original name
    const originalRegex = new RegExp(`type ${tableName} \\{([\\s\\S]*?)^\\}`, 'm');
    const originalMatch = schemaContent.match(originalRegex);
    if (!originalMatch) return [];
    return extractFieldsFromTypeDefinition(originalMatch[1]);
  }
  
  return extractFieldsFromTypeDefinition(match[1]);
}

function extractFieldsFromTypeDefinition(typeBody) {
  const fieldLines = typeBody.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('"""') && !line.startsWith('*'));
  
  const fields = [];
  
  for (let i = 0; i < fieldLines.length; i++) {
    const line = fieldLines[i];
    
    // Skip comment blocks
    if (line.startsWith('"""')) {
      // Find end of comment block
      while (i < fieldLines.length && !fieldLines[i].endsWith('"""')) {
        i++;
      }
      continue;
    }
    
    // Extract field name and type
    const fieldMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:\([^)]*\))?\s*:\s*(.+?)(?:\s*$|\s*!$)/);
    if (fieldMatch) {
      fields.push({
        name: fieldMatch[1],
        type: fieldMatch[2].replace(/!$/, '').trim()
      });
    }
  }
  
  return fields;
}

async function auditHasuraTracking() {
  const databaseUrl = loadDatabaseUrl();
  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    console.log('🔍 Auditing Hasura tracking vs Database schema...\n');

    // Get database tables
    const dbTables = await getDatabaseTables(client);
    console.log(`📊 Found ${dbTables.length} tables in database\n`);

    // Get GraphQL tables
    const schemaContent = fs.readFileSync('shared/schema/schema.graphql', 'utf8');
    const graphqlTables = extractGraphQLTables();
    console.log(`📊 Found ${graphqlTables.length} tracked tables in GraphQL schema\n`);

    console.log('=== TRACKING COMPARISON ===\n');

    // Check for untracked tables
    const untracked = [];
    const tracked = [];
    const missingColumns = [];
    const extraColumns = [];

    for (const dbTable of dbTables) {
      const { schemaname, tablename, full_name } = dbTable;
      
      // Skip system tables
      if (schemaname === 'hdb_catalog' || tablename.startsWith('hdb_')) continue;
      
      const camelCaseName = convertTableNameToGraphQL(tablename);
      const isTracked = graphqlTables.includes(camelCaseName) || graphqlTables.includes(tablename);
      
      if (isTracked) {
        tracked.push(full_name);
        
        // Check column consistency for tracked tables
        const dbColumns = await getTableColumns(client, schemaname, tablename);
        const graphqlFields = getGraphQLFieldsForTable(schemaContent, tablename);
        
        // Compare columns
        for (const column of dbColumns) {
          const graphqlFieldName = convertColumnNameToGraphQL(column.column_name);
          const hasField = graphqlFields.some(f => 
            f.name === column.column_name || f.name === graphqlFieldName
          );
          
          if (!hasField && !column.column_name.endsWith('_id') && column.column_name !== 'id') {
            missingColumns.push({
              table: full_name,
              column: column.column_name,
              type: column.data_type
            });
          }
        }
        
      } else {
        untracked.push(full_name);
      }
    }

    // Check for orphaned GraphQL types
    const orphanedTypes = [];
    for (const graphqlTable of graphqlTables) {
      const matchingDbTable = dbTables.find(t => 
        convertTableNameToGraphQL(t.tablename) === graphqlTable || 
        t.tablename === graphqlTable
      );
      
      if (!matchingDbTable) {
        orphanedTypes.push(graphqlTable);
      }
    }

    // Print results
    console.log('✅ TRACKED TABLES:');
    tracked.forEach(table => console.log(`   ${table}`));
    
    console.log('\n❌ UNTRACKED TABLES:');
    untracked.forEach(table => console.log(`   ${table}`));
    
    console.log('\n👻 ORPHANED GRAPHQL TYPES:');
    orphanedTypes.forEach(type => console.log(`   ${type}`));
    
    console.log('\n⚠️  MISSING COLUMNS IN GRAPHQL:');
    missingColumns.forEach(col => console.log(`   ${col.table}.${col.column} (${col.type})`));

    // Special focus on users table
    console.log('\n=== USERS TABLE DETAILED AUDIT ===');
    const usersColumns = await getTableColumns(client, 'public', 'users');
    console.log('\nDatabase columns:');
    usersColumns.forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''})`);
    });
    
    const usersGraphQLFields = getGraphQLFieldsForTable(schemaContent, 'users');
    console.log('\nGraphQL fields:');
    usersGraphQLFields.forEach(field => {
      console.log(`  ${field.name}: ${field.type}`);
    });

    // Check specific new columns
    const newColumns = ['first_name', 'last_name', 'computed_name'];
    console.log('\nNew firstName/lastName columns:');
    for (const colName of newColumns) {
      const dbColumn = usersColumns.find(c => c.column_name === colName);
      const graphqlField = usersGraphQLFields.find(f => 
        f.name === colName || f.name === convertColumnNameToGraphQL(colName)
      );
      
      console.log(`  ${colName}:`);
      console.log(`    Database: ${dbColumn ? '✅ EXISTS' : '❌ MISSING'}`);
      console.log(`    GraphQL: ${graphqlField ? '✅ TRACKED' : '❌ NOT TRACKED'}`);
    }

    console.log('\n=== RECOMMENDATIONS ===');
    
    if (untracked.length > 0) {
      console.log('\n1. TRACK MISSING TABLES:');
      untracked.forEach(table => {
        console.log(`   hasura metadata apply-metadata # Add ${table} to tracking`);
      });
    }
    
    if (missingColumns.length > 0) {
      console.log('\n2. REFRESH TRACKED TABLES:');
      const uniqueTables = [...new Set(missingColumns.map(c => c.table))];
      uniqueTables.forEach(table => {
        console.log(`   # Refresh ${table} to pick up new columns`);
      });
    }
    
    if (orphanedTypes.length > 0) {
      console.log('\n3. REMOVE ORPHANED TYPES:');
      orphanedTypes.forEach(type => {
        console.log(`   # Remove ${type} from Hasura metadata`);
      });
    }

    console.log('\n✅ Audit complete');

  } catch (error) {
    console.error('❌ Audit failed:', error);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  auditHasuraTracking().catch(console.error);
}

module.exports = { auditHasuraTracking };