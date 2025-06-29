"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { ErrorBoundaryWrapper } from "@/components/error-boundary";
import { StaffManagementContent } from "@/components/staff-management-content";
import { CreateUserModal } from "@/domains/users/components/create-user-modal";
import { useUserManagement } from "@/hooks/use-user-management";
import { Role } from "@/types/enums";

export default function StaffManagementPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { managers, permissions, currentUserRole } = useUserManagement();

  const handleAddStaff = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditStaff = (staffId: string) => {
    router.push(`/staff/${staffId}`);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };
  const currentUserRoleDisplayName = Role[currentUserRole as keyof typeof Role];

  return (
    <PermissionGuard
      permission="staff:read"
      fallback={
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Access Denied
          </h3>
          <p className="text-sm text-destructive">
            You need staff management permissions to access this page.
          </p>
        </div>
      }
    >
      <ErrorBoundaryWrapper>
        <StaffManagementContent
          onAddStaff={handleAddStaff}
          onEditStaff={handleEditStaff}
        />

        <PermissionGuard permission="staff:write" fallback={null}>
          <CreateUserModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseModal}
            managers={managers}
            permissions={permissions}
            currentUserRole={currentUserRoleDisplayName}
          />
        </PermissionGuard>
      </ErrorBoundaryWrapper>
    </PermissionGuard>
  );
}
