// app/(dashboard)/tax-calculator/page.tsx
import { AustralianTaxCalculator } from "@/components/australian-tax-calculator";
import { PermissionGuard } from "@/components/auth/permission-guard";

export default function TaxCalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Australian Tax Calculator
        </h2>
        <p className="text-muted-foreground">
          Estimate tax for Australian payroll
        </p>
      </div>
      <PermissionGuard 
        permission="payroll:read"
        fallback={
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              You need payroll access to use the tax calculator.
            </p>
          </div>
        }
      >
        <AustralianTaxCalculator />
      </PermissionGuard>
    </div>
  );
}
