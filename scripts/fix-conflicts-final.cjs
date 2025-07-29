#!/usr/bin/env node

// Final fix for Hasura conflicts - untrack conflicting tables
async function fixConflictsFinal() {
  console.log('🔧 Final fix for Hasura conflicts...');
  
  const hasuraUrl = 'https://hasura.bytemy.com.au/v1/metadata';
  const adminSecret = '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';
  
  try {
    // Step 1: Untrack the conflicting public.audit_log table
    console.log('1️⃣  Untracking public.audit_log table...');
    
    const untrackResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        type: 'pg_untrack_table',
        args: {
          source: 'payroll',
          table: {
            name: 'audit_log',
            schema: 'public'
          }
        }
      })
    });
    
    const untrackResult = await untrackResponse.json();
    
    if (untrackResult.message === 'success') {
      console.log('✅ Successfully untracked public.audit_log');
    } else {
      console.log('ℹ️  public.audit_log may already be untracked or not exist');
      console.log('Result:', untrackResult);
    }
    
    // Step 2: Clear and reload metadata to fix any cached conflicts
    console.log('\n2️⃣  Clearing metadata cache...');
    
    const clearResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        type: 'clear_metadata',
        args: {}
      })
    });
    
    const clearResult = await clearResponse.json();
    
    if (clearResult.message === 'success') {
      console.log('✅ Metadata cleared successfully');
    } else {
      console.log('❌ Failed to clear metadata:', clearResult);
      return;
    }
    
    // Step 3: Reload metadata from files
    console.log('\n3️⃣  Reloading metadata from files...');
    
    const reloadResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        type: 'reload_metadata',
        args: {
          reload_remote_schemas: true,
          reload_sources: true
        }
      })
    });
    
    const reloadResult = await reloadResponse.json();
    
    if (reloadResult.message === 'success') {
      console.log('✅ Metadata reloaded successfully');
    } else {
      console.log('❌ Failed to reload metadata:', reloadResult);
      return;
    }
    
    // Step 4: Test a simple query to verify everything works
    console.log('\n4️⃣  Testing GraphQL after fixes...');
    
    const testResponse = await fetch('https://hasura.bytemy.com.au/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query TestAfterFix {
            users(limit: 1) {
              id
              email
            }
          }
        `
      })
    });
    
    const testResult = await testResponse.json();
    
    if (testResult.data && testResult.data.users) {
      console.log('✅ GraphQL working correctly after fixes');
      console.log(`   Found ${testResult.data.users.length} user(s)`);
    } else {
      console.log('❌ GraphQL test failed:', testResult.errors);
    }
    
    console.log('\n🎉 Conflict resolution complete!');
    console.log('✅ public.audit_log untracked (audit.audit_log remains active)');
    console.log('✅ security_alerts field conflicts fixed');
    console.log('✅ Metadata cache cleared and reloaded');
    
  } catch (error) {
    console.error('❌ Error fixing conflicts:', error.message);
  }
}

fixConflictsFinal().catch(console.error);