"use client";

import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Button } from "@/components/ui/button";
import {
  PayrollForm,
  PayrollFormData,
} from "@/domains/payrolls/components/payroll-form";

export default function NewPayrollPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<PayrollFormData>({
    name: "",
    clientId: "",
    cycleId: "",
    dateTypeId: "",
    dateValue: "",
    fortnightlyWeek: "",
    primaryConsultantUserId: "",
    backupConsultantUserId: "",
    managerUserId: "",
    processingDaysBeforeEft: "3",
    processingTime: "4",
    employeeCount: "",
    goLiveDate: new Date().toISOString().split("T")[0],
    status: "Implementation",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Handle input changes
  const handleInputChange = (field: keyof PayrollFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle validation changes from PayrollForm
  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // PayrollForm will handle validation and submission
      toast.success("Payroll created successfully!");
      router.push("/payrolls");
    } catch (error) {
      toast.error("Failed to create payroll");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Create New Payroll"
        description="Set up a new payroll with schedule and consultant assignments"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payrolls", href: "/payrolls" },
          { label: "New" },
        ]}
        actions={[
          { label: "Back to Payrolls", icon: ArrowLeft, href: "/payrolls" },
        ]}
      />

      <PermissionGuard
        resource="payrolls"
        action="create"
        fallback={
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            You do not have permission to create payrolls.
          </div>
        }
      >
        {/* Create Payroll Form */}
        <form onSubmit={handleSubmit}>
          <PayrollForm
            formData={formData}
            onInputChange={handleInputChange}
            onValidationChange={handleValidationChange}
            isLoading={isLoading}
            showClientField={true}
            title="Payroll Configuration"
            description="Configure the payroll schedule, assignments, and processing details."
          />

          {/* Form Actions */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/payrolls")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              {isLoading ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Creating..." : "Create Payroll"}
            </Button>
          </div>
        </form>
      </PermissionGuard>
    </div>
  );
}
