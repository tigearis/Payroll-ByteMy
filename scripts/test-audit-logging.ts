#!/usr/bin/env ts-node

/**
 * Test SOC2-Compliant Audit Logging System
 * 
 * Validates that audit logging captures all required events
 */

import { auditLogger } from '@/lib/audit/audit-logger';

async function testAuditLogging() {
  console.log('🔍 Testing SOC2-Compliant Audit Logging System...\n');

  // Test request context extraction
  const mockRequest = new Request('http://localhost:3000/test', {
    headers: {
      'x-forwarded-for': '192.168.1.100, 10.0.0.1',
      'user-agent': 'Mozilla/5.0 (Test Browser)',
      'x-request-id': 'test-req-123',
    },
  });

  const context = auditLogger.extractRequestContext(mockRequest);
  console.log('✅ Request context extracted:', context);

  // Test authentication events
  console.log('\n🔐 Testing Authentication Events:');
  
  try {
    await auditLogger.loginSuccess('user-123', 'test@example.com', context);
    console.log('✅ Login success logged');

    await auditLogger.loginFailure('invalid@example.com', 'Invalid credentials', context);
    console.log('✅ Login failure logged');

    await auditLogger.logout('user-123', 'test@example.com', context);
    console.log('✅ Logout logged');
  } catch (error) {
    console.error('❌ Auth event logging failed:', error);
  }

  // Test data access logging
  console.log('\n📊 Testing Data Access Events:');
  
  try {
    await auditLogger.dataAccess('user-123', 'READ', 'users', 'user-456', context);
    console.log('✅ Data access logged');

    await auditLogger.dataModification(
      'user-123',
      'UPDATE',
      'users',
      'user-456',
      { name: 'Old Name' },
      { name: 'New Name' },
      context
    );
    console.log('✅ Data modification logged');
  } catch (error) {
    console.error('❌ Data event logging failed:', error);
  }

  // Test permission denied events
  console.log('\n🚫 Testing Security Events:');
  
  try {
    await auditLogger.permissionDenied('user-123', 'DELETE', 'admin_settings', context);
    console.log('✅ Permission denied logged');
  } catch (error) {
    console.error('❌ Security event logging failed:', error);
  }

  // Test administrative actions
  console.log('\n🔧 Testing Administrative Events:');
  
  try {
    await auditLogger.adminAction(
      'admin-123',
      'ROLE_CHANGE',
      'users',
      'user-456',
      { oldRole: 'viewer', newRole: 'consultant' },
      context
    );
    console.log('✅ Admin action logged');
  } catch (error) {
    console.error('❌ Admin event logging failed:', error);
  }

  // Test bulk operations
  console.log('\n📦 Testing Bulk Operations:');
  
  try {
    await auditLogger.logBulkOperation({
      userId: 'admin-123',
      action: 'BULK_USER_IMPORT',
      entityType: 'users',
      bulkOperation: true,
      totalRecords: 100,
      successfulRecords: 95,
      failedRecords: 5,
      ...context,
    });
    console.log('✅ Bulk operation logged');
  } catch (error) {
    console.error('❌ Bulk operation logging failed:', error);
  }

  console.log('\n🎯 Audit logging test complete!');
}

// Run the test
testAuditLogging().catch(console.error);