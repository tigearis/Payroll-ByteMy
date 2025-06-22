// scripts/setup-e2e-tests.js
// Complete E2E test environment setup

import { execSync } from 'child_process';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function checkEnvironment() {
  console.log('🔍 Checking environment configuration...');
  
  const requiredVars = [
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 
    'E2E_HASURA_GRAPHQL_URL',
    'HASURA_ADMIN_SECRET',
    'E2E_DEVELOPER_EMAIL',
    'E2E_DEVELOPER_PASSWORD'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables in .env.test:');
    missing.forEach(varName => console.error(`   • ${varName}`));
    return false;
  }
  
  console.log('✅ Environment configuration looks good');
  return true;
}

async function checkServerStatus() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up E2E test environment...');
  
  // Check environment
  if (!checkEnvironment()) {
    console.error('\n❌ Environment check failed. Please configure .env.test');
    process.exit(1);
  }
  
  // Check if server is running for user sync
  const serverRunning = await checkServerStatus();
  
  const steps = [
    {
      command: 'pnpm test:users:create',
      description: 'Creating test users in Clerk'
    },
    {
      command: serverRunning ? 'pnpm test:users:sync' : 'echo "⚠️ Server not running - skipping user sync"', 
      description: serverRunning ? 'Syncing test users to database' : 'Skipping user sync (server not running)'
    },
    {
      command: 'pnpm test:data:reseed',
      description: 'Seeding test data'
    }
  ];
  
  let successCount = 0;
  
  for (const step of steps) {
    if (runCommand(step.command, step.description)) {
      successCount++;
    } else {
      console.log(`\n⚠️  Continuing with remaining steps...`);
    }
  }
  
  console.log('\n🎉 E2E test setup completed!');
  console.log(`\n📊 Results: ${successCount}/${steps.length} steps successful`);
  
  if (successCount === steps.length) {
    console.log('\n✅ All setup steps completed successfully!');
    if (serverRunning) {
      console.log('\n🚀 Ready to run E2E tests:');
      console.log('   pnpm test:e2e');
      console.log('   pnpm test:e2e:ui');
      console.log('   pnpm test:e2e:headed');
    } else {
      console.log('\n⚠️  User sync was skipped because server is not running.');
      console.log('\n🔧 To complete user sync:');
      console.log('   1. Start server: pnpm dev');
      console.log('   2. In another terminal: pnpm test:users:sync');
      console.log('   3. Then run: pnpm test:e2e');
    }
  } else {
    console.log('\n⚠️  Some setup steps failed. Check the logs above.');
    console.log('\n🔧 Manual setup commands:');
    console.log('   pnpm test:users:create     # Create test users');
    if (serverRunning) {
      console.log('   pnpm test:users:sync       # Sync users to database');
    } else {
      console.log('   pnpm dev                   # Start server first');
      console.log('   pnpm test:users:sync       # Then sync users');
    }
    console.log('   pnpm test:data:seed        # Seed test data');
  }
  
  console.log('\n📚 For detailed setup info, see:');
  console.log('   docs/TEST_DATA_GUIDE.md');
}

main().catch(console.error);