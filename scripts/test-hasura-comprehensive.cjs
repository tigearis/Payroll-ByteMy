#!/usr/bin/env node

// Comprehensive test of Hasura connection with payroll_local database
async function comprehensiveTest() {
  console.log('🧪 Comprehensive Hasura Test with payroll_local database');
  console.log('=' .repeat(60));
  
  const hasuraUrl = 'https://hasura.bytemy.com.au/v1/graphql';
  const adminSecret = '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';
  
  const tests = [];
  
  try {
    // Test 1: Users Query
    console.log('\n1️⃣  Testing Users Query...');
    const usersResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query GetUsers {
            users(limit: 5) {
              id
              email
              firstName
              lastName
              role
              createdAt
            }
          }
        `
      })
    });
    
    const usersResult = await usersResponse.json();
    if (usersResult.data && usersResult.data.users) {
      console.log(`✅ Users: Found ${usersResult.data.users.length} users`);
      usersResult.data.users.forEach(user => {
        console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) - ${user.role}`);
      });
      tests.push({ name: 'Users Query', status: 'PASS' });
    } else {
      console.log('❌ Users query failed');
      console.log('Error:', usersResult.errors);
      tests.push({ name: 'Users Query', status: 'FAIL' });
    }
    
    // Test 2: Clients Query
    console.log('\n2️⃣  Testing Clients Query...');
    const clientsResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query GetClients {
            clients(limit: 5) {
              id
              name
              email
              status
              createdAt
            }
          }
        `
      })
    });
    
    const clientsResult = await clientsResponse.json();
    if (clientsResult.data && clientsResult.data.clients) {
      console.log(`✅ Clients: Found ${clientsResult.data.clients.length} clients`);
      clientsResult.data.clients.forEach(client => {
        console.log(`   - ${client.name} (${client.email}) - ${client.status}`);
      });
      tests.push({ name: 'Clients Query', status: 'PASS' });
    } else {
      console.log('❌ Clients query failed');
      console.log('Error:', clientsResult.errors);
      tests.push({ name: 'Clients Query', status: 'FAIL' });
    }
    
    // Test 3: Payrolls Query
    console.log('\n3️⃣  Testing Payrolls Query...');
    const payrollsResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query GetPayrolls {
            payrolls(limit: 5) {
              id
              name
              status
              startDate
              endDate
            }
          }
        `
      })
    });
    
    const payrollsResult = await payrollsResponse.json();
    if (payrollsResult.data && payrollsResult.data.payrolls) {
      console.log(`✅ Payrolls: Found ${payrollsResult.data.payrolls.length} payrolls`);
      payrollsResult.data.payrolls.forEach(payroll => {
        console.log(`   - ${payroll.name} - ${payroll.status} (${payroll.startDate} to ${payroll.endDate})`);
      });
      tests.push({ name: 'Payrolls Query', status: 'PASS' });
    } else {
      console.log('❌ Payrolls query failed');
      console.log('Error:', payrollsResult.errors);
      tests.push({ name: 'Payrolls Query', status: 'FAIL' });
    }
    
    // Test 4: User Invitations (correct GraphQL name)
    console.log('\n4️⃣  Testing User Invitations Query...');
    const invitationsResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query GetInvitations {
            userInvitations(limit: 5) {
              id
              email
              status
              createdAt
            }
          }
        `
      })
    });
    
    const invitationsResult = await invitationsResponse.json();
    if (invitationsResult.data && invitationsResult.data.userInvitations) {
      console.log(`✅ User Invitations: Found ${invitationsResult.data.userInvitations.length} invitations`);
      invitationsResult.data.userInvitations.forEach(invitation => {
        console.log(`   - ${invitation.email} - ${invitation.status}`);
      });
      tests.push({ name: 'User Invitations Query', status: 'PASS' });
    } else {
      console.log('❌ User Invitations query failed');
      console.log('Error:', invitationsResult.errors);
      tests.push({ name: 'User Invitations Query', status: 'FAIL' });
    }
    
    // Test 5: Audit Logs
    console.log('\n5️⃣  Testing Audit Logs Query...');
    const auditResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query GetAuditLogs {
            auditLogs(limit: 3) {
              id
              action
              tableName
              createdAt
            }
          }
        `
      })
    });
    
    const auditResult = await auditResponse.json();
    if (auditResult.data && auditResult.data.auditLogs) {
      console.log(`✅ Audit Logs: Found ${auditResult.data.auditLogs.length} audit entries`);
      auditResult.data.auditLogs.forEach(log => {
        console.log(`   - ${log.action} on ${log.tableName} at ${log.createdAt}`);
      });
      tests.push({ name: 'Audit Logs Query', status: 'PASS' });
    } else {
      console.log('❌ Audit Logs query failed');
      console.log('Error:', auditResult.errors);
      tests.push({ name: 'Audit Logs Query', status: 'FAIL' });
    }
    
    // Test 6: Complex Query with Relations
    console.log('\n6️⃣  Testing Complex Query with Relations...');
    const complexResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query GetComplexData {
            users(limit: 2) {
              id
              firstName
              lastName
              userRoles {
                role {
                  name
                }
              }
            }
          }
        `
      })
    });
    
    const complexResult = await complexResponse.json();
    if (complexResult.data && complexResult.data.users) {
      console.log(`✅ Complex Relations: Query executed successfully`);
      complexResult.data.users.forEach(user => {
        const roles = user.userRoles.map(ur => ur.role.name).join(', ');
        console.log(`   - ${user.firstName} ${user.lastName}: ${roles || 'No roles'}`);
      });
      tests.push({ name: 'Complex Relations Query', status: 'PASS' });
    } else {
      console.log('❌ Complex relations query failed');
      console.log('Error:', complexResult.errors);
      tests.push({ name: 'Complex Relations Query', status: 'FAIL' });
    }
    
    // Test 7: Subscription Test (structure only)
    console.log('\n7️⃣  Testing Subscription Structure...');
    const subscriptionResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          subscription TestSubscription {
            users(limit: 1) {
              id
              email
              updatedAt
            }
          }
        `
      })
    });
    
    const subscriptionResult = await subscriptionResponse.json();
    if (subscriptionResult.data) {
      console.log('✅ Subscription: Structure is valid (WebSocket testing requires different setup)');
      tests.push({ name: 'Subscription Structure', status: 'PASS' });
    } else {
      console.log('❌ Subscription structure test failed');
      console.log('Error:', subscriptionResult.errors);
      tests.push({ name: 'Subscription Structure', status: 'FAIL' });
    }
    
  } catch (error) {
    console.error('❌ Error during comprehensive test:', error.message);
    tests.push({ name: 'Overall Test', status: 'ERROR' });
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = tests.filter(t => t.status === 'PASS').length;
  const failed = tests.filter(t => t.status === 'FAIL').length;
  const errors = tests.filter(t => t.status === 'ERROR').length;
  
  tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test.name}: ${test.status}`);
  });
  
  console.log('\n📈 Results:');
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⚠️  Errors: ${errors}`);
  console.log(`  📊 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (passed === tests.length) {
    console.log('\n🎉 ALL TESTS PASSED! Your Hasura connection to payroll_local is working perfectly!');
  } else if (passed >= tests.length * 0.8) {
    console.log('\n✅ Most tests passed! Migration is successful with minor issues.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

comprehensiveTest().catch(console.error);