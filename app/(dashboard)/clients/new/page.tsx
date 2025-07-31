// app/(dashboard)/clients/new/page.tsx
"use client";

import { useMutation } from "@apollo/client";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreateClientDocument,
  GetClientsListOptimizedDocument,
} from "@/domains/clients/graphql/generated/graphql";
import {
  PayrollForm,
  PayrollFormData,
} from "@/domains/payrolls/components/payroll-form";
import { CreatePayrollDocument } from "@/domains/payrolls/graphql/generated/graphql";

export default function NewClientPage() {
  const router = useRouter();

  // Form state
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    active: true,
  });

  // Payroll form state
  const [payrollData, setPayrollData] = useState<PayrollFormData>({
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
    employeeCount: "0",
    goLiveDate: "",
    status: "Implementation",
  });

  const [createPayroll, setCreatePayroll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPayrollValid, setIsPayrollValid] = useState(false);

  // GraphQL operations
  const [createClient] = useMutation(CreateClientDocument, {
    refetchQueries: [{ query: GetClientsListOptimizedDocument }],
  });

  const [createPayrollMutation] = useMutation(CreatePayrollDocument);

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePayrollInputChange = (
    field: keyof PayrollFormData,
    value: string
  ) => {
    setPayrollData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create client first
      const clientResult = await createClient({
        variables: {
          object: {
            name: formData.name.trim(),
            contactPerson: formData.contact_person.trim() || null,
            contactEmail: formData.contact_email.trim() || null,
            contactPhone: formData.contact_phone.trim() || null,
          },
        },
      });

      const newClientId = clientResult.data?.insertClients?.returning[0]?.id;

      // Create payroll if requested and form is valid
      if (createPayroll && newClientId && isPayrollValid) {
        // Prepare mutation variables based on cycle type
        const mutationVariables = {
          clientId: newClientId,
          name: payrollData.name.trim(),
          cycleId: payrollData.cycleId,
          dateTypeId:
            payrollData.dateTypeId ||
            (payrollData.cycleId === "weekly" ||
            payrollData.cycleId === "fortnightly"
              ? "DOW"
              : null),
          dateValue: payrollData.dateValue
            ? parseInt(payrollData.dateValue)
            : null,
          primaryConsultantUserId: payrollData.primaryConsultantUserId || null,
          backupConsultantUserId: payrollData.backupConsultantUserId || null,
          managerUserId: payrollData.managerUserId || null,
          processingDaysBeforeEft: parseInt(
            payrollData.processingDaysBeforeEft
          ),
          // Add fortnightly week if applicable
          ...(payrollData.cycleId === "fortnightly" && {
            fortnightlyWeek: payrollData.fortnightlyWeek,
          }),
        };

        await createPayrollMutation({
          variables: {
            object: mutationVariables,
          },
        });
      }

      // Redirect to the newly created client's detail page
      router.push(`/clients/${newClientId}`);
    } catch (error) {
      console.error("Error creating client/payroll:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href="/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
            <p className="text-gray-500">
              Create a new client and optionally set up their payroll
            </p>
          </div>
        </div>
      </div>

      {/* Create Client Form with Tabs */}
      <form onSubmit={handleSubmit}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Client Details</TabsTrigger>
            <TabsTrigger value="payroll">Payroll Setup</TabsTrigger>
          </TabsList>

          {/* Client Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>
                  Enter the basic information about the client.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="client-name">Client Name *</Label>
                  <Input
                    id="client-name"
                    placeholder="Enter client name..."
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("name", e.target.value)
                    }
                    className="mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input
                    id="contact-person"
                    placeholder="Enter contact person name..."
                    value={formData.contact_person}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("contact_person", e.target.value)
                    }
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="Enter contact email..."
                    value={formData.contact_email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    placeholder="Enter contact phone..."
                    value={formData.contact_phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("contact_phone", e.target.value)
                    }
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked: boolean) =>
                      handleInputChange("active", checked)
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="active"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Active client
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Setup Tab */}
          <TabsContent value="payroll" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Setup (Optional)</CardTitle>
                <CardDescription>
                  Optionally create a payroll for this client. Choose from
                  weekly, fortnightly, bi-monthly, monthly, or quarterly cycles
                  with automatic business day adjustments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="create-payroll"
                    checked={createPayroll}
                    onCheckedChange={setCreatePayroll}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="create-payroll"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Create payroll for this client
                  </Label>
                </div>
              </CardContent>
            </Card>

            {createPayroll && (
              <PayrollForm
                formData={payrollData}
                onInputChange={handlePayrollInputChange}
                onValidationChange={setIsPayrollValid}
                isLoading={isLoading}
                showClientField={false}
                title="Payroll Configuration"
                description="Set up payroll schedule and assignments for this client"
              />
            )}
          </TabsContent>

          {/* Form Actions */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/clients")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            {createPayroll && (
              <Button
                type="submit"
                disabled={isLoading || !formData.name.trim() || !isPayrollValid}
              >
                {isLoading ? (
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Creating..." : "Create Client & Payroll"}
              </Button>
            )}
          </div>
        </Tabs>
      </form>
    </div>
  );
}
