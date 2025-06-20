// app/(dashboard)/payroll-schedule/page.tsx
import { AdvancedPayrollScheduler } from "@/domains/payrolls";
import { EnhancedPermissionGuard } from "@/components/auth/EnhancedPermissionGuard";

export default function PayrollSchedulePage() {
  return (
    <EnhancedPermissionGuard.ManagerGuard>
      <AdvancedPayrollScheduler />
    </EnhancedPermissionGuard.ManagerGuard>
  );
}
