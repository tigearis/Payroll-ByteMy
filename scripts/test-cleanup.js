// Simple test to call our cleanup API
// Usage: node scripts/test-cleanup.js

const API_URL = 'http://localhost:3000/api/admin/cleanup';

async function preview() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'preview' })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('📊 PREVIEW RESULTS:');
      console.log(`Users to delete: ${result.preview.summary.usersToDelete}`);
      console.log(`Invitations to delete: ${result.preview.summary.invitationsToDelete}`);
      
      if (result.preview.users.length > 0) {
        console.log('\n👤 Users that would be deleted:');
        result.preview.users.forEach(user => {
          console.log(`  - ${user.computedName} (${user.email}) - Role: ${user.role}`);
        });
      }
      
      if (result.preview.invitations.length > 0) {
        console.log('\n📧 Invitations that would be deleted:');
        result.preview.invitations.forEach(inv => {
          console.log(`  - ${inv.firstName} ${inv.lastName} (${inv.email}) - Status: ${inv.invitationStatus}`);
        });
      }

      if (result.preview.summary.usersToDelete === 0 && result.preview.summary.invitationsToDelete === 0) {
        console.log('\n✅ Nothing to delete - database is already clean!');
        return;
      }

      console.log('\n⚠️  To actually delete, run:');
      console.log('node scripts/test-cleanup.js --delete');
    } else {
      console.error('❌ Preview failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error calling API:', error.message);
    console.log('💡 Make sure the Next.js development server is running (pnpm dev)');
  }
}

async function deleteData() {
  try {
    console.log('🗑️  Proceeding with deletion...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'delete', 
        confirm: true 
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Cleanup completed successfully!');
      console.log(`Deleted ${result.results.deletedUsers.length} users`);
      console.log(`Deleted ${result.results.deletedInvitations.length} invitations`);
      
      if (result.results.errors.length > 0) {
        console.log('\n⚠️  Some errors occurred:');
        result.results.errors.forEach(error => console.log(`  - ${error}`));
      }
    } else {
      console.error('❌ Deletion failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error calling API:', error.message);
  }
}

// Main execution
const shouldDelete = process.argv.includes('--delete');

if (shouldDelete) {
  deleteData();
} else {
  preview();
}