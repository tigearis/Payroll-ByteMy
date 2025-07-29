#!/usr/bin/env node

/**
 * Check Clerk Invitation Status
 * 
 * Verifies the actual status of the invitation in Clerk
 * vs the database to confirm the inconsistency
 */

const dotenv = require("dotenv");
const { createClerkClient } = require("@clerk/backend");

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.development.local" });
dotenv.config({ path: ".env" });

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function checkClerkInvitation() {
  console.log('🔍 Checking Clerk invitation status...\n');
  
  try {
    // Get the invitation from Clerk
    const invitationId = 'inv_30QwcVMWF1ehQ4jDKbs7D5z2yg8';
    
    console.log('📋 Checking Clerk invitation:', invitationId);
    
    try {
      const invitation = await clerkClient.invitations.getInvitation(invitationId);
      
      console.log('✅ Found invitation in Clerk:');
      console.log('ID:', invitation.id);
      console.log('Email:', invitation.emailAddress);
      console.log('Status:', invitation.status);
      console.log('Created:', invitation.createdAt);
      console.log('Updated:', invitation.updatedAt);
      console.log('Public Metadata:', JSON.stringify(invitation.publicMetadata, null, 2));
      
      if (invitation.status === 'pending') {
        console.log('\n🚨 CONFIRMED: Invitation is still PENDING in Clerk');
        console.log('   - Database shows: ACCEPTED');
        console.log('   - Clerk shows: PENDING');
        console.log('   - This confirms the data inconsistency!');
      } else {
        console.log('\n✅ Invitation status in Clerk:', invitation.status);
      }
      
    } catch (invError) {
      if (invError.message.includes('not_found') || invError.status === 404) {
        console.log('❌ Invitation not found in Clerk');
        console.log('   This could mean:');
        console.log('   1. Invitation was deleted from Clerk');
        console.log('   2. Invitation ID is incorrect');
        console.log('   3. Invitation expired and was cleaned up');
      } else {
        console.log('❌ Error fetching invitation:', invError.message);
      }
    }
    
    // Also check if there are any invitations for the +test email
    console.log('\n🔍 Checking for any invitations to nathan.harris02+test@gmail.com:');
    
    try {
      const allInvitations = await clerkClient.invitations.getInvitationList();
      const testInvitations = allInvitations.data.filter(inv => 
        inv.emailAddress === 'nathan.harris02+test@gmail.com'
      );
      
      if (testInvitations.length > 0) {
        console.log(`✅ Found ${testInvitations.length} invitation(s) for +test email:`);
        testInvitations.forEach((inv, index) => {
          console.log(`${index + 1}. ID: ${inv.id}`);
          console.log(`   Status: ${inv.status}`);
          console.log(`   Created: ${inv.createdAt}`);
          console.log(`   Updated: ${inv.updatedAt}`);
        });
      } else {
        console.log('❌ No invitations found for +test email in Clerk');
      }
    } catch (listError) {
      console.log('❌ Error listing invitations:', listError.message);
    }
    
  } catch (error) {
    console.error('❌ Error checking Clerk:', error);
  }
}

// Run the check
checkClerkInvitation()
  .then(() => {
    console.log('\n✅ Clerk check complete');
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });