import { BusinessReportTemplate } from "../types/business-reports.types";

// ============================================================================
// BUSINESS REPORT TEMPLATES
// Pre-built reports for common business scenarios
// ============================================================================

export const BUSINESS_REPORT_TEMPLATES: BusinessReportTemplate[] = [
  // ======================
  // FINANCIAL REPORTS
  // ======================
  {
    id: "financial_monthly_revenue",
    name: "Monthly Revenue Summary",
    description: "Comprehensive overview of monthly revenue by client and service type",
    category: "financial",
    targetAudience: ["manager", "org_admin"],
    estimatedRuntime: "< 30 seconds",
    complexity: "simple",
    icon: "DollarSign",
    color: "#10B981",
    tags: ["revenue", "monthly", "financial", "summary"],
    config: {
      domains: ["billing_items", "clients", "payrolls"],
      fields: {
        billing_items: ["amount", "description", "hours_worked", "hourly_rate", "created_at"],
        clients: ["name", "active"],
        payrolls: ["name", "status"]
      },
      defaultFilters: [],
      defaultSorts: [{ field: "billing_items.created_at", direction: "desc" }],
      defaultLimit: 1000,
      chartType: "bar",
      groupBy: ["clients.name"],
      aggregations: [
        { field: "billing_items.amount", operation: "sum", alias: "total_revenue" },
        { field: "billing_items.hours_worked", operation: "sum", alias: "total_hours" },
        { field: "billing_items.amount", operation: "count", alias: "billing_items_count" }
      ]
    },
    quickFilters: [
      {
        field: "billing_items.created_at",
        label: "Date Range",
        type: "date_range",
        defaultValue: "last_30_days"
      },
      {
        field: "clients.name",
        label: "Client",
        type: "select",
        defaultValue: "all_clients"
      }
    ],
    defaultExportFormats: ["pdf", "excel"],
    whiteLabel: true,
    createdBy: "system",
    version: "1.0",
    isActive: true
  },

  {
    id: "financial_client_profitability",
    name: "Client Profitability Analysis",
    description: "Detailed analysis of revenue, costs, and profit margins by client",
    category: "financial",
    targetAudience: ["manager", "org_admin"],
    estimatedRuntime: "< 45 seconds",
    complexity: "intermediate",
    icon: "TrendingUp",
    color: "#3B82F6",
    tags: ["profitability", "clients", "margins", "analysis"],
    config: {
      domains: ["billing_items", "clients", "time_entries", "users"],
      fields: {
        billing_items: ["amount", "hours_worked", "hourly_rate", "created_at"],
        clients: ["name", "contact_person", "active"],
        time_entries: ["duration_minutes"],
        users: ["computed_name", "default_hourly_rate"]
      },
      defaultSorts: [{ field: "total_revenue", direction: "desc" }],
      defaultLimit: 100,
      chartType: "mixed",
      groupBy: ["clients.name"],
      aggregations: [
        { field: "billing_items.amount", operation: "sum", alias: "total_revenue" },
        { field: "time_entries.duration_minutes", operation: "sum", alias: "total_time_minutes" },
        { field: "billing_items.amount", operation: "avg", alias: "avg_billing_amount" }
      ]
    },
    quickFilters: [
      {
        field: "billing_items.created_at",
        label: "Period",
        type: "date_range",
        defaultValue: "last_90_days"
      },
      {
        field: "clients.active",
        label: "Client Status",
        type: "select",
        options: ["active", "inactive", "all"],
        defaultValue: "active"
      }
    ],
    defaultExportFormats: ["pdf", "excel"],
    whiteLabel: true,
    createdBy: "system",
    version: "1.0"
  },

  // ======================
  // OPERATIONAL REPORTS
  // ======================
  {
    id: "operational_payroll_status",
    name: "Payroll Processing Status",
    description: "Current status of all payrolls and their processing timeline",
    category: "operational",
    targetAudience: ["consultant", "manager", "org_admin"],
    estimatedRuntime: "< 15 seconds",
    complexity: "simple",
    icon: "Clock",
    color: "#F59E0B",
    tags: ["payroll", "status", "processing", "timeline"],
    config: {
      domains: ["payrolls", "payroll_dates", "clients", "users"],
      fields: {
        payrolls: ["name", "status", "created_at", "updated_at"],
        payroll_dates: ["original_eft_date", "adjusted_eft_date", "processing_date", "status"],
        clients: ["name"],
        users: ["computed_name"]
      },
      defaultFilters: [
        { field: "payrolls.status", operator: "in", value: ["draft", "processing", "pending"], conjunction: "AND" }
      ],
      defaultSorts: [{ field: "payroll_dates.processing_date", direction: "asc" }],
      defaultLimit: 500,
      chartType: "table",
      groupBy: ["payrolls.status"]
    },
    quickFilters: [
      {
        field: "payrolls.status",
        label: "Status",
        type: "multi_select",
        options: ["draft", "processing", "completed", "cancelled", "pending"],
        defaultValue: ["draft", "processing", "pending"]
      },
      {
        field: "payroll_dates.processing_date",
        label: "Processing Date",
        type: "date_range",
        defaultValue: "next_30_days"
      }
    ],
    defaultExportFormats: ["csv", "pdf"],
    createdBy: "system",
    version: "1.0"
  },

  {
    id: "operational_consultant_workload",
    name: "Consultant Workload Analysis",
    description: "Analysis of consultant assignments, capacity, and productivity",
    category: "operational",
    targetAudience: ["manager", "org_admin"],
    estimatedRuntime: "< 30 seconds",
    complexity: "intermediate",
    icon: "Users",
    color: "#8B5CF6",
    tags: ["consultants", "workload", "capacity", "productivity"],
    config: {
      domains: ["users", "payrolls", "time_entries", "billing_items"],
      fields: {
        users: ["computed_name", "role", "default_hourly_rate"],
        payrolls: ["name", "status"],
        time_entries: ["start_time", "end_time", "duration_minutes"],
        billing_items: ["amount", "hours_worked"]
      },
      defaultSorts: [{ field: "total_hours", direction: "desc" }],
      defaultLimit: 50,
      chartType: "bar",
      groupBy: ["users.computed_name"],
      aggregations: [
        { field: "time_entries.duration_minutes", operation: "sum", alias: "total_minutes" },
        { field: "billing_items.amount", operation: "sum", alias: "total_revenue" },
        { field: "payrolls.name", operation: "count", alias: "payrolls_assigned" }
      ]
    },
    quickFilters: [
      {
        field: "time_entries.start_time",
        label: "Period",
        type: "date_range",
        defaultValue: "last_30_days"
      },
      {
        field: "users.role",
        label: "Role",
        type: "multi_select",
        options: ["consultant", "manager", "org_admin"],
        defaultValue: ["consultant", "manager"]
      }
    ],
    defaultExportFormats: ["pdf", "excel"],
    createdBy: "system",
    version: "1.0"
  },

  // ======================
  // CLIENT MANAGEMENT REPORTS
  // ======================
  {
    id: "client_monthly_statement",
    name: "Client Monthly Statement",
    description: "Detailed monthly statement of services provided to a specific client",
    category: "client_management",
    targetAudience: ["consultant", "manager", "client"],
    estimatedRuntime: "< 20 seconds",
    complexity: "simple",
    icon: "FileText",
    color: "#06B6D4",
    tags: ["client", "statement", "monthly", "billing"],
    config: {
      domains: ["billing_items", "payrolls", "time_entries", "users"],
      fields: {
        billing_items: ["description", "amount", "hours_worked", "hourly_rate", "created_at"],
        payrolls: ["name", "status"],
        time_entries: ["start_time", "end_time", "duration_minutes", "description"],
        users: ["computed_name"]
      },
      defaultSorts: [{ field: "billing_items.created_at", direction: "desc" }],
      defaultLimit: 1000,
      chartType: "table",
      aggregations: [
        { field: "billing_items.amount", operation: "sum", alias: "total_amount" },
        { field: "billing_items.hours_worked", operation: "sum", alias: "total_hours" },
        { field: "billing_items.amount", operation: "count", alias: "total_items" }
      ]
    },
    quickFilters: [
      {
        field: "billing_items.created_at",
        label: "Statement Period",
        type: "date_range",
        defaultValue: "current_month"
      }
    ],
    defaultExportFormats: ["pdf"],
    whiteLabel: true,
    createdBy: "system",
    version: "1.0"
  },

  {
    id: "client_service_summary",
    name: "Client Service Summary",
    description: "High-level summary of all services provided to a client over time",
    category: "client_management",
    targetAudience: ["manager", "org_admin", "client"],
    estimatedRuntime: "< 25 seconds",
    complexity: "simple",
    icon: "BarChart3",
    color: "#10B981",
    tags: ["client", "services", "summary", "overview"],
    config: {
      domains: ["billing_items", "payrolls", "clients", "users"],
      fields: {
        billing_items: ["description", "amount", "hours_worked", "created_at"],
        payrolls: ["name", "status", "created_at"],
        clients: ["name", "contact_person"],
        users: ["computed_name"]
      },
      defaultSorts: [{ field: "billing_items.created_at", direction: "desc" }],
      defaultLimit: 500,
      chartType: "line",
      groupBy: ["billing_items.created_at"],
      aggregations: [
        { field: "billing_items.amount", operation: "sum", alias: "monthly_revenue" },
        { field: "billing_items.hours_worked", operation: "sum", alias: "monthly_hours" },
        { field: "payrolls.name", operation: "count", alias: "payrolls_processed" }
      ]
    },
    quickFilters: [
      {
        field: "billing_items.created_at",
        label: "Time Period",
        type: "date_range",
        defaultValue: "last_12_months"
      }
    ],
    defaultExportFormats: ["pdf", "excel"],
    whiteLabel: true,
    createdBy: "system",
    version: "1.0"
  },

  // ======================
  // COMPLIANCE REPORTS
  // ======================
  {
    id: "compliance_processing_audit",
    name: "Payroll Processing Audit Trail",
    description: "Detailed audit trail of payroll processing activities for compliance",
    category: "compliance",
    targetAudience: ["manager", "org_admin"],
    estimatedRuntime: "< 40 seconds",
    complexity: "intermediate",
    icon: "Shield",
    color: "#DC2626",
    tags: ["audit", "compliance", "processing", "trail"],
    config: {
      domains: ["payrolls", "payroll_dates", "time_entries", "notes", "users"],
      fields: {
        payrolls: ["name", "status", "created_at", "updated_at"],
        payroll_dates: ["original_eft_date", "adjusted_eft_date", "processing_date", "status"],
        time_entries: ["start_time", "end_time", "duration_minutes", "description"],
        notes: ["content", "note_type", "is_important", "created_at"],
        users: ["computed_name", "role"]
      },
      defaultSorts: [{ field: "payrolls.updated_at", direction: "desc" }],
      defaultLimit: 1000,
      chartType: "table"
    },
    quickFilters: [
      {
        field: "payrolls.updated_at",
        label: "Audit Period",
        type: "date_range",
        defaultValue: "last_90_days"
      },
      {
        field: "notes.is_important",
        label: "Important Items Only",
        type: "checkbox",
        defaultValue: false
      }
    ],
    defaultExportFormats: ["pdf", "excel"],
    createdBy: "system",
    version: "1.0"
  },

  // ======================
  // HR ANALYTICS REPORTS
  // ======================
  {
    id: "hr_time_tracking_summary",
    name: "Time Tracking Summary",
    description: "Summary of time tracking data across all users and projects",
    category: "hr_analytics",
    targetAudience: ["manager", "org_admin"],
    estimatedRuntime: "< 35 seconds",
    complexity: "intermediate",
    icon: "Clock",
    color: "#F59E0B",
    tags: ["time tracking", "productivity", "hours", "analytics"],
    config: {
      domains: ["time_entries", "users", "payrolls", "billing_items"],
      fields: {
        time_entries: ["start_time", "end_time", "duration_minutes", "description"],
        users: ["computed_name", "role", "default_hourly_rate"],
        payrolls: ["name", "status"],
        billing_items: ["amount", "hours_worked"]
      },
      defaultSorts: [{ field: "total_hours", direction: "desc" }],
      defaultLimit: 100,
      chartType: "bar",
      groupBy: ["users.computed_name"],
      aggregations: [
        { field: "time_entries.duration_minutes", operation: "sum", alias: "total_minutes" },
        { field: "billing_items.amount", operation: "sum", alias: "revenue_generated" },
        { field: "time_entries.duration_minutes", operation: "avg", alias: "avg_session_length" }
      ]
    },
    quickFilters: [
      {
        field: "time_entries.start_time",
        label: "Period",
        type: "date_range",
        defaultValue: "last_30_days"
      },
      {
        field: "users.role",
        label: "User Role",
        type: "multi_select",
        options: ["consultant", "manager", "org_admin"],
        defaultValue: ["consultant"]
      }
    ],
    defaultExportFormats: ["excel", "csv"],
    createdBy: "system",
    version: "1.0"
  },

  // ======================
  // PERFORMANCE REPORTS
  // ======================
  {
    id: "performance_consultant_efficiency",
    name: "Consultant Efficiency Report",
    description: "Analysis of consultant efficiency based on revenue per hour and client satisfaction",
    category: "performance",
    targetAudience: ["manager", "org_admin"],
    estimatedRuntime: "< 45 seconds",
    complexity: "advanced",
    icon: "Target",
    color: "#8B5CF6",
    tags: ["efficiency", "performance", "consultants", "metrics"],
    config: {
      domains: ["users", "time_entries", "billing_items", "payrolls"],
      fields: {
        users: ["computed_name", "role", "default_hourly_rate"],
        time_entries: ["duration_minutes", "start_time"],
        billing_items: ["amount", "hours_worked", "hourly_rate"],
        payrolls: ["status"]
      },
      defaultSorts: [{ field: "efficiency_ratio", direction: "desc" }],
      defaultLimit: 50,
      chartType: "mixed",
      groupBy: ["users.computed_name"],
      aggregations: [
        { field: "billing_items.amount", operation: "sum", alias: "total_revenue" },
        { field: "time_entries.duration_minutes", operation: "sum", alias: "total_minutes" },
        { field: "billing_items.hours_worked", operation: "sum", alias: "billable_hours" },
        { field: "payrolls.status", operation: "count", alias: "payrolls_completed" }
      ]
    },
    quickFilters: [
      {
        field: "time_entries.start_time",
        label: "Performance Period",
        type: "date_range",
        defaultValue: "last_90_days"
      },
      {
        field: "users.role",
        label: "Role",
        type: "select",
        options: ["consultant", "manager"],
        defaultValue: "consultant"
      }
    ],
    defaultExportFormats: ["pdf", "excel"],
    createdBy: "system",
    version: "1.0"
  },

  // ======================
  // FORECASTING REPORTS
  // ======================
  {
    id: "forecasting_revenue_projection",
    name: "Revenue Projection",
    description: "Projected revenue based on current trends and pipeline",
    category: "forecasting",
    targetAudience: ["manager", "org_admin"],
    estimatedRuntime: "< 50 seconds",
    complexity: "advanced",
    icon: "TrendingUp",
    color: "#10B981",
    tags: ["forecasting", "revenue", "projection", "trends"],
    config: {
      domains: ["billing_items", "payrolls", "clients"],
      fields: {
        billing_items: ["amount", "created_at", "hours_worked"],
        payrolls: ["status", "created_at"],
        clients: ["name", "active"]
      },
      defaultSorts: [{ field: "billing_items.created_at", direction: "desc" }],
      defaultLimit: 2000,
      chartType: "line",
      groupBy: ["billing_items.created_at"],
      aggregations: [
        { field: "billing_items.amount", operation: "sum", alias: "monthly_revenue" },
        { field: "billing_items.amount", operation: "avg", alias: "avg_transaction" },
        { field: "payrolls.status", operation: "count", alias: "payrolls_processed" }
      ]
    },
    quickFilters: [
      {
        field: "billing_items.created_at",
        label: "Historical Period",
        type: "date_range",
        defaultValue: "last_12_months"
      },
      {
        field: "clients.active",
        label: "Include Inactive Clients",
        type: "checkbox",
        defaultValue: false
      }
    ],
    defaultExportFormats: ["pdf", "excel"],
    createdBy: "system",
    version: "1.0"
  }
];

// Helper functions for template management
export class BusinessReportTemplateService {
  /**
   * Get all templates
   */
  static getAllTemplates(): BusinessReportTemplate[] {
    return BUSINESS_REPORT_TEMPLATES;
  }

  /**
   * Get templates by category
   */
  static getTemplatesByCategory(category: string): BusinessReportTemplate[] {
    return BUSINESS_REPORT_TEMPLATES.filter(template => template.category === category);
  }

  /**
   * Get templates by target audience
   */
  static getTemplatesByAudience(audience: string): BusinessReportTemplate[] {
    return BUSINESS_REPORT_TEMPLATES.filter(template => 
      template.targetAudience.includes(audience as any)
    );
  }

  /**
   * Get template by ID
   */
  static getTemplateById(id: string): BusinessReportTemplate | null {
    return BUSINESS_REPORT_TEMPLATES.find(template => template.id === id) || null;
  }

  /**
   * Search templates by name, description, or tags
   */
  static searchTemplates(query: string): BusinessReportTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return BUSINESS_REPORT_TEMPLATES.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get recommended templates for a user role
   */
  static getRecommendedTemplates(userRole: string): BusinessReportTemplate[] {
    const roleSpecificTemplates = this.getTemplatesByAudience(userRole);
    
    // Sort by complexity (simple first) and usage count
    return roleSpecificTemplates.sort((a, b) => {
      const complexityOrder = { simple: 1, intermediate: 2, advanced: 3 };
      const aComplexity = complexityOrder[a.complexity];
      const bComplexity = complexityOrder[b.complexity];
      
      if (aComplexity !== bComplexity) {
        return aComplexity - bComplexity;
      }
      
      return (b.usageCount || 0) - (a.usageCount || 0);
    });
  }

  /**
   * Get available categories
   */
  static getAvailableCategories(): { id: string; name: string; count: number }[] {
    const categories = new Map<string, number>();
    
    BUSINESS_REPORT_TEMPLATES.forEach(template => {
      categories.set(template.category, (categories.get(template.category) || 0) + 1);
    });
    
    const categoryNames = {
      financial: "Financial Reports",
      operational: "Operational Reports", 
      compliance: "Compliance & Audit",
      hr_analytics: "HR Analytics",
      client_management: "Client Management",
      performance: "Performance Analysis",
      forecasting: "Forecasting & Trends"
    };
    
    return Array.from(categories.entries()).map(([id, count]) => ({
      id,
      name: categoryNames[id as keyof typeof categoryNames] || id,
      count
    }));
  }
}