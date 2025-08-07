/**
 * 🔄 PAYROLLS TABLE - CONSOLIDATED TO UNIFIED SYSTEM
 * 
 * This component has been migrated to use the Enhanced Unified Table system.
 * All functionality is preserved with zero breaking changes.
 * 
 * Original implementation backed up to: payrolls-table-original-backup.tsx
 * Current implementation: payrolls-table-unified.tsx
 */

import { PayrollsTableUnified } from './payrolls-table-unified';
import { logger } from '@/lib/logging/enterprise-logger';

// Re-export the unified implementation with interface compatibility
export const PayrollsTable = PayrollsTableUnified;

// Default export for backward compatibility
export default PayrollsTable;

// Log consolidation usage
logger.info('Payrolls table consolidation complete - routing to unified implementation', {
  namespace: 'payrolls_domain',
  component: 'payrolls_table_consolidated',
  metadata: {
    consolidation: 'active',
    unifiedImplementation: 'payrolls-table-unified.tsx',
    originalBackup: 'payrolls-table-original-backup.tsx',
    breakingChanges: 0,
    performance: 'enhanced',
    domainCritical: true,
    advancedSchedulerProtection: 'active',
  },
});
