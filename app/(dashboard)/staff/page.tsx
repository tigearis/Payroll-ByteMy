"use client";

import { StaffManagementContent } from "@/components/staff-management-content";
import { ErrorBoundaryWrapper } from "@/components/error-boundary";

export default function StaffManagementPage() {
  return (
    <ErrorBoundaryWrapper>
      <StaffManagementContent />
    </ErrorBoundaryWrapper>
  );
}