// Dashboard-related type definitions

export interface PayrollDate {
  id: string;
  adjustedEftDate: string;
  processingDate: string;
  originalEftDate: string;
  notes?: string;
  payrollId?: string;
  payroll?: {
    id: string;
    name: string;
    versionNumber: number;
    parentPayrollId?: string;
    goLiveDate?: string;
    supersededDate?: string;
    status: string;
  };
}

export interface Client {
  id: string;
  name: string;
}

export interface Consultant {
  id: string;
  name: string;
}

export interface UserUpcomingPayroll {
  id: string;
  name: string;
  status: string;
  client: Client;
  payrollDates?: PayrollDate[];
  primaryConsultant?: Consultant;
  backupConsultant?: Consultant;
  assignedManager?: Consultant;
  nextEftDate?: Array<{
    originalEftDate: string;
    adjustedEftDate: string;
    processingDate: string;
  }>;
  nextPayDate?: Array<{
    originalEftDate: string;
    adjustedEftDate: string;
    processingDate: string;
  }>;
}

export interface UserUpcomingPayrollsData {
  payrolls: UserUpcomingPayroll[];
}

export type StatusVariant = "default" | "secondary" | "destructive" | "outline";
