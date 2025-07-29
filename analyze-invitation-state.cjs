/**
 * Database State Analysis for Invitation Flow
 * Checks for orphaned invitations and mismatched user states
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function loadDatabaseUrl() {
  // Read from .env.development.local first, then .env.local, then .env
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

async function analyzeInvitationState() {
  const databaseUrl = loadDatabaseUrl();
  console.log('🔗 Using database URL from env file');
  
  const client = new Client({
    connectionString: databaseUrl
  });

  try {
    await client.connect();
    console.log('🔍 Analyzing invitation and user states...\n');

    // Check specific test email
    const testEmail = 'nathan.harris02+test@gmail.com';
    
    // 1. Check invitations for test email
    console.log('=== INVITATION ANALYSIS ===');
    const invitationQuery = `
      SELECT 
        id,
        email,
        first_name,
        last_name,
        invited_role,
        status,
        invitation_status,
        invited_by,
        expires_at,
        accepted_at,
        accepted_by,
        clerk_invitation_id,
        clerk_ticket,
        invited_at,
        created_at,
        updated_at
      FROM user_invitations 
      WHERE email = $1
      ORDER BY created_at DESC;
    `;
    
    const invitations = await client.query(invitationQuery, [testEmail]);
    
    if (invitations.rows.length === 0) {
      console.log(`❌ No invitations found for ${testEmail}`);
    } else {
      console.log(`📧 Found ${invitations.rows.length} invitation(s) for ${testEmail}:`);
      invitations.rows.forEach((inv, index) => {
        console.log(`\n  ${index + 1}. Invitation ID: ${inv.id}`);
        console.log(`     Name: ${inv.first_name} ${inv.last_name}`);
        console.log(`     Role: ${inv.invited_role}`);
        console.log(`     Status: ${inv.status}`);
        console.log(`     Invitation Status: ${inv.invitation_status}`);
        console.log(`     Created: ${inv.created_at}`);
        console.log(`     Invited At: ${inv.invited_at}`);
        console.log(`     Expires: ${inv.expires_at}`);
        console.log(`     Accepted: ${inv.accepted_at || 'Not accepted'}`);
        console.log(`     Accepted By: ${inv.accepted_by || 'None'}`);
        console.log(`     Invited by: ${inv.invited_by}`);
        console.log(`     Clerk Invitation ID: ${inv.clerk_invitation_id || 'Not set'}`);
        console.log(`     Clerk Ticket: ${inv.clerk_ticket ? inv.clerk_ticket.substring(0, 50) + '...' : 'Not set'}`);
      });
    }

    // 2. Check users for test email
    console.log('\n=== USER ANALYSIS ===');
    const userQuery = `
      SELECT 
        id,
        name,
        email,
        role,
        clerk_user_id,
        is_active,
        status,
        created_at,
        updated_at
      FROM users 
      WHERE email = $1
      ORDER BY created_at DESC;
    `;
    
    const users = await client.query(userQuery, [testEmail]);
    
    if (users.rows.length === 0) {
      console.log(`❌ No users found for ${testEmail}`);
    } else {
      console.log(`👤 Found ${users.rows.length} user(s) for ${testEmail}:`);
      users.rows.forEach((user, index) => {
        console.log(`\n  ${index + 1}. User ID: ${user.id}`);
        console.log(`     Name: ${user.name}`);
        console.log(`     Role: ${user.role}`);
        console.log(`     Status: ${user.status}`);
        console.log(`     Active: ${user.is_active}`);
        console.log(`     Clerk ID: ${user.clerk_user_id || 'Not set'}`);
        console.log(`     Created: ${user.created_at}`);
        console.log(`     Updated: ${user.updated_at}`);
      });
    }

    // 3. Check for orphaned data patterns
    console.log('\n=== ORPHANED DATA ANALYSIS ===');
    
    // Invitations with status 'accepted' but no corresponding user
    const orphanedInvitationsQuery = `
      SELECT 
        i.id as invitation_id,
        i.email,
        i.first_name,
        i.last_name,
        i.status,
        i.invitation_status,
        i.accepted_at,
        u.id as user_id
      FROM user_invitations i
      LEFT JOIN users u ON i.email = u.email
      WHERE i.status = 'accepted' AND u.id IS NULL
      ORDER BY i.accepted_at DESC;
    `;
    
    const orphanedInvitations = await client.query(orphanedInvitationsQuery);
    
    if (orphanedInvitations.rows.length === 0) {
      console.log('✅ No orphaned accepted invitations found');
    } else {
      console.log(`⚠️  Found ${orphanedInvitations.rows.length} orphaned accepted invitation(s):`);
      orphanedInvitations.rows.forEach((inv, index) => {
        console.log(`\n  ${index + 1}. Invitation ID: ${inv.invitation_id}`);
        console.log(`     Email: ${inv.email}`);
        console.log(`     Name: ${inv.first_name} ${inv.last_name}`);
        console.log(`     Status: ${inv.status}`);
        console.log(`     Invitation Status: ${inv.invitation_status}`);
        console.log(`     Accepted: ${inv.accepted_at}`);
        console.log(`     No corresponding user found`);
      });
    }

    // 4. Check for users without corresponding invitations
    const usersWithoutInvitationsQuery = `
      SELECT 
        u.id as user_id,
        u.email,
        u.name,
        u.role,
        u.clerk_user_id,
        i.id as invitation_id
      FROM users u
      LEFT JOIN user_invitations i ON u.email = i.email
      WHERE i.id IS NULL
      ORDER BY u.created_at DESC
      LIMIT 10;
    `;
    
    const usersWithoutInvitations = await client.query(usersWithoutInvitationsQuery);
    
    if (usersWithoutInvitations.rows.length === 0) {
      console.log('✅ All users have corresponding invitations');
    } else {
      console.log(`ℹ️  Found ${usersWithoutInvitations.rows.length} user(s) without invitations (first 10):`);
      usersWithoutInvitations.rows.forEach((user, index) => {
        console.log(`\n  ${index + 1}. User ID: ${user.user_id}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Name: ${user.name}`);
        console.log(`     Role: ${user.role}`);
        console.log(`     Clerk ID: ${user.clerk_user_id || 'Not set'}`);
      });
    }

    // 5. Summary and recommendations
    console.log('\n=== SUMMARY & RECOMMENDATIONS ===');
    
    const testEmailInvitations = invitations.rows;
    const testEmailUsers = users.rows;
    
    if (testEmailInvitations.length > 0 && testEmailUsers.length === 0) {
      console.log(`🚨 ISSUE: Invitation exists for ${testEmail} but no user record`);
      console.log('   Recommendation: Reset invitation status to allow re-acceptance');
    } else if (testEmailInvitations.length === 0 && testEmailUsers.length > 0) {
      console.log(`🚨 ISSUE: User exists for ${testEmail} but no invitation record`);
      console.log('   Recommendation: Create invitation record or understand user origin');
    } else if (testEmailInvitations.length > 0 && testEmailUsers.length > 0) {
      const latestInvitation = testEmailInvitations[0];
      const latestUser = testEmailUsers[0];
      console.log(`✅ Both invitation and user exist for ${testEmail}`);
      console.log(`   Invitation status: ${latestInvitation.status}`);
      console.log(`   User Clerk ID: ${latestUser.clerk_user_id || 'Not set'}`);
      
      if (latestInvitation.status === 'accepted' && !latestUser.clerk_user_id) {
        console.log('🚨 ISSUE: Invitation accepted but no Clerk ID in user record');
        console.log('   Recommendation: This indicates incomplete signup process');
      }
    } else {
      console.log(`ℹ️  No data found for ${testEmail} - clean slate for testing`);
    }

    console.log('\n✅ Analysis complete');

  } catch (error) {
    console.error('❌ Database analysis failed:', error);
  } finally {
    await client.end();
  }
}

// Run the analysis
if (require.main === module) {
  analyzeInvitationState().catch(console.error);
}

module.exports = { analyzeInvitationState };