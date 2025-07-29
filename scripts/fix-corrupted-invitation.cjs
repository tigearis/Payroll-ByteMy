#!/usr/bin/env node

/**
 * Fix Corrupted Invitation Data
 * 
 * Fixes the nathan.harris02+test@gmail.com invitation that was incorrectly
 * marked as accepted and linked to the wrong user
 */

const dotenv = require("dotenv");
const { Client } = require("pg");

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.development.local" });
dotenv.config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

async function fixCorruptedInvitation() {
  console.log('🔧 Fixing corrupted invitation data...\n');
  
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    
    // 1. Show current state
    console.log('📋 Current state of the corrupted invitation:');
    const currentStateQuery = `
      SELECT 
        ui.id,
        ui.email,
        ui.first_name,
        ui.last_name,
        ui.invitation_status,
        ui.accepted_at,
        ui.accepted_by,
        u.email as accepted_user_email,
        u.name as accepted_user_name
      FROM user_invitations ui
      LEFT JOIN users u ON ui.accepted_by = u.id
      WHERE ui.email = 'nathan.harris02+test@gmail.com'
    `;
    
    const currentResult = await client.query(currentStateQuery);
    const invitation = currentResult.rows[0];
    
    if (!invitation) {
      console.log('❌ No invitation found for nathan.harris02+test@gmail.com');
      return;
    }
    
    console.log('Invitation ID:', invitation.id);
    console.log('Email:', invitation.email);
    console.log('Status:', invitation.invitation_status);
    console.log('Accepted At:', invitation.accepted_at);
    console.log('Accepted By User:', invitation.accepted_user_email || 'None');
    console.log('');
    
    if (invitation.invitation_status === 'accepted' && 
        invitation.accepted_user_email && 
        invitation.accepted_user_email !== invitation.email) {
      
      console.log('🚨 CONFIRMED: Invitation is corrupted');
      console.log('   - Invitation for:', invitation.email);
      console.log('   - Incorrectly linked to user:', invitation.accepted_user_email);
      console.log('');
      
      // 2. Fix the corruption by resetting invitation to pending
      console.log('🔧 Resetting invitation to pending status...');
      
      const fixQuery = `
        UPDATE user_invitations 
        SET 
          invitation_status = 'pending',
          accepted_at = NULL,
          accepted_by = NULL,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const fixResult = await client.query(fixQuery, [invitation.id]);
      const fixedInvitation = fixResult.rows[0];
      
      if (fixedInvitation) {
        console.log('✅ Invitation successfully reset:');
        console.log('   - Status:', fixedInvitation.invitation_status);
        console.log('   - Accepted At:', fixedInvitation.accepted_at || 'NULL');
        console.log('   - Accepted By:', fixedInvitation.accepted_by || 'NULL');
        console.log('');
        
        console.log('✅ The invitation is now ready for proper acceptance');
        console.log('   - User nathan.harris02+test@gmail.com can now accept their invitation');
        console.log('   - When accepted, a new user will be created with the correct email');
        console.log('   - The existing nathan.harris02@gmail.com user will remain unchanged');
        
      } else {
        console.log('❌ Failed to reset invitation');
      }
      
    } else if (invitation.invitation_status === 'pending') {
      console.log('✅ Invitation is already in correct pending state');
      
    } else {
      console.log('ℹ️ Invitation state is unclear, manual investigation needed');
    }
    
    // 3. Verify the fix
    console.log('\n🔍 Verification - checking final state:');
    const verifyResult = await client.query(currentStateQuery);
    const verifiedInvitation = verifyResult.rows[0];
    
    console.log('Final status:', verifiedInvitation.invitation_status);
    console.log('Final accepted_at:', verifiedInvitation.accepted_at || 'NULL');
    console.log('Final accepted_by:', verifiedInvitation.accepted_by || 'NULL');
    
    if (verifiedInvitation.invitation_status === 'pending' && 
        !verifiedInvitation.accepted_at && 
        !verifiedInvitation.accepted_by) {
      console.log('\n🎉 SUCCESS: Invitation corruption has been fixed!');
      console.log('   The invitation is now ready for proper acceptance');
      return true;
    } else {
      console.log('\n❌ FAILED: Invitation is still in corrupted state');
      return false;
    }

  } catch (error) {
    console.error('❌ Error fixing invitation:', error);
    return false;
  } finally {
    await client.end();
  }
}

// Run the fix
fixCorruptedInvitation()
  .then((success) => {
    if (success) {
      console.log('\n✅ Fix completed successfully');
      process.exit(0);
    } else {
      console.log('\n❌ Fix failed');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });