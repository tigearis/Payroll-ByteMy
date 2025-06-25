"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StaffManagementContent } from "@/components/staff-management-content";
import { ErrorBoundaryWrapper } from "@/components/error-boundary";
import { CreateUserModal } from "@/domains/users/components/create-user-modal";
import { useUserManagement } from "@/hooks/use-user-management";

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

  return (
    <ErrorBoundaryWrapper>
      <StaffManagementContent 
        onAddStaff={handleAddStaff}
        onEditStaff={handleEditStaff}
      />
      
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        managers={managers}
        permissions={permissions}
        currentUserRole={currentUserRole}
      />
    </ErrorBoundaryWrapper>
  );
}