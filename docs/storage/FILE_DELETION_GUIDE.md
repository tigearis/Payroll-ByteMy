# File Deletion Best Practices Guide

This guide explains the file deletion system in the Payroll Matrix application and provides best practices for developers working with file operations.

## 🎯 **System Overview**

The Payroll Matrix application uses a two-tier storage system:
- **Database**: PostgreSQL stores file metadata (filename, size, references, etc.)
- **Object Storage**: MinIO stores the actual file content

**Critical**: Both locations must be kept in sync. Deleting from only one location creates data inconsistency and storage waste.

## 🔧 **File Deletion Architecture**

### **Primary Components**

1. **Service Layer**: `lib/storage/document-operations.ts`
   - `deleteDocument()` - Proper deletion handling both database and MinIO
   - Includes error handling, audit logging, and cleanup verification

2. **API Endpoints**: `app/api/documents/[id]/route.ts`
   - DELETE method provides authenticated access to deletion service
   - Includes permission checks and role-based access control

3. **Event Trigger**: Hasura database trigger
   - Automatically cleans up MinIO when database records are deleted
   - Webhook: `/api/webhooks/file-cleanup`
   - Provides fallback protection for direct database operations

4. **Cleanup Service**: `lib/storage/file-cleanup-service.ts`
   - Identifies and removes orphaned files from MinIO
   - Scheduled cleanup via cron job (daily at 4 AM UTC)
   - Manual cleanup via admin API: `/api/admin/file-cleanup`

## ✅ **Recommended Deletion Methods**

### **Method 1: API Endpoint (Recommended)**

```typescript
// Frontend - using fetch
const response = await fetch(`/api/documents/${documentId}`, {
  method: 'DELETE',
});

if (response.ok) {
  console.log('File deleted successfully');
}
```

**Benefits:**
- ✅ Handles both database and MinIO cleanup
- ✅ Includes permission checks
- ✅ Provides audit logging
- ✅ Proper error handling
- ✅ Used by main UI components

### **Method 2: Service Layer (For Server-Side Code)**

```typescript
import { deleteDocument } from '@/lib/storage/document-operations';

try {
  await deleteDocument(documentId, userId);
  console.log('Document deleted successfully');
} catch (error) {
  console.error('Deletion failed:', error);
}
```

**Benefits:**
- ✅ Complete cleanup (database + MinIO)
- ✅ Audit logging
- ✅ Error handling with recovery attempts
- ✅ Transaction safety

## ⚠️ **Methods to Use with Caution**

### **Method 3: GraphQL Mutation (Database Only)**

```graphql
mutation DeleteFile($id: uuid!) {
  deleteFilesByPk(id: $id) {
    id
    filename
    objectKey
  }
}
```

**Important Notes:**
- ⚠️ Only deletes database record
- ✅ **BUT**: Event trigger automatically handles MinIO cleanup
- ⚠️ No built-in permission checks (relies on Hasura permissions)
- ⚠️ Limited error handling
- ✅ Safe to use due to event trigger backup

## 🚫 **Methods to Avoid**

### **Direct MinIO Operations**

```typescript
// ❌ DON'T DO THIS
await minioClient.deleteDocument(objectKey);
// This leaves orphaned database records
```

### **Direct Database Operations**

```sql
-- ❌ DON'T DO THIS
DELETE FROM files WHERE id = 'some-uuid';
-- This would trigger event cleanup, but bypasses application logic
```

## 🛡️ **Safety Mechanisms**

### **1. Hasura Event Trigger**

**Location**: `hasura/metadata/databases/default/tables/public_files.yaml`

```yaml
event_triggers:
  - name: file_cleanup_trigger
    definition:
      enable_manual: false
      delete:
        columns: "*"
    webhook: https://payroll.bytemy.com.au/api/webhooks/file-cleanup
```

**Purpose**: Automatically cleans up MinIO files when database records are deleted, regardless of deletion method.

### **2. Scheduled Cleanup**

**Location**: `hasura/metadata/cron_triggers.yaml`

```yaml
- name: file_cleanup_daily
  webhook: https://payroll.bytemy.com.au/api/cron/file-cleanup
  schedule: 0 4 * * *  # Daily at 4 AM UTC
```

**Purpose**: Daily cleanup of orphaned files that may have accumulated due to failed operations.

### **3. Manual Cleanup Tools**

**Admin API**: `/api/admin/file-cleanup`

```bash
# Get cleanup statistics
GET /api/admin/file-cleanup?action=stats

# Identify orphaned files (dry run)
GET /api/admin/file-cleanup?action=identify

# Perform cleanup
POST /api/admin/file-cleanup
Content-Type: application/json
{
  "dryRun": false,
  "batchSize": 50,
  "includeRecentFiles": false
}
```

## 📋 **Best Practices for Developers**

### **1. Always Use the Service Layer**

```typescript
// ✅ Good
import { deleteDocument } from '@/lib/storage/document-operations';
await deleteDocument(id, userId);

// ❌ Avoid
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { DeleteFileDocument } from '@/shared/types/generated/graphql';
await executeTypedQuery(DeleteFileDocument, { id });
```

### **2. Handle Errors Gracefully**

```typescript
try {
  await deleteDocument(documentId, userId);
  toast.success('Document deleted successfully');
} catch (error) {
  console.error('Delete failed:', error);
  toast.error('Failed to delete document. Please try again.');
}
```

### **3. Verify Permissions**

```typescript
import { usePermissions } from '@/hooks/use-permissions';

const { can } = usePermissions();
const canDelete = can('files', 'delete');

if (!canDelete) {
  return <div>You don't have permission to delete files</div>;
}
```

### **4. Provide User Feedback**

```typescript
const handleDelete = async (document) => {
  if (!confirm(`Delete "${document.filename}"?`)) return;
  
  setIsDeleting(true);
  try {
    await deleteDocument(document.id, userId);
    toast.success('Document deleted');
    onRefresh(); // Refresh the list
  } catch (error) {
    toast.error('Delete failed');
  } finally {
    setIsDeleting(false);
  }
};
```

## 🔍 **Monitoring and Debugging**

### **1. Audit Logs**

All file deletions are logged in the audit system:

```sql
SELECT * FROM audit.audit_log 
WHERE action IN ('DOCUMENT_DELETE', 'FILE_CLEANUP_WEBHOOK', 'FILE_CLEANUP_BATCH')
ORDER BY event_time DESC;
```

### **2. Cleanup Statistics**

Monitor cleanup operations:

```bash
# Get current statistics
curl -X GET /api/admin/file-cleanup?action=stats

# Response includes:
# - totalMinioFiles: Files in storage
# - totalDatabaseFiles: Database records
# - orphanedCount: Files needing cleanup
# - orphanedSize: Storage space to reclaim
```

### **3. Common Issues**

**Problem**: Files deleted from database but remain in MinIO
- **Cause**: Event trigger webhook failure
- **Solution**: Check webhook logs, run manual cleanup

**Problem**: Files deleted from MinIO but remain in database
- **Cause**: Direct MinIO operations (should be avoided)
- **Solution**: Clean up database records, check access patterns

**Problem**: Permission denied during deletion
- **Cause**: Insufficient user permissions
- **Solution**: Verify user roles and Hasura permissions

## 🚨 **Emergency Procedures**

### **Mass Cleanup of Orphaned Files**

```bash
# 1. Check the scope
curl -X GET "/api/admin/file-cleanup?action=stats"

# 2. Dry run to see what would be deleted
curl -X POST "/api/admin/file-cleanup" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true, "batchSize": 100}'

# 3. Perform actual cleanup (if safe)
curl -X POST "/api/admin/file-cleanup" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": false, "batchSize": 50}'
```

### **Webhook Debugging**

```bash
# Test webhook directly
curl -X POST "/api/cron/file-cleanup" \
  -H "x-hasura-cron-secret: YOUR_SECRET"

# Check webhook health
curl -X GET "/api/webhooks/file-cleanup"
```

## 📚 **Related Documentation**

- [MinIO Client Documentation](../storage/MINIO_CLIENT_GUIDE.md)
- [Hasura Permissions System](../security/HASURA_PERMISSIONS_SYSTEM.md)
- [API Authentication Guide](../auth/API_AUTH_GUIDE.md)
- [Audit Logging System](../audit/AUDIT_SYSTEM_GUIDE.md)

## 🏷️ **Version History**

- **v1.0** (2025-01-20): Initial implementation with service layer
- **v2.0** (2025-01-25): Added Hasura event triggers and automated cleanup
- **v2.1** (2025-01-25): Added scheduled cleanup and admin tools

---

**Remember**: When in doubt, use the API endpoint or service layer. The system is designed to be safe by default, but proper usage ensures optimal reliability and performance.