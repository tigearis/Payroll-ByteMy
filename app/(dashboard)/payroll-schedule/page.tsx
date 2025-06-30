// app/(dashboard)/payroll-schedule/page.tsx
import { AdvancedPayrollScheduler } from "@/domains/payrolls/components";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Card, CardContent } from "@/components/ui/card";

export default function PayrollSchedulePage() {
  return (
    <PermissionGuard 
       
      fallback={
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                You don't have permission to access the payroll scheduler.
                <br />
                This feature requires payroll write permissions.
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <AdvancedPayrollScheduler />
    </PermissionGuard>
  );
}
