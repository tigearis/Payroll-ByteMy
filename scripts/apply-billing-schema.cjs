#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

function parseSQLStatements(sqlScript) {
  const statements = [];
  let currentStatement = '';
  let inFunction = false;
  let functionDelimiter = '';
  
  // Split by lines first to preserve structure
  const lines = sqlScript.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('--')) {
      continue;
    }
    
    currentStatement += line + '\n';
    
    // Check for function start
    if (!inFunction && trimmedLine.includes('$$')) {
      inFunction = true;
      functionDelimiter = '$$';
    }
    
    // Check for function end
    if (inFunction && trimmedLine.includes(functionDelimiter) && currentStatement.indexOf(functionDelimiter) < currentStatement.lastIndexOf(functionDelimiter)) {
      inFunction = false;
      functionDelimiter = '';
    }
    
    // Check for statement end
    if (!inFunction && trimmedLine.endsWith(';')) {
      const statement = currentStatement.trim();
      if (statement) {
        statements.push(statement);
      }
      currentStatement = '';
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements;
}

async function applyBillingSchema() {
  try {
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable not found');
    }

    console.log('🔧 Connecting to database...');
    const sql = neon(databaseUrl);

    // Read the SQL script
    const sqlScript = fs.readFileSync(path.join(__dirname, '..', 'step1_create_tables.sql'), 'utf8');
    
    console.log('📋 Applying billing system schema changes...');
    
    // Execute the entire script at once
    try {
      await sql(sqlScript);
      console.log('✅ Successfully applied all database changes!');
    } catch (error) {
      // If that fails, try statement by statement
      console.log('⚠️  Bulk execution failed, trying individual statements...');
      
      // Better SQL statement parsing that handles functions
      const statements = parseSQLStatements(sqlScript);

      let successCount = 0;
      
      for (const statement of statements) {
        try {
          if (statement.trim()) {
            await sql(statement);
            successCount++;
            console.log(`✅ Executed statement ${successCount}`);
          }
        } catch (stmtError) {
          // Log but continue for "already exists" errors
          if (stmtError.message.includes('already exists') || 
              stmtError.message.includes('does not exist') ||
              stmtError.message.includes('duplicate key')) {
            console.log(`⚠️  Statement ${successCount + 1}: ${stmtError.message}`);
            successCount++;
          } else {
            console.error(`❌ Error in statement ${successCount + 1}:`, stmtError.message);
            throw stmtError;
          }
        }
      }
    }

    console.log(`\n🎉 Successfully applied database changes!`);
    console.log('✅ Billing system schema is now ready');

  } catch (error) {
    console.error('❌ Failed to apply billing schema:', error.message);
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  // Load environment variables
  require('dotenv').config({ path: '.env.development.local' });
  
  applyBillingSchema()
    .then(() => {
      console.log('\n📊 Next steps:');
      console.log('1. Run `pnpm hasura:metadata` to apply metadata changes');
      console.log('2. Run `pnpm codegen` to regenerate GraphQL types');
      console.log('3. Test billing functionality');
      process.exit(0);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { applyBillingSchema };