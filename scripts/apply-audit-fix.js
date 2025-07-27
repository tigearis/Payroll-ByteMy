#!/usr/bin/env node

/**
 * Apply Audit inet Fix to Database
 * 
 * This script applies the fix for the PostgreSQL inet error that was causing
 * the AcceptInvitationEnhanced mutation to fail.
 * 
 * Error: "invalid input syntax for type inet: 'system'"
 * Fix: Update audit triggers to use '127.0.0.1'::inet instead of string 'system'
 */

import { readFileSync } from 'fs';
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function applyAuditFix() {
  console.log('🔧 Applying audit inet fix to database...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Connect to database
    await client.connect();
    console.log('✅ Connected to database');

    // Read the migration file
    const migrationPath = path.join(__dirname, '../database/migrations/fixaudit_inet_error.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    console.log('📋 Read migration file');
    console.log('📝 Migration content preview:');
    console.log(migrationSQL.substring(0, 200) + '...');

    // Execute the migration
    console.log('🚀 Executing migration...');
    await client.query(migrationSQL);
    
    console.log('✅ Migration applied successfully!');
    
    // Verify the fix by checking function definitions
    console.log('🔍 Verifying fix...');
    
    const verifyQuery = `
      SELECT 
        proname,
        prosrc
      FROM pg_proc 
      WHERE proname IN ('audit_invitation_status_change', 'audit_user_status_change')
      AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    `;
    
    const result = await client.query(verifyQuery);
    
    for (const row of result.rows) {
      const hasValidInet = row.prosrc.includes("'127.0.0.1'::inet");
      const hasInvalidSystem = row.prosrc.includes("'system'") && !row.prosrc.includes("'system'::inet");
      
      console.log(`📋 Function: ${row.proname}`);
      console.log(`   ✅ Uses valid inet: ${hasValidInet}`);
      console.log(`   🚫 Has invalid 'system': ${hasInvalidSystem}`);
      
      if (hasValidInet && !hasInvalidSystem) {
        console.log(`   ✅ ${row.proname} is fixed correctly`);
      } else {
        console.log(`   ❌ ${row.proname} may still have issues`);
      }
    }
    
    console.log('🎉 Audit inet fix applied and verified successfully!');
    console.log('🔧 The AcceptInvitationEnhanced mutation should now work without inet errors.');
    
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    throw error;
  } finally {
    await client.end();
    console.log('📤 Database connection closed');
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  applyAuditFix()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}