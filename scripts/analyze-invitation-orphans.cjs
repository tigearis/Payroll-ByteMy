#!/usr/bin/env node

/**
 * Database Analysis: Invitation Orphans Detection
 * 
 * This script analyzes the database to find:
 * 1. Accepted invitations without corresponding user records
 * 2. Users without corresponding invitation records
 * 3. Invitation/user email mismatches
 * 4. General data consistency issues
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

// SQL queries for analysis
const QUERIES = {
  // Get all invitations with their acceptance details
  getAllInvitations: `
    SELECT 
      ui.id,
      ui.email,
      ui.first_name,
      ui.last_name,
      ui.invitation_status,
      ui.invited_role,
      ui.accepted_at,
      ui.accepted_by,
      ui.clerk_invitation_id,
      ui.clerk_ticket,
      ui.created_at,
      ui.expires_at,
      u.id as accepted_user_id,
      u.name as accepted_user_name,
      u.email as accepted_user_email,
      u.clerk_user_id as accepted_user_clerk_id,
      u.role as accepted_user_role,
      u.is_active as accepted_user_active,
      u.created_at as accepted_user_created
    FROM user_invitations ui
    LEFT JOIN users u ON ui.accepted_by = u.id
    ORDER BY ui.created_at DESC
  `,

  // Get all users
  getAllUsers: `
    SELECT 
      id,
      name,
      email,
      clerk_user_id,
      role,
      is_active,
      is_staff,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC
  `,

  // Get accepted invitations without corresponding users
  getOrphanedInvitations: `
    SELECT 
      ui.id,
      ui.email,
      ui.first_name,
      ui.last_name,
      ui.invitation_status,
      ui.invited_role,
      ui.accepted_at,
      ui.clerk_invitation_id,
      ui.created_at
    FROM user_invitations ui
    WHERE ui.invitation_status = 'accepted' 
    AND ui.accepted_by IS NULL
  `,

  // Get staff users without invitation records (might have been created via webhook)
  getUsersWithoutInvitations: `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.clerk_user_id,
      u.role,
      u.created_at
    FROM users u
    WHERE u.is_staff = true
    AND NOT EXISTS (
      SELECT 1 FROM user_invitations ui 
      WHERE ui.accepted_by = u.id
    )
  `,

  // Check for email mismatches between invitations and users
  getEmailMismatches: `
    SELECT 
      ui.id as invitation_id,
      ui.email as invitation_email,
      ui.first_name,
      ui.last_name,
      u.id as user_id,
      u.name as user_name,
      u.email as user_email,
      u.clerk_user_id
    FROM user_invitations ui
    INNER JOIN users u ON ui.accepted_by = u.id
    WHERE ui.email != u.email
  `,

  // Get expired pending invitations
  getExpiredInvitations: `
    SELECT 
      id,
      email,
      first_name,
      last_name,
      invitation_status,
      expires_at,
      created_at,
      EXTRACT(DAY FROM (NOW() - expires_at)) as days_overdue
    FROM user_invitations
    WHERE invitation_status = 'pending'
    AND expires_at < NOW()
  `,

  // Get invitation status summary
  getStatusSummary: `
    SELECT 
      invitation_status,
      COUNT(*) as count
    FROM user_invitations
    GROUP BY invitation_status
    ORDER BY count DESC
  `
};

async function analyzeDatabase() {
  console.log('🔍 Starting Database Analysis for Invitation Orphans...\n');
  
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Connected to database\n");

    // 1. Get all invitations
    console.log('📊 Fetching all invitations...');
    const invitationsResult = await client.query(QUERIES.getAllInvitations);
    const allInvitations = invitationsResult.rows;
    
    console.log(`Found ${allInvitations.length} total invitations\n`);

    // 2. Get all users
    console.log('👥 Fetching all users...');
    const usersResult = await client.query(QUERIES.getAllUsers);
    const allUsers = usersResult.rows;
    
    console.log(`Found ${allUsers.length} total users\n`);

    // 3. Check for accepted invitations without users
    console.log('🚨 Checking for accepted invitations without corresponding users...');
    const orphanInvitationsResult = await client.query(QUERIES.getOrphanedInvitations);
    const orphanInvitations = orphanInvitationsResult.rows;
    
    if (orphanInvitations.length > 0) {
      console.log(`❌ Found ${orphanInvitations.length} orphaned accepted invitations:\n`);
      orphanInvitations.forEach((inv, index) => {
        console.log(`${index + 1}. ${inv.first_name} ${inv.last_name} (${inv.email})`);
        console.log(`   - Invitation ID: ${inv.id}`);
        console.log(`   - Role: ${inv.invited_role}`);
        console.log(`   - Accepted: ${inv.accepted_at}`);
        console.log(`   - Clerk ID: ${inv.clerk_invitation_id || 'None'}`);
        console.log('');
      });
    } else {
      console.log('✅ No orphaned accepted invitations found\n');
    }

    // 4. Check for users without invitations
    console.log('🔍 Checking for staff users without invitation records...');
    const usersWithoutInvitationsResult = await client.query(QUERIES.getUsersWithoutInvitations);
    const usersWithoutInvitations = usersWithoutInvitationsResult.rows;
    
    if (usersWithoutInvitations.length > 0) {
      console.log(`⚠️ Found ${usersWithoutInvitations.length} staff users without invitation records:\n`);
      usersWithoutInvitations.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
        console.log(`   - User ID: ${user.id}`);
        console.log(`   - Role: ${user.role}`);
        console.log(`   - Clerk ID: ${user.clerk_user_id || 'None'}`);
        console.log(`   - Created: ${user.created_at}`);
        console.log('');
      });
    } else {
      console.log('✅ All staff users have corresponding invitation records\n');
    }

    // 5. Analyze invitation statuses
    console.log('📈 Invitation Status Summary:');
    const statusResult = await client.query(QUERIES.getStatusSummary);
    statusResult.rows.forEach(row => {
      console.log(`   - ${row.invitation_status}: ${row.count}`);
    });
    console.log('');

    // 6. Check for email mismatches
    console.log('🔍 Checking for email mismatches between invitations and users...');
    const emailMismatchesResult = await client.query(QUERIES.getEmailMismatches);
    const emailMismatches = emailMismatchesResult.rows;
    
    if (emailMismatches.length > 0) {
      console.log(`⚠️ Found ${emailMismatches.length} email mismatches:\n`);
      emailMismatches.forEach((mismatch, index) => {
        console.log(`${index + 1}. Invitation email: ${mismatch.invitation_email}`);
        console.log(`   User email: ${mismatch.user_email}`);
        console.log(`   User: ${mismatch.user_name} (ID: ${mismatch.user_id})`);
        console.log(`   Clerk ID: ${mismatch.clerk_user_id || 'None'}`);
        console.log('');
      });
    } else {
      console.log('✅ No email mismatches found\n');
    }

    // 7. Check for expired invitations
    console.log('⏰ Checking for expired invitations...');
    const expiredResult = await client.query(QUERIES.getExpiredInvitations);
    const expiredInvitations = expiredResult.rows;
    
    if (expiredInvitations.length > 0) {
      console.log(`⏰ Found ${expiredInvitations.length} expired pending invitations:\n`);
      expiredInvitations.forEach((inv, index) => {
        console.log(`${index + 1}. ${inv.first_name} ${inv.last_name} (${inv.email})`);
        console.log(`   - Expired: ${inv.expires_at}`);
        console.log(`   - Days overdue: ${Math.floor(inv.days_overdue)}`);
        console.log('');
      });
    } else {
      console.log('✅ No expired pending invitations found\n');
    }

    // 8. Summary
    console.log('📋 SUMMARY:');
    console.log(`Total Invitations: ${allInvitations.length}`);
    console.log(`Total Users: ${allUsers.length}`);
    console.log(`Orphaned Accepted Invitations: ${orphanInvitations.length}`);
    console.log(`Users Without Invitations: ${usersWithoutInvitations.length}`);
    console.log(`Email Mismatches: ${emailMismatches.length}`);
    console.log(`Expired Pending Invitations: ${expiredInvitations.length}`);
    
    if (orphanInvitations.length > 0 || emailMismatches.length > 0) {
      console.log('\n❌ DATA INCONSISTENCY DETECTED - Investigation needed!');
      return false;
    } else {
      console.log('\n✅ Database appears consistent');
      return true;
    }

  } catch (error) {
    console.error('❌ Error during database analysis:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return false;
  } finally {
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

// Run the analysis
analyzeDatabase()
  .then((isConsistent) => {
    process.exit(isConsistent ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });