// scripts/update-test-passwords.js
// Script to update passwords for existing test users

import { createClerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

const passwordUpdates = [
  {
    email: 'developer@test.payroll.com',
    newPassword: 'DevSecure789!xyz',
  },
  {
    email: 'orgadmin@test.payroll.com',
    newPassword: 'OrgAdmin789!xyz',
  },
  {
    email: 'manager@test.payroll.com',
    newPassword: 'Manager789!xyz',
  },
  {
    email: 'consultant@test.payroll.com',
    newPassword: 'Consultant789!xyz',
  },
  {
    email: 'viewer@test.payroll.com',
    newPassword: 'Viewer789!xyz',
  },
  {
    email: 'test@payroll.com',
    newPassword: 'General789!xyz',
  },
];

async function updateUserPasswords() {
  console.log('🔐 Updating test user passwords...');
  
  if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_SECRET_KEY.startsWith('sk_test_')) {
    console.error('❌ Error: CLERK_SECRET_KEY must be a test environment key (starts with sk_test_)');
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const update of passwordUpdates) {
    try {
      console.log(`\n🔑 Updating password for: ${update.email}`);
      
      // Find user by email
      const users = await clerk.users.getUserList({
        emailAddress: [update.email]
      });

      const usersData = users.data || users;
      if (!usersData || usersData.length === 0) {
        console.log(`⚠️  User ${update.email} not found, skipping...`);
        continue;
      }

      const user = usersData[0];
      
      // Update the user's password
      await clerk.users.updateUser(user.id, {
        password: update.newPassword,
      });

      console.log(`✅ Successfully updated password for: ${update.email}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error updating password for ${update.email}:`);
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