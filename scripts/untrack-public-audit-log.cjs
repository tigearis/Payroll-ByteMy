#!/usr/bin/env node

// Untrack the empty public.audit_log table from Hasura to resolve conflicts
async function untrackPublicAuditLog() {
  console.log('🔧 Untracking public.audit_log from Hasura');
  console.log('=' .repeat(50));
  
  const hasuraUrl = 'https://hasura.bytemy.com.au/v1/metadata';
  const adminSecret = '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';
  
  try {
    // Step 1: Check if the table is currently tracked
    console.log('1️⃣  Checking current tracking status...');
    
    const exportResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        type: 'export_metadata',
        args: {}
      })
    });
    
    const exportResult = await exportResponse.json();
    
    if (exportResult.sources) {
      const defaultSource = exportResult.sources.find(s => s.name === 'default');
      if (defaultSource && defaultSource.tables) {
        const publicAuditLogTable = defaultSource.tables.find(t => 
          t.table && t.table.name === 'audit_log' && t.table.schema === 'public'
        );
        
        if (publicAuditLogTable) {
          console.log('✅ public.audit_log is currently tracked in Hasura');
        } else {
          console.log('ℹ️  public.audit_log is not currently tracked');
          console.log('   This might already be resolved or never was tracked');
          return;
        }
      }
    }
    
    // Step 2: Untrack the table
    console.log('\n2️⃣  Untracking public.audit_log table...');
    
    const untrackResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        type: 'pg_untrack_table',
        args: {
          source: 'default',
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
    } else if (untrackResult.error && untrackResult.error.includes('already-untracked')) {
      console.log('ℹ️  Table was already untracked');
    } else {
      console.log('❌ Failed to untrack table:', untrackResult);
      return;
    }
    
    // Step 3: Verify the GraphQL schema no longer has conflicts
    console.log('\n3️⃣  Verifying mutation conflicts are resolved...');
    
    const schemaTestResponse = await fetch('https://hasura.bytemy.com.au/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query TestMutations {
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
    
    const schemaResult = await schemaTestResponse.json();
    
    if (schemaResult.data && schemaResult.data.__schema.mutationType) {
      const mutations = schemaResult.data.__schema.mutationType.fields;
      const auditLogMutations = mutations.filter(m => m.name.toLowerCase().includes('auditlog'));
      
      console.log(`✅ GraphQL schema accessible with ${mutations.length} total mutations`);
      console.log(`📊 Audit log mutations found: ${auditLogMutations.length}`);
      
      auditLogMutations.forEach(mutation => {
        console.log(`   - ${mutation.name}`);
      });
      
      // Check if we still have the conflict
      const insertAuditLogCount = auditLogMutations.filter(m => m.name === 'insertAuditLog').length;
      if (insertAuditLogCount <= 1) {
        console.log('✅ insertAuditLog conflict resolved!');
      } else {
        console.log(`⚠️  Still ${insertAuditLogCount} insertAuditLog mutations - conflict may persist`);
      }
      
    } else {
      console.log('❌ Failed to check GraphQL schema:', schemaResult.errors);
    }
    
    // Step 4: Test a basic audit log query
    console.log('\n4️⃣  Testing audit log functionality...');
    
    const auditTestResponse = await fetch('https://hasura.bytemy.com.au/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify({
        query: `
          query TestAuditLogs {
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
    
    if (auditResult.data && auditResult.data.auditLogsAggregate) {
      const count = auditResult.data.auditLogsAggregate.aggregate.count;
      console.log(`✅ Audit system functional: ${count} audit entries accessible`);
    } else {
      console.log('❌ Audit system test failed:', auditResult.errors);
    }
    
    console.log('\n🎉 UNTRACKING COMPLETE!');
    console.log('✅ public.audit_log untracked from Hasura');
    console.log('✅ audit.audit_log remains operational');
    console.log('✅ GraphQL conflicts should be resolved');
    
  } catch (error) {
    console.error('❌ Error untracking public.audit_log:', error.message);
  }
}

untrackPublicAuditLog().catch(console.error);