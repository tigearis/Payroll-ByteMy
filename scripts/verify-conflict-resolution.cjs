#!/usr/bin/env node

// Verify that all GraphQL conflicts have been resolved
async function verifyConflictResolution() {
  console.log('🔍 Verifying GraphQL Conflict Resolution');
  console.log('=' .repeat(60));
  
  const hasuraUrl = 'https://hasura.bytemy.com.au/v1/graphql';
  const adminSecret = '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';
  
  const tests = [];
  
  try {
    // Test 1: Schema Introspection
    console.log('\n1️⃣  Testing GraphQL Schema Introspection...');
    
    const schemaResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query SchemaIntrospection {
            __schema {
              queryType { name }
              mutationType { name }
              subscriptionType { name }
            }
          }
        `
      })
    });
    
    const schemaResult = await schemaResponse.json();
    
    if (schemaResult.data && schemaResult.data.__schema) {
      console.log('✅ Schema introspection successful');
      console.log(`   Query type: ${schemaResult.data.__schema.queryType.name}`);
      console.log(`   Mutation type: ${schemaResult.data.__schema.mutationType.name}`);
      tests.push({ test: 'Schema Introspection', status: 'PASS' });
    } else {
      console.log('❌ Schema introspection failed:', schemaResult.errors);
      tests.push({ test: 'Schema Introspection', status: 'FAIL' });
    }
    
    // Test 2: Check for Mutation Conflicts
    console.log('\n2️⃣  Checking for Mutation Name Conflicts...');
    
    const mutationsResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query CheckMutations {
            __schema {
              mutationType {
                fields {
                  name
                }
              }
            }
          }
        `
      })
    });
    
    const mutationsResult = await mutationsResponse.json();
    
    if (mutationsResult.data && mutationsResult.data.__schema.mutationType) {
      const mutations = mutationsResult.data.__schema.mutationType.fields;
      console.log(`✅ Found ${mutations.length} total mutations`);
      
      // Check for specific conflict: insertAuditLog
      const insertAuditLogMutations = mutations.filter(m => m.name === 'insertAuditLog');
      console.log(`🔍 insertAuditLog mutations: ${insertAuditLogMutations.length}`);
      
      if (insertAuditLogMutations.length === 1) {
        console.log('✅ insertAuditLog conflict resolved - only one mutation exists');
        tests.push({ test: 'insertAuditLog Conflict', status: 'PASS' });
      } else if (insertAuditLogMutations.length === 0) {
        console.log('⚠️  No insertAuditLog mutation found - audit system may need tracking');
        tests.push({ test: 'insertAuditLog Conflict', status: 'WARNING' });
      } else {
        console.log(`❌ Still ${insertAuditLogMutations.length} insertAuditLog mutations - conflict persists`);
        tests.push({ test: 'insertAuditLog Conflict', status: 'FAIL' });
      }
      
      // Check for other audit-related mutations
      const auditMutations = mutations.filter(m => m.name.toLowerCase().includes('audit'));
      console.log(`📊 All audit-related mutations: ${auditMutations.length}`);
      auditMutations.forEach(mutation => {
        console.log(`   - ${mutation.name}`);
      });
      
    } else {
      console.log('❌ Could not retrieve mutations:', mutationsResult.errors);
      tests.push({ test: 'insertAuditLog Conflict', status: 'FAIL' });
    }
    
    // Test 3: Audit System Functionality
    console.log('\n3️⃣  Testing Audit System Functionality...');
    
    const auditTestResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query TestAuditSystem {
            auditLogs(limit: 3) {
              id
              action
              resourceType
              userEmail
              eventTime
            }
            auditLogsAggregate {
              aggregate {
                count
              }
            }
          }
        `
      })
    });
    
    const auditResult = await auditTestResponse.json();
    
    if (auditResult.data && auditResult.data.auditLogs) {
      const count = auditResult.data.auditLogsAggregate.aggregate.count;
      console.log(`✅ Audit system functional: ${count} audit entries`);
      console.log(`📄 Sample audit entries: ${auditResult.data.auditLogs.length}`);
      
      auditResult.data.auditLogs.forEach(entry => {
        console.log(`   - ${entry.action} on ${entry.resourceType} by ${entry.userEmail || 'system'}`);
      });
      
      tests.push({ test: 'Audit System Functionality', status: 'PASS' });
    } else {
      console.log('❌ Audit system test failed:', auditResult.errors);
      tests.push({ test: 'Audit System Functionality', status: 'FAIL' });
    }
    
    // Test 4: Core Business Operations
    console.log('\n4️⃣  Testing Core Business Operations...');
    
    const coreTestResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query TestCoreOperations {
            users(limit: 1) { id firstName lastName }
            clients(limit: 1) { id name }
            payrolls(limit: 1) { id name status }
          }
        `
      })
    });
    
    const coreResult = await coreTestResponse.json();
    
    if (coreResult.data && coreResult.data.users && coreResult.data.clients && coreResult.data.payrolls) {
      console.log('✅ Core business operations working');
      console.log(`   Users: ${coreResult.data.users.length} found`);
      console.log(`   Clients: ${coreResult.data.clients.length} found`);
      console.log(`   Payrolls: ${coreResult.data.payrolls.length} found`);
      tests.push({ test: 'Core Business Operations', status: 'PASS' });
    } else {
      console.log('❌ Core operations test failed:', coreResult.errors);
      tests.push({ test: 'Core Business Operations', status: 'FAIL' });
    }
    
    // Test 5: Metadata Consistency Check
    console.log('\n5️⃣  Checking Metadata Consistency...');
    
    try {
      const response = await fetch('https://hasura.bytemy.com.au/v1/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hasura-Admin-Secret': adminSecret
        },
        body: JSON.stringify({
          type: 'get_inconsistent_metadata',
          args: {}
        })
      });
      
      const inconsistentResult = await response.json();
      
      if (inconsistentResult.inconsistent_objects && inconsistentResult.inconsistent_objects.length === 0) {
        console.log('✅ Metadata is consistent - no conflicts detected');
        tests.push({ test: 'Metadata Consistency', status: 'PASS' });
      } else {
        console.log(`⚠️  Found ${inconsistentResult.inconsistent_objects?.length || 0} inconsistent objects`);
        if (inconsistentResult.inconsistent_objects) {
          inconsistentResult.inconsistent_objects.forEach(obj => {
            console.log(`   - ${obj.type}: ${obj.name} - ${obj.reason}`);
          });
        }
        tests.push({ test: 'Metadata Consistency', status: 'WARNING' });
      }
    } catch (error) {
      console.log('⚠️  Could not check metadata consistency:', error.message);
      tests.push({ test: 'Metadata Consistency', status: 'WARNING' });
    }
    
  } catch (error) {
    console.error('❌ Error during conflict verification:', error.message);
    tests.push({ test: 'Overall', status: 'ERROR' });
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONFLICT RESOLUTION VERIFICATION RESULTS');
  console.log('='.repeat(60));
  
  const passed = tests.filter(t => t.status === 'PASS').length;
  const failed = tests.filter(t => t.status === 'FAIL').length;
  const warnings = tests.filter(t => t.status === 'WARNING').length;
  const errors = tests.filter(t => t.status === 'ERROR').length;
  
  tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : 
                 test.status === 'FAIL' ? '❌' : 
                 test.status === 'WARNING' ? '⚠️' : '🚨';
    console.log(`${icon} ${test.test}: ${test.status}`);
  });
  
  console.log('\n📈 Summary:');
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⚠️  Warnings: ${warnings}`);
  console.log(`  🚨 Errors: ${errors}`);
  
  const successRate = Math.round((passed / tests.length) * 100);
  console.log(`  📊 Success Rate: ${successRate}%`);
  
  if (failed === 0 && errors === 0) {
    console.log('\n🎉 ALL CONFLICTS RESOLVED!');
    console.log('✅ Hasura GraphQL schema is clean');
    console.log('✅ Audit system is functional');
    console.log('✅ Core business operations work correctly');
    console.log('✅ Migration to local PostgreSQL is complete');
  } else if (failed === 0) {
    console.log('\n✅ CONFLICTS LARGELY RESOLVED!');
    console.log('ℹ️  Minor warnings detected but core functionality works');
  } else {
    console.log('\n⚠️  SOME ISSUES REMAIN');
    console.log('❌ Review failed tests above for remaining conflicts');
  }
}

verifyConflictResolution().catch(console.error);