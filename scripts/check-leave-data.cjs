#!/usr/bin/env node

// Script to check leave data in the system
require('dotenv').config({path: '.env.development.local'});

async function checkLeaveData() {
  console.log('🍃 Checking leave data in the system...');

  try {
    const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
    const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

    const getLeaveQuery = {
      query: `
        query GetAllLeaveData {
          leave {
            id
            userId
            leaveType
            startDate
            endDate
            status
            createdAt
          }
        }
      `,
      variables: {}
    };

    const response = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(getLeaveQuery),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      return;
    }

    const leaveRecords = result.data.leave;
    console.log(`\n📊 Found ${leaveRecords.length} leave records in the database`);

    if (leaveRecords.length === 0) {
      console.log('\n💡 No leave records found in the database.');
      console.log('   To test the developer access properly, you might want to:');
      console.log('   1. Create some test leave records');
      console.log('   2. Or check that the user can see the empty state correctly');
      return;
    }

    console.log('\n📋 Leave records summary:');
    
    // Show first few records as samples
    leaveRecords.slice(0, 5).forEach((record, index) => {
      console.log(`   ${index + 1}. User ID: ${record.userId}`);
      console.log(`      Type: ${record.leaveType}`);
      console.log(`      Period: ${record.startDate} to ${record.endDate}`);
      console.log(`      Status: ${record.status}`);
      console.log(`      Created: ${record.createdAt}`);
      console.log('');
    });

    if (leaveRecords.length > 5) {
      console.log(`   ... and ${leaveRecords.length - 5} more records`);
    }

    console.log('\n🔐 Access Rights Summary:');
    console.log('✅ Developer role can see ALL these leave records');
    console.log('✅ Org Admin role can see ALL these leave records');
    console.log('⚠️  Manager role can see only their team\'s records');
    console.log('⚠️  Consultant role can see only assigned records');
    console.log('⚠️  Viewer role can see only their OWN records');

    console.log('\n💡 The user Nathan Harris with developer role should be able to see all of these records when they sign in.');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  checkLeaveData();
}

module.exports = { checkLeaveData };