#!/usr/bin/env node

/**
 * Specific Invitation Analysis
 * 
 * Analyzes the nathan.harris02+test@gmail.com invitation case
 * to understand exactly what happened during acceptance
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

async function analyzeSpecificCase() {
  console.log('🔍 Analyzing nathan.harris02+test@gmail.com invitation case...\n');
  
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    
    // 1. Get the specific invitation details
    console.log('📋 Invitation Details:');
    const invitationQuery = `
      SELECT 
        ui.*,
        u.id as accepted_user_id,
        u.name as accepted_user_name, 
        u.email as accepted_user_email,
        u.clerk_user_id as accepted_user_clerk_id,
        u.created_at as accepted_user_created
      FROM user_invitations ui
      LEFT JOIN users u ON ui.accepted_by = u.id  
      WHERE ui.email = 'nathan.harris02+test@gmail.com'
    `;
    
    const invitationResult = await client.query(invitationQuery);
    const invitation = invitationResult.rows[0];
    
    if (!invitation) {
      console.log('❌ No invitation found for nathan.harris02+test@gmail.com');
      return;
    }
    
    console.log('Invitation ID:', invitation.id);
    console.log('Email:', invitation.email);
    console.log('Name:', `${invitation.first_name} ${invitation.last_name}`);
    console.log('Status:', invitation.invitation_status);
    console.log('Role:', invitation.invited_role);
    console.log('Created:', invitation.created_at);
    console.log('Accepted At:', invitation.accepted_at || 'Not accepted');
    console.log('Accepted By User ID:', invitation.accepted_by || 'None');
    console.log('Clerk Invitation ID:', invitation.clerk_invitation_id || 'None');
    console.log('Clerk Ticket:', invitation.clerk_ticket ? invitation.clerk_ticket.substring(0, 50) + '...' : 'None');
    
    if (invitation.accepted_user_id) {
      console.log('\n👤 Linked User Details:');
      console.log('User ID:', invitation.accepted_user_id);
      console.log('User Name:', invitation.accepted_user_name);
      console.log('User Email:', invitation.accepted_user_email);
      console.log('User Clerk ID:', invitation.accepted_user_clerk_id);
      console.log('User Created:', invitation.accepted_user_created);
    }
    
    // 2. Check if there's a user with the +test email
    console.log('\n🔍 Checking for user with +test email:');
    const testUserQuery = `
      SELECT * FROM users 
      WHERE email = 'nathan.harris02+test@gmail.com'
    `;
    
    const testUserResult = await client.query(testUserQuery);
    if (testUserResult.rows.length > 0) {
      console.log('✅ Found user with +test email:');
      const testUser = testUserResult.rows[0];
      console.log('User ID:', testUser.id);
      console.log('Name:', testUser.name);
      console.log('Email:', testUser.email);
      console.log('Clerk ID:', testUser.clerk_user_id);
      console.log('Created:', testUser.created_at);
    } else {
      console.log('❌ No user found with +test email');
    }
    
    // 3. Check all users with similar emails
    console.log('\n📧 All users with similar emails:');
    const similarEmailQuery = `
      SELECT id, name, email, clerk_user_id, created_at
      FROM users 
      WHERE email LIKE '%nathan.harris02%'
      ORDER BY created_at DESC
    `;
    
    const similarResult = await client.query(similarEmailQuery);
    similarResult.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Clerk ID: ${user.clerk_user_id}`);
      console.log(`   Created: ${user.created_at}`);
      console.log('');
    });
    
    // 4. Check audit logs for this invitation acceptance
    console.log('🔍 Checking audit logs for invitation acceptance:');
    const auditQuery = `
      SELECT * FROM audit_log 
      WHERE user_id IN (
        SELECT id FROM users WHERE email LIKE '%nathan.harris02%'
      )
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    const auditResult = await client.query(auditQuery);
    if (auditResult.rows.length > 0) {
      console.log('📝 Recent audit entries:');
      auditResult.rows.forEach((log, index) => {
        console.log(`${index + 1}. ${log.event_type} - ${log.action}`);
        console.log(`   User: ${log.user_id}`);
        console.log(`   Resource: ${log.resource_type}:${log.resource_id}`);
        console.log(`   Time: ${log.created_at}`);
        console.log(`   Success: ${log.success}`);
        if (log.metadata) {
          console.log(`   Metadata: ${JSON.stringify(log.metadata, null, 2)}`);
        }
        console.log('');
      });
    } else {
      console.log('❌ No relevant audit logs found');
    }
    
    // 5. Analysis summary
    console.log('📊 ANALYSIS SUMMARY:');
    console.log('===================');
    
    if (invitation.invitation_status === 'accepted' && invitation.accepted_user_email !== invitation.email) {
      console.log('🚨 PROBLEM CONFIRMED: Email mismatch during invitation acceptance');
      console.log(`   - Invitation was for: ${invitation.email}`);
      console.log(`   - But linked to user: ${invitation.accepted_user_email}`);
      console.log('');
      console.log('🔍 POSSIBLE CAUSES:');
      console.log('1. Clerk email normalization removed +test alias');
      console.log('2. User lookup by email found base email instead of +test');
      console.log('3. Existing user was incorrectly matched during acceptance');
      console.log('4. JWT ticket contained different email than invitation');
      
      // Recommendations
      console.log('\n💡 RECOMMENDED INVESTIGATION:');
      console.log('1. Check Clerk user record for both emails');
      console.log('2. Review invitation acceptance API logs');
      console.log('3. Test JWT ticket parsing for this invitation');
      console.log('4. Verify email matching logic in acceptance workflow');
    } else if (invitation.invitation_status === 'pending') {
      console.log('ℹ️ Invitation is still pending - no acceptance attempted yet');
    } else {
      console.log('✅ No obvious issues detected');
    }

  } catch (error) {
    console.error('❌ Error during analysis:', error);
  } finally {
    await client.end();
  }
}

// Run the analysis
analyzeSpecificCase()
  .then(() => {
    console.log('\n✅ Analysis complete');
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });