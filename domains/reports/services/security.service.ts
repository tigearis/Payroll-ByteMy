export type FieldAccessResult = {
  allowed: string[];
  denied: string[];
  reason?: string;
};

export type DataClassification = {
  critical: string[];
  high: string[];
  medium: string[];
  low: string[];
};

export class ReportSecurityService {
  private fieldPermissions: Map<string, Map<string, string[]>> = new Map();
  private dataClassifications: Map<string, DataClassification> = new Map();

  constructor() {
    this.initializeSecurityRules();
  }

  private initializeSecurityRules() {
    // Initialize field permissions and data classifications
    // This would typically be loaded from a configuration or database
  }

  async validateFieldAccess(
    userId: string,
    domain: string,
    fields: string[]
  ): Promise<FieldAccessResult> {
    const userPermissions = await this.getUserPermissions(userId);
    const domainPermissions = this.fieldPermissions.get(domain);

    if (!domainPermissions) {
      return {
        allowed: [],
        denied: fields,
        reason: `No permissions defined for domain: ${domain}`,
      };
    }

    const allowed: string[] = [];
    const denied: string[] = [];

    for (const field of fields) {
      const requiredPermissions = domainPermissions.get(field) || [];
      if (
        requiredPermissions.length === 0 ||
        requiredPermissions.some(perm => userPermissions.includes(perm))
      ) {
        allowed.push(field);
      } else {
        denied.push(field);
      }
    }

    return {
      allowed,
      denied,
      reason: denied.length > 0 ? "Insufficient permissions" : undefined,
    };
  }

  async classifyData(
    domain: string,
    fields: string[]
  ): Promise<DataClassification> {
    const classification = this.dataClassifications.get(domain) || {
      critical: [],
      high: [],
      medium: [],
      low: [],
    };

    return {
      critical: fields.filter(f => classification.critical.includes(f)),
      high: fields.filter(f => classification.high.includes(f)),
      medium: fields.filter(f => classification.medium.includes(f)),
      low: fields.filter(f => classification.low.includes(f)),
    };
  }

  private async getUserPermissions(userId: string): Promise<string[]> {
    // Implement user permission retrieval from Clerk/auth system
    return [];
  }

  async validateReportAccess(
    userId: string,
    reportId: string
  ): Promise<boolean> {
    // Implement report access validation
    return true;
  }

  async validateTemplateAccess(
    userId: string,
    templateId: string
  ): Promise<boolean> {
    // Implement template access validation
    return true;
  }
}
