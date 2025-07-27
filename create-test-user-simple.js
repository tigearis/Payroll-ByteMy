// Simple test user creation without complex dependencies
import { clerkClient } from '@clerk/nextjs/server';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

async function createTestUser() {
  try {
    console.log('🔐 Creating test admin user...');
    
    const adminEmail = process.env.E2E_ORG_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.E2E_ORG_ADMIN_PASSWORD || 'Admin1';
    
    console.log(`📧 Email: ${adminEmail}`);
    
    // Check if user already exists
    try {
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: [adminEmail]
      });
      
      if (existingUsers.length > 0) {
        console.log('✅ User already exists:', existingUsers[0].id);
        return existingUsers[0];
      }
    } catch (error) {
      console.log('🔍 Checking for existing user failed, continuing with creation...');
    }
    
    // Create new user
    const user = await clerkClient.users.createUser({
      emailAddress: [adminEmail],
      password: adminPassword,
      firstName: 'Test',
      lastName: 'Admin',
      publicMetadata: {
        role: 'org_admin'
      }
    });
    
    console.log('✅ Test user created successfully!');
    console.log(`👤 User ID: ${user.id}`);
    console.log(`📧 Email: ${user.emailAddresses[0]?.emailAddress}`);
    
    return user;
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUser()
    .then(() => {
      console.log('🎉 Test user setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to create test user:', error);
      process.exit(1);
    });
}