#!/usr/bin/env node

import pg from 'pg';
import dotenv from 'dotenv';

const { Client } = pg;
dotenv.config({ path: '.env.test' });

const DATABASE_URL = "postgres://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require";

async function checkEnumValues() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Get all enum types and their values
    const enumResult = await client.query(`
      SELECT t.typname as enum_name, e.enumlabel as enum_value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname IN ('user_position', 'userrole', 'user_status')
      ORDER BY t.typname, e.enumsortorder;
    `);

    console.log('📋 Available enum values:');
    let currentEnum = '';
    enumResult.rows.forEach(row => {
      if (row.enum_name !== currentEnum) {
        console.log(`\n${row.enum_name}:`);
        currentEnum = row.enum_name;
      }
      console.log(`   - ${row.enum_value}`);
    });

    // Also check existing user positions in use
    const existingPositions = await client.query(`
      SELECT DISTINCT position 
      FROM users 
      WHERE position IS NOT NULL 
      ORDER BY position;
    `);

    console.log('\n📊 Existing positions in use:');
    existingPositions.rows.forEach(row => {
      console.log(`   - ${row.position}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkEnumValues();