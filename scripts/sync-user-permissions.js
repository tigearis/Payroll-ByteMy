/**
 * Quick utility to sync user permissions to Clerk metadata
 * Run this to fix developer access issues
 */

async function syncUserPermissions() {
  try {
    console.log('🔄 Syncing user permissions to Clerk metadata...');
    
    const response = await fetch('/api/sync-current-user', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error (${response.status}): ${error}`);
    }
    
    const result = await response.json();
    console.log('✅ Permission sync successful!');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
    
    // Check if permissions were updated properly
    if (window.Clerk?.user?.publicMetadata) {
      console.log('📋 Updated Clerk metadata:');
      console.log('  Role:', window.Clerk.user.publicMetadata.role);
      console.log('  Allowed Roles:', window.Clerk.user.publicMetadata.allowedRoles);
      console.log('  Excluded Permissions:', window.Clerk.user.publicMetadata.excludedPermissions?.length || 0);
      console.log('  Permission Hash:', window.Clerk.user.publicMetadata.permissionHash?.substring(0, 8) + '...');
    }
    
    console.log('🔄 Reloading page to apply new permissions...');
    setTimeout(() => window.location.reload(), 1000);
    
  } catch (error) {
    console.error('❌ Permission sync failed:', error.message);
    console.error('💡 This usually means:');
    console.error('  1. You need to be signed in');
    console.error('  2. The API endpoint is not available');
    console.error('  3. Database connection issues');
  }
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log('📧 User Permission Sync Utility Ready!');
  console.log('💡 Run: syncUserPermissions() to fix permission issues');
  
  // Make function globally available
  window.syncUserPermissions = syncUserPermissions;
}

export { syncUserPermissions };