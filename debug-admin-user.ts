/**
 * Debug Admin User Setup
 * This checks if the current admin user is properly synced with the database
 */

import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { syncUserWithDatabase } from '@/lib/user-sync';

export async function debugAdminUser() {
  console.log('🔍 Debugging Admin User Setup...');
  
  try {
    // Get current session
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return { error: 'No active session' };
    }
    
    console.log('👤 Current User ID:', userId);
    
    // Get Clerk user details
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    
    console.log('📋 Clerk User Data:');
    console.log('  Email:', clerkUser.emailAddresses[0]?.emailAddress);
    console.log('  Public Metadata:', JSON.stringify(clerkUser.publicMetadata, null, 2));
    console.log('  Private Metadata:', JSON.stringify(clerkUser.privateMetadata, null, 2));
    
    // Check JWT claims
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    console.log('🎫 JWT Claims:');
    console.log('  x-hasura-role:', hasuraClaims?.["x-hasura-role"]);
    console.log('  x-hasura-default-role:', hasuraClaims?.["x-hasura-default-role"]);
    console.log('  x-hasura-user-id:', hasuraClaims?.["x-hasura-user-id"]);
    console.log('  x-hasura-allowed-roles:', hasuraClaims?.["x-hasura-allowed-roles"]);
    
    // Check if user needs sync
    const databaseId = clerkUser.publicMetadata?.databaseId;
    const role = clerkUser.publicMetadata?.role;
    
    if (!databaseId || !role) {
      console.log('⚠️ User needs database sync!');
      console.log('  Missing databaseId:', !databaseId);
      console.log('  Missing role:', !role);
      
      // Attempt to sync
      console.log('🔄 Attempting to sync user...');
      const syncResult = await syncUserWithDatabase(
        userId,
        clerkUser.emailAddresses[0]?.emailAddress || '',
        clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : 'Unknown User'
      );
      
      if (syncResult) {
        console.log('✅ User sync completed');
        return { 
          status: 'synced', 
          user: syncResult,
          message: 'User was missing database sync, but has been fixed'
        };
      } else {
        console.log('❌ User sync failed');
        return { 
          error: 'User sync failed',
          message: 'Could not sync user with database'
        };
      }
    }
    
    console.log('✅ User appears to be properly synced');
    return {
      status: 'ok',
      userId,
      databaseId,
      role,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      hasValidJWT: !!(hasuraClaims?.["x-hasura-user-id"] && hasuraClaims?.["x-hasura-role"])
    };
    
  } catch (error: any) {
    console.error('❌ Error debugging admin user:', error);
    return { error: error.message };
  }
}

// For API route
export async function GET() {
  const result = await debugAdminUser();
  return Response.json(result);
}