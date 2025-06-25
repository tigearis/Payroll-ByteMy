"use client";

import { useRouter } from "next/navigation";
import { StaffManagementContent } from "@/components/staff-management-content";
import { ErrorBoundaryWrapper } from "@/components/error-boundary";

export default function StaffManagementPage() {
  const router = useRouter();

  const handleAddStaff = () => {
    router.push("/staff/new");
  };

  const handleEditStaff = (staffId: string) => {
    router.push(`/staff/${staffId}`);
  };

  return (
    <ErrorBoundaryWrapper>
      <StaffManagementContent 
        onAddStaff={handleAddStaff}
        onEditStaff={handleEditStaff}
      />
    </ErrorBoundaryWrapper>
  );
}