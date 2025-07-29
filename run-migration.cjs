const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function loadDatabaseUrl() {
  const envFiles = ['.env.development.local', '.env.local', '.env'];
  
  for (const envFile of envFiles) {
    const envPath = path.resolve(envFile);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('DATABASE_URL=')) {
          return line.split('=')[1].trim().replace(/['"]/g, '');
        }
      }
    }
  }
  
  throw new Error('DATABASE_URL not found in environment files');
}

async function runMigration() {
  const databaseUrl = loadDatabaseUrl();
  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    console.log('🔄 Running first_name/last_name migration...');

    const migrationSql = fs.readFileSync('database/migrations/add-first-last-name-columns.sql', 'utf8');
    await client.query(migrationSql);

    console.log('✅ Migration completed successfully');

    // Verification
    console.log('\n📊 Verification Results:');
    
    const sampleResult = await client.query(
      'SELECT id, name, first_name, last_name, computed_name FROM users LIMIT 5'
    );
    
    console.log('\nSample users after migration:');
    sampleResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. Original: "${user.name}"`);
      console.log(`     First: "${user.first_name}", Last: "${user.last_name}"`);
      console.log(`     Computed: "${user.computed_name}"`);
      console.log('');
    });

    const nullCheckResult = await client.query(
      'SELECT COUNT(*) as count FROM users WHERE first_name IS NULL OR last_name IS NULL'
    );
    console.log(`Null name fields: ${nullCheckResult.rows[0].count}`);

    const emptyCheckResult = await client.query(
      "SELECT COUNT(*) as count FROM users WHERE trim(first_name) = '' AND trim(last_name) = ''"
    );
    console.log(`Empty name fields: ${emptyCheckResult.rows[0].count}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runMigration().catch(console.error);
}

module.exports = { runMigration };