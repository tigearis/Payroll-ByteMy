// Email Template Specific Types
// Security Classification: HIGH - Template configuration data

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  availableVariables: string[];
}

export const EMAIL_CATEGORIES: Record<string, TemplateCategory> = {
  payroll: {
    id: 'payroll',
    name: 'Payroll',
    description: 'Payroll processing and employee notifications',
    icon: 'DollarSign',
    color: '#2563eb',
    availableVariables: [
      'payroll.name',
      'payroll.employee_count',
      'payroll.processing_date',
      'payroll.go_live_date',
      'client.name',
      'client.contact_name',
      'employee.first_name',
      'employee.last_name',
      'manager.name'
    ]
  },
  billing: {
    id: 'billing',
    name: 'Billing',
    description: 'Invoices, payment reminders, and financial communications',
    icon: 'Receipt',
    color: '#059669',
    availableVariables: [
      'invoice.number',
      'invoice.amount',
      'invoice.due_date',
      'invoice.period',
      'client.name',
      'client.contact_name',
      'billing.frequency',
      'payment.method'
    ]
  },
  client: {
    id: 'client',
    name: 'Client Communications',
    description: 'Project updates, service notifications, and general client communications',
    icon: 'Users',
    color: '#dc2626',
    availableVariables: [
      'client.name',
      'client.contact_name',
      'project.name',
      'project.status',
      'consultant.name',
      'manager.name',
      'service.name'
    ]
  },
  leave: {
    id: 'leave',
    name: 'Leave Management',
    description: 'Leave requests, approvals, and balance notifications',
    icon: 'Calendar',
    color: '#7c3aed',
    availableVariables: [
      'employee.first_name',
      'employee.last_name',
      'leave.type',
      'leave.start_date',
      'leave.end_date',
      'leave.days',
      'approver.name',
      'balance.remaining'
    ]
  },
  work_schedule: {
    id: 'work_schedule',
    name: 'Work Schedule',
    description: 'Assignment notifications and capacity management',
    icon: 'Clock',
    color: '#ea580c',
    availableVariables: [
      'consultant.first_name',
      'consultant.last_name',
      'assignment.title',
      'assignment.start_date',
      'assignment.end_date',
      'assignment.hours_per_week',
      'client.name',
      'project.name'
    ]
  },
  system: {
    id: 'system',
    name: 'System Notifications',
    description: 'System updates, maintenance, and administrative messages',
    icon: 'Settings',
    color: '#6b7280',
    availableVariables: [
      'user.first_name',
      'user.last_name',
      'system.name',
      'maintenance.date',
      'update.version',
      'admin.name'
    ]
  }
};

export interface TemplateVariableDefinition {
  key: string;
  label: string;
  description: string;
  category: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  required: boolean;
  example: string;
  format?: string; // For dates and numbers
}

export const PAYROLL_VARIABLES: TemplateVariableDefinition[] = [
  {
    key: 'payroll.name',
    label: 'Payroll Name',
    description: 'The name of the payroll being processed',
    category: 'payroll',
    dataType: 'string',
    required: true,
    example: 'ABC Corp - March 2024'
  },
  {
    key: 'payroll.employee_count',
    label: 'Employee Count',
    description: 'Number of employees in this payroll',
    category: 'payroll',
    dataType: 'number',
    required: false,
    example: '25'
  },
  {
    key: 'payroll.processing_date',
    label: 'Processing Date',
    description: 'Date when payroll was processed',
    category: 'payroll',
    dataType: 'date',
    required: false,
    example: '2024-03-15',
    format: 'DD/MM/YYYY'
  },
  {
    key: 'payroll.go_live_date',
    label: 'Go Live Date',
    description: 'Date when payroll goes live',
    category: 'payroll',
    dataType: 'date',
    required: false,
    example: '2024-03-20',
    format: 'DD/MM/YYYY'
  },
  {
    key: 'client.name',
    label: 'Client Name',
    description: 'Name of the client organization',
    category: 'client',
    dataType: 'string',
    required: true,
    example: 'ABC Corporation'
  }
];

export const BILLING_VARIABLES: TemplateVariableDefinition[] = [
  {
    key: 'invoice.number',
    label: 'Invoice Number',
    description: 'Unique invoice identifier',
    category: 'billing',
    dataType: 'string',
    required: true,
    example: 'INV-2024-001'
  },
  {
    key: 'invoice.amount',
    label: 'Invoice Amount',
    description: 'Total amount of the invoice',
    category: 'billing',
    dataType: 'currency',
    required: true,
    example: '1,250.00'
  },
  {
    key: 'invoice.due_date',
    label: 'Due Date',
    description: 'Payment due date',
    category: 'billing',
    dataType: 'date',
    required: true,
    example: '2024-04-15',
    format: 'DD/MM/YYYY'
  },
  {
    key: 'invoice.period',
    label: 'Billing Period',
    description: 'Period covered by this invoice',
    category: 'billing',
    dataType: 'string',
    required: false,
    example: 'March 2024'
  }
];

export const LEAVE_VARIABLES: TemplateVariableDefinition[] = [
  {
    key: 'employee.first_name',
    label: 'Employee First Name',
    description: 'First name of the employee',
    category: 'employee',
    dataType: 'string',
    required: true,
    example: 'John'
  },
  {
    key: 'leave.type',
    label: 'Leave Type',
    description: 'Type of leave requested',
    category: 'leave',
    dataType: 'string',
    required: true,
    example: 'Annual Leave'
  },
  {
    key: 'leave.start_date',
    label: 'Leave Start Date',
    description: 'First day of leave',
    category: 'leave',
    dataType: 'date',
    required: true,
    example: '2024-04-01',
    format: 'DD/MM/YYYY'
  },
  {
    key: 'leave.end_date',
    label: 'Leave End Date',
    description: 'Last day of leave',
    category: 'leave',
    dataType: 'date',
    required: true,
    example: '2024-04-05',
    format: 'DD/MM/YYYY'
  },
  {
    key: 'leave.days',
    label: 'Leave Days',
    description: 'Number of leave days',
    category: 'leave',
    dataType: 'number',
    required: true,
    example: '5'
  },
  {
    key: 'approver.name',
    label: 'Approver Name',
    description: 'Name of the person who approved the leave',
    category: 'approver',
    dataType: 'string',
    required: false,
    example: 'Jane Manager'
  }
];

export interface TemplateValidationRule {
  field: string;
  rule: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export const TEMPLATE_VALIDATION_RULES: TemplateValidationRule[] = [
  {
    field: 'name',
    rule: 'required',
    message: 'Template name is required'
  },
  {
    field: 'name',
    rule: 'minLength',
    value: 3,
    message: 'Template name must be at least 3 characters'
  },
  {
    field: 'subjectTemplate',
    rule: 'required',
    message: 'Subject template is required'
  },
  {
    field: 'htmlContent',
    rule: 'required',
    message: 'HTML content is required'
  },
  {
    field: 'htmlContent',
    rule: 'minLength',
    value: 10,
    message: 'HTML content must be at least 10 characters'
  },
  {
    field: 'category',
    rule: 'required',
    message: 'Template category is required'
  }
];

export interface TemplatePreviewData {
  [key: string]: any;
}

export const SAMPLE_PREVIEW_DATA: Record<string, TemplatePreviewData> = {
  payroll: {
    'payroll.name': 'ABC Corp - March 2024 Payroll',
    'payroll.employee_count': '25',
    'payroll.processing_date': '15/03/2024',
    'payroll.go_live_date': '20/03/2024',
    'client.name': 'ABC Corporation',
    'client.contact_name': 'Sarah Johnson',
    'employee.first_name': 'John',
    'employee.last_name': 'Smith',
    'manager.name': 'Jane Manager'
  },
  billing: {
    'invoice.number': 'INV-2024-001',
    'invoice.amount': '1,250.00',
    'invoice.due_date': '15/04/2024',
    'invoice.period': 'March 2024',
    'client.name': 'ABC Corporation',
    'client.contact_name': 'Sarah Johnson',
    'billing.frequency': 'Monthly',
    'payment.method': 'Bank Transfer'
  },
  client: {
    'client.name': 'ABC Corporation',
    'client.contact_name': 'Sarah Johnson',
    'project.name': 'Payroll Implementation',
    'project.status': 'In Progress',
    'consultant.name': 'John Consultant',
    'manager.name': 'Jane Manager',
    'service.name': 'Payroll Processing'
  },
  leave: {
    'employee.first_name': 'John',
    'employee.last_name': 'Smith',
    'leave.type': 'Annual Leave',
    'leave.start_date': '01/04/2024',
    'leave.end_date': '05/04/2024',
    'leave.days': '5',
    'approver.name': 'Jane Manager',
    'balance.remaining': '15'
  },
  work_schedule: {
    'consultant.first_name': 'John',
    'consultant.last_name': 'Consultant',
    'assignment.title': 'ABC Corp Payroll Project',
    'assignment.start_date': '01/04/2024',
    'assignment.end_date': '30/06/2024',
    'assignment.hours_per_week': '40',
    'client.name': 'ABC Corporation',
    'project.name': 'Payroll Implementation'
  },
  system: {
    'user.first_name': 'John',
    'user.last_name': 'User',
    'system.name': 'ByteMy Payroll',
    'maintenance.date': '01/04/2024',
    'update.version': '2.1.0',
    'admin.name': 'System Administrator'
  }
};