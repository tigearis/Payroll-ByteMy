import { BusinessField } from "../types/business-reports.types";

// ============================================================================
// BUSINESS FIELD MAPPING SERVICE
// Translates technical database fields to user-friendly business terms
// ============================================================================

export class BusinessFieldMappingService {
  private static businessFields: Record<string, BusinessField> = {
    // =======================
    // PAYROLL FIELDS
    // =======================
    "payrolls.id": {
      technicalName: "payrolls.id",
      businessName: "Payroll ID",
      description: "Unique identifier for each payroll record",
      category: "Identification",
      dataType: "text",
      required: true,
      examples: ["PR-2024-001", "PR-2024-002"]
    },
    "payrolls.name": {
      technicalName: "payrolls.name",
      businessName: "Payroll Name",
      description: "Descriptive name of the payroll (e.g., client name and period)",
      category: "Basic Information",
      dataType: "text",
      required: true,
      examples: ["Acme Corp - January 2024", "Tech Solutions - Weekly"]
    },
    "payrolls.status": {
      technicalName: "payrolls.status",
      businessName: "Processing Status",
      description: "Current status of payroll processing",
      category: "Status",
      dataType: "text",
      required: true,
      examples: ["draft", "processing", "completed", "cancelled"]
    },
    "payrolls.primary_consultant_user_id": {
      technicalName: "payrolls.primary_consultant_user_id",
      businessName: "Primary Consultant",
      description: "Main consultant responsible for this payroll",
      category: "Assignment",
      dataType: "text",
      required: false,
      examples: ["John Smith", "Sarah Johnson"]
    },
    "payrolls.backup_consultant_user_id": {
      technicalName: "payrolls.backup_consultant_user_id",
      businessName: "Backup Consultant",
      description: "Secondary consultant who can handle this payroll",
      category: "Assignment",
      dataType: "text",
      required: false,
      examples: ["Mike Davis", "Lisa Wilson"]
    },
    "payrolls.created_at": {
      technicalName: "payrolls.created_at",
      businessName: "Created Date",
      description: "When this payroll was first created",
      category: "Timestamps",
      dataType: "date",
      format: "YYYY-MM-DD HH:mm",
      required: true,
      examples: ["2024-01-15 09:30", "2024-02-01 14:22"]
    },
    "payrolls.updated_at": {
      technicalName: "payrolls.updated_at",
      businessName: "Last Modified",
      description: "When this payroll was last updated",
      category: "Timestamps",
      dataType: "date",
      format: "YYYY-MM-DD HH:mm",
      required: true,
      examples: ["2024-01-20 16:45", "2024-02-03 11:15"]
    },

    // =======================
    // CLIENT FIELDS
    // =======================
    "clients.id": {
      technicalName: "clients.id",
      businessName: "Client ID",
      description: "Unique identifier for each client",
      category: "Identification",
      dataType: "text",
      required: true,
      examples: ["CLT-001", "CLT-002"]
    },
    "clients.name": {
      technicalName: "clients.name",
      businessName: "Client Name",
      description: "Business name of the client company",
      category: "Basic Information",
      dataType: "text",
      required: true,
      examples: ["Acme Corporation", "Tech Solutions Pty Ltd"]
    },
    "clients.contact_person": {
      technicalName: "clients.contact_person",
      businessName: "Primary Contact",
      description: "Main contact person at the client company",
      category: "Contact Information",
      dataType: "text",
      required: false,
      examples: ["John Smith", "Sarah Johnson"]
    },
    "clients.email": {
      technicalName: "clients.email",
      businessName: "Email Address",
      description: "Primary email address for client communication",
      category: "Contact Information",
      dataType: "text",
      required: false,
      sensitive: true,
      examples: ["contact@acme.com", "admin@techsolutions.com.au"]
    },
    "clients.phone": {
      technicalName: "clients.phone",
      businessName: "Phone Number",
      description: "Primary phone number for client contact",
      category: "Contact Information",
      dataType: "text",
      required: false,
      sensitive: true,
      examples: ["+61 2 9999 8888", "1300 123 456"]
    },
    "clients.active": {
      technicalName: "clients.active",
      businessName: "Active Status",
      description: "Whether the client is currently active",
      category: "Status",
      dataType: "text",
      required: true,
      examples: ["Active", "Inactive"]
    },

    // =======================
    // BILLING FIELDS
    // =======================
    "billing_items.id": {
      technicalName: "billing_items.id",
      businessName: "Billing Item ID",
      description: "Unique identifier for each billing item",
      category: "Identification",
      dataType: "text",
      required: true,
      examples: ["BI-2024-001", "BI-2024-002"]
    },
    "billing_items.amount": {
      technicalName: "billing_items.amount",
      businessName: "Amount",
      description: "Dollar amount for this billing item",
      category: "Financial",
      dataType: "currency",
      format: "$#,##0.00",
      required: true,
      aggregatable: true,
      examples: ["$1,250.00", "$850.50"]
    },
    "billing_items.description": {
      technicalName: "billing_items.description",
      businessName: "Service Description",
      description: "Description of the service or work performed",
      category: "Service Details",
      dataType: "text",
      required: true,
      examples: ["Weekly payroll processing", "Annual leave calculations"]
    },
    "billing_items.hours_worked": {
      technicalName: "billing_items.hours_worked",
      businessName: "Hours Worked",
      description: "Number of hours spent on this item",
      category: "Time Tracking",
      dataType: "hours",
      format: "#0.00",
      required: false,
      aggregatable: true,
      examples: ["2.5", "4.75"]
    },
    "billing_items.hourly_rate": {
      technicalName: "billing_items.hourly_rate",
      businessName: "Hourly Rate",
      description: "Rate charged per hour for this service",
      category: "Financial",
      dataType: "currency",
      format: "$#,##0.00",
      required: false,
      examples: ["$150.00", "$200.00"]
    },
    "billing_items.created_at": {
      technicalName: "billing_items.created_at",
      businessName: "Billing Date",
      description: "When this item was created/billed",
      category: "Timestamps",
      dataType: "date",
      format: "YYYY-MM-DD",
      required: true,
      examples: ["2024-01-15", "2024-02-01"]
    },

    // =======================
    // USER FIELDS
    // =======================
    "users.id": {
      technicalName: "users.id",
      businessName: "User ID",
      description: "Unique identifier for each user",
      category: "Identification",
      dataType: "text",
      required: true,
      examples: ["USR-001", "USR-002"]
    },
    "users.first_name": {
      technicalName: "users.first_name",
      businessName: "First Name",
      description: "User's first name",
      category: "Personal Information",
      dataType: "text",
      required: true,
      sensitive: true,
      examples: ["John", "Sarah"]
    },
    "users.last_name": {
      technicalName: "users.last_name",
      businessName: "Last Name",
      description: "User's last name",
      category: "Personal Information",
      dataType: "text",
      required: true,
      sensitive: true,
      examples: ["Smith", "Johnson"]
    },
    "users.computed_name": {
      technicalName: "users.computed_name",
      businessName: "Full Name",
      description: "User's complete name (first + last)",
      category: "Personal Information",
      dataType: "text",
      required: true,
      examples: ["John Smith", "Sarah Johnson"]
    },
    "users.email": {
      technicalName: "users.email",
      businessName: "Email Address",
      description: "User's email address",
      category: "Contact Information",
      dataType: "text",
      required: true,
      sensitive: true,
      examples: ["john.smith@company.com", "sarah.j@company.com"]
    },
    "users.role": {
      technicalName: "users.role",
      businessName: "Role",
      description: "User's role in the system",
      category: "Authorization",
      dataType: "text",
      required: true,
      examples: ["consultant", "manager", "org_admin"]
    },
    "users.default_hourly_rate": {
      technicalName: "users.default_hourly_rate",
      businessName: "Default Hourly Rate",
      description: "Standard billing rate for this user",
      category: "Financial",
      dataType: "currency",
      format: "$#,##0.00",
      required: false,
      examples: ["$150.00", "$200.00"]
    },

    // =======================
    // PAYROLL DATES FIELDS
    // =======================
    "payroll_dates.id": {
      technicalName: "payroll_dates.id",
      businessName: "Payroll Date ID",
      description: "Unique identifier for each payroll date",
      category: "Identification",
      dataType: "text",
      required: true,
      examples: ["PD-2024-001", "PD-2024-002"]
    },
    "payroll_dates.original_eft_date": {
      technicalName: "payroll_dates.original_eft_date",
      businessName: "Scheduled Payment Date",
      description: "Original scheduled date for payment",
      category: "Payment Schedule",
      dataType: "date",
      format: "YYYY-MM-DD",
      required: true,
      examples: ["2024-01-15", "2024-01-31"]
    },
    "payroll_dates.adjusted_eft_date": {
      technicalName: "payroll_dates.adjusted_eft_date",
      businessName: "Actual Payment Date",
      description: "Adjusted payment date (accounting for holidays/weekends)",
      category: "Payment Schedule",
      dataType: "date",
      format: "YYYY-MM-DD",
      required: true,
      examples: ["2024-01-15", "2024-02-01"]
    },
    "payroll_dates.processing_date": {
      technicalName: "payroll_dates.processing_date",
      businessName: "Processing Date",
      description: "Date when payroll processing should begin",
      category: "Processing Schedule",
      dataType: "date",
      format: "YYYY-MM-DD",
      required: true,
      examples: ["2024-01-10", "2024-01-26"]
    },
    "payroll_dates.status": {
      technicalName: "payroll_dates.status",
      businessName: "Processing Status",
      description: "Current status of this payroll date",
      category: "Status",
      dataType: "text",
      required: true,
      examples: ["pending", "in_progress", "completed", "cancelled"]
    },

    // =======================
    // TIME ENTRIES FIELDS
    // =======================
    "time_entries.id": {
      technicalName: "time_entries.id",
      businessName: "Time Entry ID",
      description: "Unique identifier for each time entry",
      category: "Identification",
      dataType: "text",
      required: true,
      examples: ["TE-2024-001", "TE-2024-002"]
    },
    "time_entries.start_time": {
      technicalName: "time_entries.start_time",
      businessName: "Start Time",
      description: "When work began on this task",
      category: "Time Tracking",
      dataType: "date",
      format: "YYYY-MM-DD HH:mm",
      required: true,
      examples: ["2024-01-15 09:00", "2024-01-15 14:30"]
    },
    "time_entries.end_time": {
      technicalName: "time_entries.end_time",
      businessName: "End Time",
      description: "When work finished on this task",
      category: "Time Tracking",
      dataType: "date",
      format: "YYYY-MM-DD HH:mm",
      required: false,
      examples: ["2024-01-15 12:00", "2024-01-15 17:30"]
    },
    "time_entries.duration_minutes": {
      technicalName: "time_entries.duration_minutes",
      businessName: "Duration (Minutes)",
      description: "Total time spent in minutes",
      category: "Time Tracking",
      dataType: "count",
      format: "#,##0",
      required: false,
      aggregatable: true,
      examples: ["180", "120"]
    },
    "time_entries.description": {
      technicalName: "time_entries.description",
      businessName: "Work Description",
      description: "Description of work performed",
      category: "Work Details",
      dataType: "text",
      required: false,
      examples: ["Processing weekly payroll", "Reviewing leave calculations"]
    },

    // =======================
    // NOTES FIELDS
    // =======================
    "notes.id": {
      technicalName: "notes.id",
      businessName: "Note ID",
      description: "Unique identifier for each note",
      category: "Identification",
      dataType: "text",
      required: true,
      examples: ["NOTE-2024-001", "NOTE-2024-002"]
    },
    "notes.content": {
      technicalName: "notes.content",
      businessName: "Note Content",
      description: "The content/text of the note",
      category: "Communication",
      dataType: "text",
      required: true,
      examples: ["Client requested early payment", "Holiday processing required"]
    },
    "notes.note_type": {
      technicalName: "notes.note_type",
      businessName: "Note Type",
      description: "Category or type of note",
      category: "Classification",
      dataType: "text",
      required: false,
      examples: ["general", "urgent", "client_request", "internal"]
    },
    "notes.is_important": {
      technicalName: "notes.is_important",
      businessName: "Priority Level",
      description: "Whether this note is marked as important",
      category: "Priority",
      dataType: "text",
      required: false,
      examples: ["High", "Normal"]
    }
  };

  /**
   * Get business-friendly field information for a technical field name
   */
  static getBusinessField(technicalName: string): BusinessField | null {
    return this.businessFields[technicalName] || null;
  }

  /**
   * Get all business fields for a specific domain
   */
  static getBusinessFieldsForDomain(domain: string): Record<string, BusinessField> {
    const domainFields: Record<string, BusinessField> = {};
    
    Object.entries(this.businessFields).forEach(([key, field]) => {
      if (key.startsWith(`${domain}.`)) {
        domainFields[key] = field;
      }
    });
    
    return domainFields;
  }

  /**
   * Get all available domains
   */
  static getAvailableDomains(): string[] {
    const domains = new Set<string>();
    
    Object.keys(this.businessFields).forEach(key => {
      const domain = key.split('.')[0];
      domains.add(domain);
    });
    
    return Array.from(domains).sort();
  }

  /**
   * Get business fields grouped by category for a domain
   */
  static getBusinessFieldsByCategory(domain: string): Record<string, BusinessField[]> {
    const domainFields = this.getBusinessFieldsForDomain(domain);
    const grouped: Record<string, BusinessField[]> = {};
    
    Object.values(domainFields).forEach(field => {
      if (!grouped[field.category]) {
        grouped[field.category] = [];
      }
      grouped[field.category].push(field);
    });
    
    return grouped;
  }

  /**
   * Search business fields by name or description
   */
  static searchBusinessFields(query: string): BusinessField[] {
    const lowercaseQuery = query.toLowerCase();
    
    return Object.values(this.businessFields).filter(field => 
      field.businessName.toLowerCase().includes(lowercaseQuery) ||
      field.description.toLowerCase().includes(lowercaseQuery) ||
      field.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get aggregatable fields for summary statistics
   */
  static getAggregatableFields(): BusinessField[] {
    return Object.values(this.businessFields).filter(field => field.aggregatable);
  }

  /**
   * Convert technical field names to business names for display
   */
  static convertFieldNamesForDisplay(technicalFields: string[]): Array<{
    technical: string;
    business: string;
    description: string;
  }> {
    return technicalFields.map(technical => {
      const businessField = this.getBusinessField(technical);
      return {
        technical,
        business: businessField?.businessName || technical,
        description: businessField?.description || "No description available"
      };
    });
  }

  /**
   * Get recommended fields for a specific report type
   */
  static getRecommendedFields(reportCategory: string): BusinessField[] {
    // This could be expanded with more sophisticated logic
    const recommendations: Record<string, string[]> = {
      financial: ["billing_items.amount", "billing_items.hours_worked", "billing_items.hourly_rate", "clients.name"],
      operational: ["payrolls.status", "payroll_dates.status", "users.computed_name", "time_entries.duration_minutes"],
      compliance: ["payrolls.created_at", "payroll_dates.processing_date", "notes.content", "notes.is_important"],
      client_management: ["clients.name", "clients.contact_person", "clients.active", "billing_items.amount"]
    };

    const recommendedTechnicalNames = recommendations[reportCategory] || [];
    return recommendedTechnicalNames
      .map(name => this.getBusinessField(name))
      .filter((field): field is BusinessField => field !== null);
  }

  /**
   * Validate field selection for a report
   */
  static validateFieldSelection(fields: string[]): {
    valid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for sensitive fields
    const sensitiveFields = fields.filter(field => {
      const businessField = this.getBusinessField(field);
      return businessField?.sensitive;
    });

    if (sensitiveFields.length > 0) {
      issues.push(`Contains sensitive fields: ${sensitiveFields.join(", ")}`);
      recommendations.push("Consider if sensitive data is necessary for this report");
    }

    // Check for required fields
    const requiredFields = fields.filter(field => {
      const businessField = this.getBusinessField(field);
      return businessField?.required;
    });

    if (requiredFields.length === 0) {
      recommendations.push("Consider including at least one identifier field (e.g., ID or Name)");
    }

    // Check for good mix of field types
    const fieldTypes = new Set(fields.map(field => {
      const businessField = this.getBusinessField(field);
      return businessField?.dataType || "unknown";
    }));

    if (fieldTypes.size === 1) {
      recommendations.push("Consider including different types of data (dates, amounts, text) for a more comprehensive report");
    }

    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };
  }
}