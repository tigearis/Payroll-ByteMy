// Email Template Service
// Security Classification: HIGH - Template management and processing
// SOC2 Compliance: Template audit and approval tracking

import type { 
  EmailTemplate, 
  EmailCategory, 
  TemplatePreview,
  TemplateValidationRule,
  EmailTemplateValidationResult
} from '../types';
import { SAMPLE_PREVIEW_DATA } from '../types/template-types';

class EmailTemplateService {
  /**
   * Process template variables and generate preview
   */
  processTemplate(
    template: Pick<EmailTemplate, 'subjectTemplate' | 'htmlContent' | 'textContent'>,
    variables: Record<string, any> = {},
    category?: EmailCategory
  ): TemplatePreview {
    // Use sample data if no variables provided
    const templateData = Object.keys(variables).length > 0 
      ? variables 
      : (category ? SAMPLE_PREVIEW_DATA[category] || {} : {});

    const processedSubject = this.interpolateVariables(
      template.subjectTemplate, 
      templateData
    );

    const processedHtmlContent = this.interpolateVariables(
      template.htmlContent, 
      templateData
    );

    const processedTextContent = template.textContent 
      ? this.interpolateVariables(template.textContent, templateData)
      : this.htmlToText(processedHtmlContent);

    return {
      subject: processedSubject,
      htmlContent: processedHtmlContent,
      textContent: processedTextContent,
      variables: templateData
    };
  }

  /**
   * Validate email template content and structure
   */
  validateTemplate(template: Partial<EmailTemplate>): EmailTemplateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingVariables: string[] = [];

    // Required field validation
    if (!template.name?.trim()) {
      errors.push('Template name is required');
    } else if (template.name.length < 3) {
      errors.push('Template name must be at least 3 characters');
    }

    if (!template.subjectTemplate?.trim()) {
      errors.push('Subject template is required');
    }

    if (!template.htmlContent?.trim()) {
      errors.push('HTML content is required');
    }

    if (!template.category) {
      errors.push('Template category is required');
    }

    // Content validation
    if (template.htmlContent) {
      const htmlValidation = this.validateHtmlContent(template.htmlContent);
      errors.push(...htmlValidation.errors);
      warnings.push(...htmlValidation.warnings);
    }

    // Variable validation
    if (template.subjectTemplate || template.htmlContent) {
      const variableValidation = this.validateTemplateVariables(
        template.subjectTemplate || '',
        template.htmlContent || '',
        template.availableVariables || []
      );
      missingVariables.push(...variableValidation.missing);
      warnings.push(...variableValidation.warnings);
    }

    // Security validation
    const securityValidation = this.validateTemplateSecurity(template.htmlContent || '');
    errors.push(...securityValidation.errors);
    warnings.push(...securityValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      missingVariables
    };
  }

  /**
   * Extract variables from template content
   */
  extractVariables(content: string): string[] {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      const variable = match[1].trim();
      if (!variables.includes(variable)) {
        variables.push(variable);
      }
    }

    return variables;
  }

  /**
   * Get suggested variables for a category
   */
  getSuggestedVariables(category: EmailCategory): string[] {
    const categoryVariables: Record<EmailCategory, string[]> = {
      payroll: [
        'payroll.name', 'payroll.employee_count', 'payroll.processing_date',
        'payroll.go_live_date', 'client.name', 'employee.first_name'
      ],
      billing: [
        'invoice.number', 'invoice.amount', 'invoice.due_date', 
        'invoice.period', 'client.name', 'client.contact_name'
      ],
      client: [
        'client.name', 'client.contact_name', 'project.name', 
        'consultant.name', 'manager.name', 'service.name'
      ],
      leave: [
        'employee.first_name', 'leave.type', 'leave.start_date',
        'leave.end_date', 'leave.days', 'approver.name'
      ],
      work_schedule: [
        'consultant.first_name', 'assignment.title', 'client.name',
        'assignment.start_date', 'assignment.end_date', 'assignment.hours_per_week'
      ],
      system: [
        'user.first_name', 'system.name', 'maintenance.date',
        'update.version', 'admin.name'
      ]
    };

    return categoryVariables[category] || [];
  }

  /**
   * Create template duplicate with new name
   */
  createTemplateDuplicate(
    sourceTemplate: EmailTemplate,
    newName: string,
    userId: string
  ): Partial<EmailTemplate> {
    return {
      name: newName,
      description: `Copy of ${sourceTemplate.name}`,
      category: sourceTemplate.category,
      subjectTemplate: sourceTemplate.subjectTemplate,
      htmlContent: sourceTemplate.htmlContent,
      textContent: sourceTemplate.textContent || '',
      availableVariables: [...sourceTemplate.availableVariables],
      isActive: true,
      isSystemTemplate: false,
      requiresApproval: false,
      createdByUserId: userId
    };
  }

  /**
   * Interpolate variables in template content
   */
  private interpolateVariables(content: string, variables: Record<string, any>): string {
    let processedContent = content;

    // Replace all {{variable}} patterns
    const variableRegex = /\{\{([^}]+)\}\}/g;
    
    processedContent = processedContent.replace(variableRegex, (match, variableName) => {
      const trimmedName = variableName.trim();
      
      if (variables.hasOwnProperty(trimmedName)) {
        const value = variables[trimmedName];
        return this.formatVariableValue(value);
      }
      
      // Return original if variable not found
      return match;
    });

    return processedContent;
  }

  /**
   * Format variable value for display
   */
  private formatVariableValue(value: any): string {
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
      return value.toLocaleDateString('en-AU');
    }

    return String(value);
  }

  /**
   * Convert HTML to plain text
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  }

  /**
   * Validate HTML content
   */
  private validateHtmlContent(html: string): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for potentially dangerous HTML
    const dangerousPatterns = [
      /<script/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /javascript:/i,
      /onload=/i,
      /onclick=/i,
      /onerror=/i
    ];

    dangerousPatterns.forEach(pattern => {
      if (pattern.test(html)) {
        errors.push('HTML content contains potentially dangerous elements or scripts');
      }
    });

    // Check for common email issues
    if (html.length > 100000) {
      warnings.push('HTML content is very large and may cause delivery issues');
    }

    if (!html.includes('font-family') && !html.includes('<style')) {
      warnings.push('Consider adding font-family styles for better email client compatibility');
    }

    return { errors, warnings };
  }

  /**
   * Validate template variables
   */
  private validateTemplateVariables(
    subject: string,
    content: string,
    availableVariables: string[]
  ): {
    missing: string[];
    warnings: string[];
  } {
    const usedVariables = [
      ...this.extractVariables(subject),
      ...this.extractVariables(content)
    ];

    const missing = usedVariables.filter(
      variable => !availableVariables.includes(variable)
    );

    const warnings: string[] = [];
    
    if (usedVariables.length === 0) {
      warnings.push('Template does not use any variables - consider adding dynamic content');
    }

    const unusedVariables = availableVariables.filter(
      variable => !usedVariables.includes(variable)
    );

    if (unusedVariables.length > 0) {
      warnings.push(`Available variables not used: ${unusedVariables.join(', ')}`);
    }

    return { missing, warnings };
  }

  /**
   * Validate template security
   */
  private validateTemplateSecurity(content: string): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for XSS vulnerabilities
    const xssPatterns = [
      /javascript:/i,
      /vbscript:/i,
      /onload\s*=/i,
      /onclick\s*=/i,
      /onerror\s*=/i,
      /onmouseover\s*=/i,
      /<script/i,
      /eval\s*\(/i,
      /expression\s*\(/i
    ];

    xssPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        errors.push('Content contains potentially malicious code');
      }
    });

    // Check for external resource references
    if (content.includes('http://')) {
      warnings.push('Template contains non-HTTPS external resources');
    }

    return { errors, warnings };
  }
}

// Singleton instance
export const templateService = new EmailTemplateService();
export default templateService;