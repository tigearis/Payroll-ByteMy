// Email Variable Processor Service
// Security Classification: HIGH - Dynamic content processing
// SOC2 Compliance: Variable validation and audit logging

import type { 
  EmailCategory,
  PayrollEmailContext,
  BillingEmailContext,
  ClientEmailContext,
  LeaveEmailContext,
  WorkScheduleEmailContext
} from '../types';

interface VariableProcessorOptions {
  category: EmailCategory;
  businessContext?: Record<string, any>;
  userContext?: Record<string, any>;
}

class VariableProcessor {
  /**
   * Process business context data into email variables
   */
  async processBusinessContext(
    options: VariableProcessorOptions
  ): Promise<Record<string, any>> {
    const variables: Record<string, any> = {};

    switch (options.category) {
      case 'payroll':
        return this.processPayrollContext(options.businessContext);
      case 'billing':
        return this.processBillingContext(options.businessContext);
      case 'client':
        return this.processClientContext(options.businessContext);
      case 'leave':
        return this.processLeaveContext(options.businessContext);
      case 'work_schedule':
        return this.processWorkScheduleContext(options.businessContext);
      case 'system':
        return this.processSystemContext(options.businessContext);
      default:
        return variables;
    }
  }

  /**
   * Validate variable values before template processing
   */
  validateVariables(
    variables: Record<string, any>,
    requiredVariables: string[] = []
  ): {
    isValid: boolean;
    errors: string[];
    sanitizedVariables: Record<string, any>;
  } {
    const errors: string[] = [];
    const sanitizedVariables: Record<string, any> = {};

    // Check required variables
    requiredVariables.forEach(variable => {
      if (!variables.hasOwnProperty(variable) || 
          variables[variable] === null || 
          variables[variable] === undefined ||
          variables[variable] === '') {
        errors.push(`Required variable '${variable}' is missing or empty`);
      }
    });

    // Sanitize and validate all variables
    Object.entries(variables).forEach(([key, value]) => {
      try {
        sanitizedVariables[key] = this.sanitizeVariableValue(value);
      } catch (error: any) {
        errors.push(`Invalid value for variable '${key}': ${error.message}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedVariables
    };
  }

  /**
   * Get variable suggestions based on context
   */
  getVariableSuggestions(category: EmailCategory): Array<{
    key: string;
    label: string;
    example: string;
    required: boolean;
  }> {
    const suggestions: Record<EmailCategory, Array<{
      key: string;
      label: string;
      example: string;
      required: boolean;
    }>> = {
      payroll: [
        { key: 'payroll.name', label: 'Payroll Name', example: 'ABC Corp - March 2024', required: true },
        { key: 'client.name', label: 'Client Name', example: 'ABC Corporation', required: true },
        { key: 'payroll.employee_count', label: 'Employee Count', example: '25', required: false },
        { key: 'payroll.processing_date', label: 'Processing Date', example: '15/03/2024', required: false },
        { key: 'payroll.go_live_date', label: 'Go Live Date', example: '20/03/2024', required: false }
      ],
      billing: [
        { key: 'invoice.number', label: 'Invoice Number', example: 'INV-2024-001', required: true },
        { key: 'client.name', label: 'Client Name', example: 'ABC Corporation', required: true },
        { key: 'invoice.amount', label: 'Invoice Amount', example: '$1,250.00', required: true },
        { key: 'invoice.due_date', label: 'Due Date', example: '15/04/2024', required: true },
        { key: 'invoice.period', label: 'Billing Period', example: 'March 2024', required: false }
      ],
      client: [
        { key: 'client.name', label: 'Client Name', example: 'ABC Corporation', required: true },
        { key: 'client.contact_name', label: 'Contact Name', example: 'Sarah Johnson', required: false },
        { key: 'project.name', label: 'Project Name', example: 'Payroll Implementation', required: false },
        { key: 'consultant.name', label: 'Consultant Name', example: 'John Consultant', required: false }
      ],
      leave: [
        { key: 'employee.first_name', label: 'Employee First Name', example: 'John', required: true },
        { key: 'leave.type', label: 'Leave Type', example: 'Annual Leave', required: true },
        { key: 'leave.start_date', label: 'Start Date', example: '01/04/2024', required: true },
        { key: 'leave.end_date', label: 'End Date', example: '05/04/2024', required: true },
        { key: 'leave.days', label: 'Number of Days', example: '5', required: true }
      ],
      work_schedule: [
        { key: 'consultant.first_name', label: 'Consultant First Name', example: 'John', required: true },
        { key: 'assignment.title', label: 'Assignment Title', example: 'ABC Corp Payroll Project', required: true },
        { key: 'client.name', label: 'Client Name', example: 'ABC Corporation', required: true },
        { key: 'assignment.start_date', label: 'Start Date', example: '01/04/2024', required: false },
        { key: 'assignment.end_date', label: 'End Date', example: '30/06/2024', required: false }
      ],
      system: [
        { key: 'user.first_name', label: 'User First Name', example: 'John', required: true },
        { key: 'system.name', label: 'System Name', example: 'ByteMy Payroll', required: false },
        { key: 'maintenance.date', label: 'Maintenance Date', example: '01/04/2024', required: false },
        { key: 'admin.name', label: 'Administrator Name', example: 'System Admin', required: false }
      ]
    };

    return suggestions[category] || [];
  }

  /**
   * Format variables for display in templates
   */
  formatVariablesForDisplay(variables: Record<string, any>): Record<string, string> {
    const formatted: Record<string, string> = {};

    Object.entries(variables).forEach(([key, value]) => {
      formatted[key] = this.formatValueForDisplay(value);
    });

    return formatted;
  }

  /**
   * Process payroll-specific context
   */
  private async processPayrollContext(context?: Record<string, any>): Promise<Record<string, any>> {
    if (!context) return {};

    const variables: Record<string, any> = {};

    // Extract payroll information
    if (context.payrollId || context.payroll) {
      const payroll = context.payroll || await this.fetchPayrollData(context.payrollId);
      if (payroll) {
        variables['payroll.name'] = payroll.name || '';
        variables['payroll.employee_count'] = payroll.employeeCount || payroll.employee_count || '';
        variables['payroll.processing_date'] = this.formatDate(payroll.processingDate || payroll.processing_date);
        variables['payroll.go_live_date'] = this.formatDate(payroll.goLiveDate || payroll.go_live_date);
      }
    }

    // Extract client information
    if (context.clientId || context.client) {
      const client = context.client || await this.fetchClientData(context.clientId);
      if (client) {
        variables['client.name'] = client.name || '';
        variables['client.contact_name'] = client.contactName || client.contact_name || '';
      }
    }

    return variables;
  }

  /**
   * Process billing-specific context
   */
  private async processBillingContext(context?: Record<string, any>): Promise<Record<string, any>> {
    if (!context) return {};

    const variables: Record<string, any> = {};

    // Extract invoice information
    if (context.invoiceId || context.invoice) {
      const invoice = context.invoice || await this.fetchInvoiceData(context.invoiceId);
      if (invoice) {
        variables['invoice.number'] = invoice.number || invoice.invoice_number || '';
        variables['invoice.amount'] = this.formatCurrency(invoice.amount || invoice.total_amount);
        variables['invoice.due_date'] = this.formatDate(invoice.dueDate || invoice.due_date);
        variables['invoice.period'] = invoice.period || invoice.billing_period || '';
      }
    }

    // Extract client information
    if (context.clientId || context.client) {
      const client = context.client || await this.fetchClientData(context.clientId);
      if (client) {
        variables['client.name'] = client.name || '';
        variables['client.contact_name'] = client.contactName || client.contact_name || '';
      }
    }

    return variables;
  }

  /**
   * Process client communication context
   */
  private async processClientContext(context?: Record<string, any>): Promise<Record<string, any>> {
    if (!context) return {};

    const variables: Record<string, any> = {};

    if (context.client) {
      variables['client.name'] = context.client.name || '';
      variables['client.contact_name'] = context.client.contactName || '';
    }

    if (context.project) {
      variables['project.name'] = context.project.name || '';
      variables['project.status'] = context.project.status || '';
    }

    if (context.consultant) {
      variables['consultant.name'] = `${context.consultant.firstName || ''} ${context.consultant.lastName || ''}`.trim();
    }

    return variables;
  }

  /**
   * Process leave management context
   */
  private async processLeaveContext(context?: Record<string, any>): Promise<Record<string, any>> {
    if (!context) return {};

    const variables: Record<string, any> = {};

    if (context.employee) {
      variables['employee.first_name'] = context.employee.firstName || context.employee.first_name || '';
      variables['employee.last_name'] = context.employee.lastName || context.employee.last_name || '';
    }

    if (context.leave) {
      variables['leave.type'] = context.leave.type || context.leave.leave_type || '';
      variables['leave.start_date'] = this.formatDate(context.leave.startDate || context.leave.start_date);
      variables['leave.end_date'] = this.formatDate(context.leave.endDate || context.leave.end_date);
      variables['leave.days'] = context.leave.days || context.leave.duration_days || '';
    }

    if (context.approver) {
      variables['approver.name'] = `${context.approver.firstName || ''} ${context.approver.lastName || ''}`.trim();
    }

    return variables;
  }

  /**
   * Process work schedule context
   */
  private async processWorkScheduleContext(context?: Record<string, any>): Promise<Record<string, any>> {
    if (!context) return {};

    const variables: Record<string, any> = {};

    if (context.consultant) {
      variables['consultant.first_name'] = context.consultant.firstName || context.consultant.first_name || '';
      variables['consultant.last_name'] = context.consultant.lastName || context.consultant.last_name || '';
    }

    if (context.assignment) {
      variables['assignment.title'] = context.assignment.title || '';
      variables['assignment.start_date'] = this.formatDate(context.assignment.startDate || context.assignment.start_date);
      variables['assignment.end_date'] = this.formatDate(context.assignment.endDate || context.assignment.end_date);
      variables['assignment.hours_per_week'] = context.assignment.hoursPerWeek || context.assignment.hours_per_week || '';
    }

    if (context.client) {
      variables['client.name'] = context.client.name || '';
    }

    return variables;
  }

  /**
   * Process system notification context
   */
  private async processSystemContext(context?: Record<string, any>): Promise<Record<string, any>> {
    if (!context) return {};

    const variables: Record<string, any> = {};

    if (context.user) {
      variables['user.first_name'] = context.user.firstName || context.user.first_name || '';
      variables['user.last_name'] = context.user.lastName || context.user.last_name || '';
    }

    variables['system.name'] = 'ByteMy Payroll';
    
    if (context.maintenance) {
      variables['maintenance.date'] = this.formatDate(context.maintenance.date);
    }

    if (context.update) {
      variables['update.version'] = context.update.version || '';
    }

    return variables;
  }

  /**
   * Sanitize variable value to prevent XSS
   */
  private sanitizeVariableValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);
    
    // Basic HTML encoding
    return stringValue
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .trim();
  }

  /**
   * Format value for display
   */
  private formatValueForDisplay(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return value.toString();
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (value instanceof Date) {
      return this.formatDate(value);
    }

    return String(value);
  }

  /**
   * Format date for Australian locale
   */
  private formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-AU');
    } catch {
      return String(date);
    }
  }

  /**
   * Format currency for Australian locale
   */
  private formatCurrency(amount: number | string | null | undefined): string {
    if (!amount) return '$0.00';
    
    try {
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
      }).format(numericAmount);
    } catch {
      return String(amount);
    }
  }

  // Placeholder methods for data fetching (to be implemented with actual GraphQL queries)
  private async fetchPayrollData(payrollId: string): Promise<any> {
    // TODO: Implement GraphQL query to fetch payroll data
    return null;
  }

  private async fetchClientData(clientId: string): Promise<any> {
    // TODO: Implement GraphQL query to fetch client data
    return null;
  }

  private async fetchInvoiceData(invoiceId: string): Promise<any> {
    // TODO: Implement GraphQL query to fetch invoice data
    return null;
  }
}

// Singleton instance
export const variableProcessor = new VariableProcessor();
export default variableProcessor;