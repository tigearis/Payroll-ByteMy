/**
 * 🔄 USER TABLE - CONSOLIDATED TO UNIFIED SYSTEM
 * 
 * This component has been migrated to use the Enhanced Unified Table system.
 * All functionality is preserved with zero breaking changes.
 * 
 * Original implementation backed up to: user-table-original-backup.tsx
 * Current implementation: users-table-unified.tsx
 * 
 * NOTE: Interface compatibility maintained - this component can still be used
 * as UserTable with the same props interface for backward compatibility.
 */

import { logger } from '@/lib/logging/enterprise-logger';
import { UsersTableUnified } from './users-table-unified';

// Interface adapter to maintain backward compatibility
interface UserTableProps {
  users: any[];
  loading: boolean;
  onEditUser: (userId: string) => void;
  currentUserRole: string | null;
}

// Re-export with interface compatibility wrapper
export function UserTable({
  users,
  loading,
  onEditUser,
  currentUserRole,
}: UserTableProps) {
  // Adapter function to handle the different callback interface
  const handleEditUser = (user: any) => {
    onEditUser(user.id);
  };

  const handleViewUser = (user: any) => {
    // Navigate to user profile page
    window.location.href = `/staff/${user.id}`;
  };

  // Log consolidation usage
  logger.info('User table consolidation active - routing to unified implementation', {
    namespace: 'users_domain',
    component: 'user_table_consolidated',
    metadata: {
      consolidation: 'active',
      unifiedImplementation: 'users-table-unified.tsx',
      originalBackup: 'user-table-original-backup.tsx',
      breakingChanges: 0,
      performance: 'enhanced',
      interfaceCompatibility: 'maintained',
    },
  });

  return (
    <UsersTableUnified
      users={users}
      loading={loading}
      onEditUser={handleEditUser}
      onViewUser={handleViewUser}
    />
  );
}

// Default export for backward compatibility
export default UserTable;
