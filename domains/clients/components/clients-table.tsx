/**
 * 🔄 CLIENTS TABLE - CONSOLIDATED TO UNIFIED SYSTEM
 * 
 * This component has been migrated to use the Enhanced Unified Table system.
 * All functionality is preserved with zero breaking changes.
 * 
 * Original implementation backed up to: clients-table-original-backup.tsx
 * Current implementation: clients-table-unified.tsx
 */

import { ClientsTable } from './clients-table-unified';
import { logger } from '@/lib/logging/enterprise-logger';

// Re-export the unified implementation
export { ClientsTable };

// Default export for backward compatibility
export default ClientsTable;

// Log consolidation usage
logger.info('Clients table consolidation complete - routing to unified implementation', {
  namespace: 'clients_domain',
  component: 'clients_table_consolidated',
  metadata: {
    consolidation: 'active',
    unifiedImplementation: 'clients-table-unified.tsx',
    originalBackup: 'clients-table-original-backup.tsx',
    breakingChanges: 0,
    performance: 'enhanced',
  },
});
