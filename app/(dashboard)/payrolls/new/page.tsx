"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href="/payrolls">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Payrolls
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Payroll
            </h1>
            <p className="text-gray-500">
              Set up a new payroll with schedule and consultant assignments
            </p>
          </div>
        </div>
      </div>

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
    </div>
  );
}
