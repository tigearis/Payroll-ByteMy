#!/usr/bin/env node

// Debug environment variable loading
console.log('🔍 Debugging environment variable loading...\n');

// Check what files exist
const fs = require('fs');
const path = require('path');

const envFiles = ['.env', '.env.local', '.env.development', '.env.development.local'];

console.log('📁 Environment files found:');
envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stat = fs.statSync(file);
    console.log(`  ✅ ${file} (modified: ${stat.mtime.toISOString()})`);
  } else {
    console.log(`  ❌ ${file} (not found)`);
  }
});

console.log('\n🔧 Loading environment with dotenv...');
// Load in the correct order - .env.local should override .env.development.local
require('dotenv').config({ path: '.env.development.local' });
require('dotenv').config({ path: '.env.local', override: true });

console.log('\n📋 Current DATABASE_URL configuration:');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
console.log(`PGHOST: ${process.env.PGHOST}`);
console.log(`PGDATABASE: ${process.env.PGDATABASE}`);
console.log(`PGUSER: ${process.env.PGUSER}`);

// Check if it contains neon
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon')) {
  console.log('\n❌ ERROR: DATABASE_URL still points to Neon!');
  console.log('This indicates an environment loading issue.');
} else if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('192.168.1.229')) {
  console.log('\n✅ SUCCESS: DATABASE_URL points to local PostgreSQL');
} else {
  console.log('\n❓ UNKNOWN: DATABASE_URL does not match expected patterns');
}

console.log('\n🔍 Checking all environment files for DATABASE_URL...');
envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const dbUrls = content.match(/DATABASE_URL=.*/g);
    if (dbUrls) {
      console.log(`\n📄 ${file}:`);
      dbUrls.forEach(url => {
        console.log(`  ${url}`);
      });
    }
  }
});