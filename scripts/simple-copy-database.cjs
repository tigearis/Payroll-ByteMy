#!/usr/bin/env node

// Simple approach: Export from payroll_local as SQL and import to payroll
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function copyDatabase() {
  console.log('🔄 Copying database from payroll_local to payroll...');
  
  const HOST = '192.168.1.229';
  const USER = 'admin';
  const PASSWORD = 'PostH4rr!51604';
  
  const env = {
    ...process.env,
    PGPASSWORD: PASSWORD,
    PGSSLMODE: 'disable'
  };

  try {
    console.log('📤 Exporting payroll_local database...');
    
    // Export the payroll_local database as SQL
    await execAsync(`pg_dump -h ${HOST} -p 5432 -U ${USER} -d payroll_local --no-owner --no-privileges --clean --if-exists > payroll_export.sql`, { env });
    
    console.log('✅ Export completed: payroll_export.sql');
    
    console.log('📥 Importing to payroll database...');
    
    // Import to payroll database
    await execAsync(`psql -h ${HOST} -p 5432 -U ${USER} -d payroll -f payroll_export.sql`, { env });
    
    console.log('✅ Import completed');
    
    // Verify
    console.log('🔍 Verifying migration...');
    
    const verifyResult = await execAsync(`psql -h ${HOST} -p 5432 -U ${USER} -d payroll -t -c "SELECT COUNT(*) FROM public.users;"`, { env });
    
    const userCount = verifyResult.stdout.trim();
    console.log(`✅ Verification: ${userCount} users found in payroll database`);
    
    if (parseInt(userCount) > 0) {
      console.log('\n🎉 Database copy completed successfully!');
      console.log('Your application should now work with the payroll database.');
      
      // Clean up
      console.log('🧹 Cleaning up temporary files...');
      await execAsync('rm -f payroll_export.sql');
      
    } else {
      console.log('\n❌ Database copy may have failed - no users found');
    }
    
  } catch (error) {
    if (error.message.includes('version mismatch')) {
      console.log('\n⚠️  PostgreSQL version mismatch detected');
      console.log('Your local pg_dump version is different from the server version');
      console.log('This can cause compatibility issues');
      console.log('\nAlternative solution: Use your existing database connection to manually verify');
      console.log('the payroll_local database contains data, then we can work with that instead.');
    } else {
      console.error('❌ Error during database copy:', error.message);
    }
  }
}

copyDatabase().catch(console.error);