// app/(dashboard)/tax-calculator/page.tsx
import { AustralianTaxCalculator } from "@/components/australian-tax-calculator";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { FeatureFlagGuard } from "@/lib/feature-flags";

export default function TaxCalculatorPage() {
  return (
    <FeatureFlagGuard
      feature="taxCalculator"
      fallback={
        <div className="container mx-auto py-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Australian Tax Calculator
            </h2>
            <p className="text-muted-foreground">
              Tax Calculator is currently disabled
            </p>
          </div>
          <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                Tax Calculator Unavailable
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This feature is currently disabled. Please contact your
                administrator to enable it.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Australian Tax Calculator"
          description="Estimate tax for Australian payroll"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Tax Calculator" },
          ]}
        />
        <PermissionGuard
          resource="dashboard"
          action="read"
          fallback={
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">
                You need dashboard access to use the tax calculator.
              </p>
            </div>
          }
        >
          <AustralianTaxCalculator />
        </PermissionGuard>
      </div>
    </FeatureFlagGuard>
  );
}
