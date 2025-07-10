"use client";

import { useQuery } from "@apollo/client";
import { useEffect, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetClientsSimpleDocument } from "@/domains/clients/graphql/generated/graphql";
import EnhancedCalendar, {
  PAYROLL_DATE_TYPES,
  PAYROLL_CYCLES,
  WEEKDAYS,
} from "@/domains/payrolls/components/enhanced-calendar";
import {
  GetPayrollCyclesDocument,
  GetPayrollDateTypesDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import { GetUsersForDropdownDomainDocument } from "@/domains/users/graphql/generated/graphql";

export interface PayrollFormData {
  name: string;
  clientId?: string;
  cycleId: string;
  dateTypeId: string;
  dateValue: string;
  fortnightlyWeek: string;
  primaryConsultantUserId: string;
  backupConsultantUserId: string;
  managerUserId: string;
  processingDaysBeforeEft: string;
  processingTime: string;
  employeeCount: string;
  goLiveDate: string;
  status: string;
}

export interface PayrollFormProps {
  formData: PayrollFormData;
  onInputChange: (field: keyof PayrollFormData, value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  isLoading?: boolean;
  showClientField?: boolean;
  clientName?: string;
  title?: string;
  description?: string;
}

function PayrollFormComponent({
  formData,
  onInputChange,
  onValidationChange,
  isLoading = false,
  showClientField = false,
  clientName,
  title = "Payroll Configuration",
  description = "Set up payroll schedule and assignments",
}: PayrollFormProps) {
  // Role formatting helper
  const formatRole = (role: string): string => {
    switch (role) {
      case 'org_admin':
        return 'Admin';
      case 'manager':
        return 'Manager';
      case 'consultant':
        return 'Consultant';
      case 'developer':
        return 'Developer';
      case 'viewer':
        return 'Viewer';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  // Queries
  const { data: clientsData } = useQuery(GetClientsSimpleDocument, {
    skip: !showClientField,
  });
  const { data: usersData } = useQuery(GetUsersForDropdownDomainDocument);
  const { data: cyclesData } = useQuery(GetPayrollCyclesDocument);
  const { data: dateTypesData } = useQuery(GetPayrollDateTypesDocument);

  // User & consultant lists
  const users = usersData?.users || [];
  const allStaff = users;
  const availablePrimaryConsultants = allStaff;
  const availableBackupConsultants = allStaff.filter(
    (user: any) => user.id !== formData.primaryConsultantUserId
  );
  const availableManagers = users.filter((user: any) =>
    ["manager", "developer", "org_admin"].includes(user.role)
  );

  // Date types by cycle
  const availableDateTypes =
    formData.cycleId &&
    PAYROLL_DATE_TYPES[formData.cycleId as keyof typeof PAYROLL_DATE_TYPES]
      ? PAYROLL_DATE_TYPES[formData.cycleId as keyof typeof PAYROLL_DATE_TYPES]
      : [];

  // Handle child updates (local or via parent, always push to parent)
  const handleChange = (field: keyof PayrollFormData, value: string) => {
    onInputChange(field, value);
  };

  // Validation
  const getCycleNameById = (id: string) =>
    cyclesData?.payrollCycles
      .find((c: any) => c.id === id)
      ?.name?.toLowerCase();

  const isFormValid = () => {
    if (
      !formData.name.trim() ||
      !formData.cycleId ||
      !formData.processingDaysBeforeEft ||
      !formData.processingTime
    )
      return false;
    
    // Validate processing days range
    const processingDays = parseInt(formData.processingDaysBeforeEft);
    if (isNaN(processingDays) || processingDays < 1 || processingDays > 10) {
      return false;
    }
    
    // Validate processing time range (1-24 hours)
    const processingTime = parseInt(formData.processingTime);
    if (isNaN(processingTime) || processingTime < 1 || processingTime > 24) {
      return false;
    }
    
    if (showClientField && !formData.clientId) return false;

    const cycleName = getCycleNameById(formData.cycleId);
    if (cycleName === "weekly") return !!formData.dateValue;
    if (cycleName === "fortnightly")
      return !!(formData.fortnightlyWeek && formData.dateValue);

    if (["bi_monthly", "monthly", "quarterly"].includes(cycleName)) {
      if (!formData.dateTypeId) return false;
      const dateTypeName = dateTypesData?.payrollDateTypes
        .find((dt: any) => dt.id === formData.dateTypeId)
        ?.name?.toLowerCase();
      if (dateTypeName === "fixed_date" || formData.dateTypeId === "fixed")
        return !!formData.dateValue;
      return true;
    }
    return true;
  };

  useEffect(() => {
    if (onValidationChange) onValidationChange(isFormValid());
    // eslint-disable-next-line
  }, [formData, onValidationChange]);

  // Render date config input
  const renderDateValueInput = () => {
    const cycleId = formData.cycleId;
    const dateTypeId = formData.dateTypeId;

    if (!cycleId) {
      return (
        <Input
          id="date-value"
          placeholder="Select cycle first"
          disabled
          className="mt-1"
        />
      );
    }

    if (cycleId === "weekly") {
      return (
        <div className="space-y-2">
          <Label htmlFor="weekday">Day of Week</Label>
          <Select
            value={formData.dateValue}
            onValueChange={value => handleChange("dateValue", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select day of week..." />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map(weekday => (
                <SelectItem key={weekday.value} value={weekday.value}>
                  {weekday.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (cycleId === "fortnightly") {
      return (
        <div className="space-y-2">
          <Label htmlFor="fortnightly-calendar">Select Week & Day</Label>
          <EnhancedCalendar
            mode="fortnightly"
            selectedWeek={formData.fortnightlyWeek}
            selectedDay={formData.dateValue}
            onWeekSelect={week => handleChange("fortnightlyWeek", week)}
            onDaySelect={day => handleChange("dateValue", day)}
          />
        </div>
      );
    }

    if (cycleId === "bi_monthly") {
      return (
        <div className="mt-1">
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {dateTypeId === "SOM" &&
              "1st and 15th of each month (14th in February)"}
            {dateTypeId === "EOM" &&
              "30th and 15th of each month (14th & 28th in February)"}
            {!dateTypeId && "Select date type above"}
          </p>
        </div>
      );
    }

    if (cycleId === "monthly" || cycleId === "quarterly") {
      if (dateTypeId === "SOM") {
        return (
          <div className="mt-1">
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              Start of month (1st) with next business day adjustment
            </p>
          </div>
        );
      }
      if (dateTypeId === "EOM") {
        return (
          <div className="mt-1">
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              End of month (last day) with previous business day adjustment
            </p>
          </div>
        );
      }
      if (dateTypeId === "fixed" || dateTypeId === "fixed_date") {
        return (
          <div className="space-y-2">
            <Label htmlFor="fixed-date-calendar">Select Day of Month</Label>
            <EnhancedCalendar
              mode="fixed"
              selectedDay={formData.dateValue}
              onDaySelect={day => handleChange("dateValue", day)}
            />
          </div>
        );
      }
      return (
        <div className="mt-1">
          <p className="text-sm text-gray-500">Select date type above</p>
        </div>
      );
    }

    return (
      <Input
        id="date-value"
        placeholder="Configure cycle and date type above"
        disabled
        className="mt-1"
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Basic Information</h4>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {showClientField ? (
              <div>
                <Label htmlFor="client">Client *</Label>
                <Select
                  value={formData.clientId || ""}
                  onValueChange={value => handleChange("clientId", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsData?.clients?.map((client: any) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="client-name">Client</Label>
                <Input
                  id="client-name"
                  value={clientName || ""}
                  disabled={true}
                  className="mt-1 bg-gray-50"
                />
              </div>
            )}
            <div>
              <Label htmlFor="payroll-name">Payroll Name *</Label>
              <Input
                id="payroll-name"
                placeholder="Enter payroll name..."
                value={formData.name}
                onChange={e => handleChange("name", e.target.value)}
                className="mt-1"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Single row for Employee Count, Go Live Date, and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="employee-count">Employee Count</Label>
              <Input
                id="employee-count"
                type="number"
                placeholder="Enter number of employees..."
                value={formData.employeeCount}
                onChange={e => handleChange("employeeCount", e.target.value)}
                className="mt-1"
                disabled={isLoading}
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of employees on this payroll
              </p>
            </div>
            <div>
              <Label htmlFor="go-live-date">Go Live Date</Label>
              <Input
                id="go-live-date"
                type="date"
                value={formData.goLiveDate}
                onChange={e => handleChange("goLiveDate", e.target.value)}
                className="mt-1"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                When this payroll will go live in the system
              </p>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={value => handleChange("status", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Implementation">Implementation</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Current payroll status
              </p>
            </div>
          </div>

          {/* Processing Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="processing-days">
                  Processing Days Before EFT *
                </Label>
                <Input
                  id="processing-days"
                  type="number"
                  placeholder="e.g., 3"
                  value={formData.processingDaysBeforeEft}
                  onChange={e =>
                    handleChange("processingDaysBeforeEft", e.target.value)
                  }
                  className="mt-1"
                  disabled={isLoading}
                  min="1"
                  max="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Business days required for payroll processing before EFT date (typically 1-10 days)
                </p>
              </div>
              <div>
                <Label htmlFor="processing-time">
                  Max Processing Time (Hours) *
                </Label>
                <Input
                  id="processing-time"
                  type="number"
                  placeholder="e.g., 4"
                  value={formData.processingTime}
                  onChange={e =>
                    handleChange("processingTime", e.target.value)
                  }
                  className="mt-1"
                  disabled={isLoading}
                  min="1"
                  max="24"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum hours needed to process this payroll (1-24 hours)
                </p>
              </div>
            </div>

          {/* Payroll Cycle row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cycle-id">Payroll Cycle *</Label>
              <Select
                value={formData.cycleId}
                onValueChange={value => handleChange("cycleId", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select cycle..." />
                </SelectTrigger>
                <SelectContent>
                  {PAYROLLCYCLES.map(cycle => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Type dropdown (only for relevant cycles) */}
          {(formData.cycleId === "bi_monthly" ||
            formData.cycleId === "monthly" ||
            formData.cycleId === "quarterly") && (
            <div>
              <Label htmlFor="date-type-id">Date Type *</Label>
              <Select
                value={formData.dateTypeId}
                onValueChange={value => handleChange("dateTypeId", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select date type..." />
                </SelectTrigger>
                <SelectContent>
                  {availableDateTypes.map(dateType => (
                    <SelectItem key={dateType.id} value={dateType.id}>
                      {dateType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date config (calendar or day selector) */}
          {formData.cycleId && (
            <div>
              <Label htmlFor="date-value">Date Configuration</Label>
              {renderDateValueInput()}
            </div>
          )}

          {/* Primary Consultant */}
          <div>
            <Label htmlFor="primary-consultant">Primary Consultant</Label>
            <Select
              value={formData.primaryConsultantUserId}
              onValueChange={value =>
                handleChange("primaryConsultantUserId", value)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select primary consultant..." />
              </SelectTrigger>
              <SelectContent>
                {availablePrimaryConsultants.map((consultant: any) => (
                  <SelectItem key={consultant.id} value={consultant.id}>
                    {consultant.name} ({consultant.email}) - {formatRole(consultant.role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Any staff member can be assigned as primary consultant
            </p>
          </div>

          {/* Backup Consultant */}
          <div>
            <Label htmlFor="backup-consultant">Backup Consultant</Label>
            <Select
              value={formData.backupConsultantUserId || "none"}
              onValueChange={value =>
                handleChange(
                  "backupConsultantUserId",
                  value === "none" ? "" : value
                )
              }
              disabled={isLoading}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select backup consultant..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {availableBackupConsultants.map((consultant: any) => (
                  <SelectItem key={consultant.id} value={consultant.id}>
                    {consultant.name} ({consultant.email}) - {formatRole(consultant.role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.primaryConsultantUserId &&
              availableBackupConsultants.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ No other staff available - primary consultant cannot be
                  backup
                </p>
              )}
            {!formData.primaryConsultantUserId && (
              <p className="text-xs text-gray-500 mt-1">
                Select primary consultant first to see available backup options
              </p>
            )}
            {formData.primaryConsultantUserId &&
              availableBackupConsultants.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Cannot select the same person as primary consultant
                </p>
              )}
          </div>

          {/* Manager */}
          <div>
            <Label htmlFor="manager">Manager</Label>
            <Select
              value={formData.managerUserId}
              onValueChange={value => handleChange("managerUserId", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select manager..." />
              </SelectTrigger>
              <SelectContent>
                {availableManagers.map((manager: any) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name} ({manager.email}) - {formatRole(manager.role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Only users with Manager, Admin, or Org Admin roles can be assigned
              as managers
              {availableManagers.length === 0 && (
                <span className="text-amber-600 block mt-1">
                  ⚠️ No users with manager-level roles available
                </span>
              )}
            </p>
          </div>

          {/* Quarterly info note */}
          {formData.cycleId === "quarterly" && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Quarterly Processing:</strong> Payrolls will be
                processed in March, June, September, and December.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PERFORMANCE OPTIMIZED EXPORT WITH REACT.MEMO
// ============================================================================

/**
 * Custom comparison function for PayrollForm React.memo
 * Optimizes re-renders by comparing complex props efficiently
 */
function arePayrollFormPropsEqual(
  prevProps: PayrollFormProps,
  nextProps: PayrollFormProps
): boolean {
  // Quick primitive checks first
  if (
    prevProps.isLoading !== nextProps.isLoading ||
    prevProps.showClientField !== nextProps.showClientField ||
    prevProps.clientName !== nextProps.clientName ||
    prevProps.title !== nextProps.title ||
    prevProps.description !== nextProps.description
  ) {
    return false;
  }

  // FormData comparison (most important and frequent changes)
  if (prevProps.formData !== nextProps.formData) {
    // Deep comparison of form data fields
    const prevForm = prevProps.formData;
    const nextForm = nextProps.formData;
    
    return (
      prevForm.name === nextForm.name &&
      prevForm.clientId === nextForm.clientId &&
      prevForm.cycleId === nextForm.cycleId &&
      prevForm.dateTypeId === nextForm.dateTypeId &&
      prevForm.dateValue === nextForm.dateValue &&
      prevForm.fortnightlyWeek === nextForm.fortnightlyWeek &&
      prevForm.primaryConsultantUserId === nextForm.primaryConsultantUserId &&
      prevForm.backupConsultantUserId === nextForm.backupConsultantUserId &&
      prevForm.managerUserId === nextForm.managerUserId &&
      prevForm.processingDaysBeforeEft === nextForm.processingDaysBeforeEft &&
      prevForm.processingTime === nextForm.processingTime &&
      prevForm.employeeCount === nextForm.employeeCount &&
      prevForm.goLiveDate === nextForm.goLiveDate &&
      prevForm.status === nextForm.status
    );
  }

  // Function comparison - these typically change on every render
  // We skip comparing functions as they're likely to have different references
  // but the form behavior should remain consistent
  
  return true;
}

/**
 * Memoized PayrollForm Component
 * 
 * Prevents unnecessary re-renders when props haven't meaningfully changed.
 * Optimized for complex form interactions with multiple GraphQL queries.
 */
export const PayrollForm = memo(
  PayrollFormComponent,
  arePayrollFormPropsEqual
);

export default PayrollForm;