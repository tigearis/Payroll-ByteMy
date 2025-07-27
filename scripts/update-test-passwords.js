// scripts/update-test-passwords.js
// Script to update passwords for existing test users

import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

// Updated with secure passwords and correct email addresses from env files
const passwordUpdates = [
  {
    email: 'admin@example.com',
    newPassword: 'PayrollAdmin2024!@#$SecureKey89',
    role: 'org_admin'
  },
  {
    email: 'manager@example.com',
    newPassword: 'PayrollMgr2024!@#$SecureKey90',
    role: 'manager'
  },
  {
    email: 'developer@example.com',
    newPassword: 'PayrollDev2024!@#$SecureKey91',
    role: 'developer'
  },
  {
    email: 'consultant@example.com',
    newPassword: 'PayrollCon2024!@#$SecureKey92',
    role: 'consultant'
  },
  {
    email: 'viewer@example.com',
    newPassword: 'PayrollView2024!@#$SecureKey93',
    role: 'viewer'
  },
];

async function updateUserPasswords() {
  console.log('🔐 Updating test user passwords...');
  
  if (!process.env.CLERK_SECRET_KEY || !process.env.CLERKSECRET_KEY.startsWith('sk_test_')) {
    console.error('❌ Error: CLERK_SECRET_KEY must be a test environment key (starts with sk_test_)');
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const update of passwordUpdates) {
    try {
      console.log(`\n🔑 Updating password for: ${update.email} (${update.role})`);
      
      // Find user by email
      const { data: usersData, totalCount } = await clerk.users.getUserList({
        emailAddress: [update.email]
      });
      if (!usersData || usersData.length === 0) {
        console.log(`⚠️  User ${update.email} not found, skipping...`);
        continue;
      }

      const user = usersData[0];
      console.log(`   📧 Found user: ${user.emailAddresses[0]?.emailAddress} (ID: ${user.id})`);
      
      // Update the user's password (server-side admin update)
      await clerk.users.updateUser(user.id, {
        password: update.newPassword,
      });

      console.log(`✅ Successfully updated password for: ${update.email} (${update.role})`);
      console.log(`   🔐 New password length: ${update.newPassword.length} characters`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error updating password for ${update.email} (${update.role}):`);
      console.error(`   Error: ${error.message}`);
      if (error.errors) {
        error.errors.forEach(err => {
          console.error(`   - ${err.message} (${err.code})`);
        });
      }
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Successfully updated: ${successCount} passwords`);
  console.log(`❌ Errors: ${errorCount} passwords`);
  
  if (successCount > 0) {
    console.log('\n🎉 Passwords updated successfully!');
    console.log('\nNext steps:');
    console.log('1. Test authentication: pnpm test:e2e auth.setup.ts');
    console.log('2. Run full test suite: pnpm test:e2e');
  }

  if (errorCount > 0) {
    console.log('\n⚠️  Some passwords failed to update. Please check the errors above.');
  }
}

updateUserPasswords();