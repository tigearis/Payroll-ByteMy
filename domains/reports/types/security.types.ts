import { z } from "zod";

export const DataClassificationLevelSchema = z.enum([
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
]);

export const FieldSecurityRuleSchema = z.object({
  domain: z.string(),
  field: z.string(),
  classification: DataClassificationLevelSchema,
  requiredRoles: z.array(z.string()),
  requiredPermissions: z.array(z.string()),
  maskingRule: z.enum(["NONE", "PARTIAL", "FULL", "HASH", "CUSTOM"]).optional(),
  customMaskingFn: z.string().optional(), // JavaScript function as string
  auditLevel: z
    .enum(["NONE", "ACCESS", "MODIFICATION", "ALL"])
    .default("ACCESS"),
});

export const DomainSecurityRuleSchema = z.object({
  domain: z.string(),
  baselineClassification: DataClassificationLevelSchema,
  requiredRoles: z.array(z.string()),
  requiredPermissions: z.array(z.string()),
  fieldRules: z.record(z.string(), FieldSecurityRuleSchema),
});

export const SecurityPolicySchema = z.object({
  version: z.string(),
  lastUpdated: z.date(),
  domainRules: z.record(z.string(), DomainSecurityRuleSchema),
  globalRules: z.object({
    maxRecords: z.number().optional(),
    allowedTimeRanges: z
      .array(
        z.object({
          start: z.string(),
          end: z.string(),
          timezone: z.string(),
        })
      )
      .optional(),
    ipWhitelist: z.array(z.string()).optional(),
    requireMFA: z.boolean().default(false),
  }),
});

// Export types
export type DataClassificationLevel = z.infer<
  typeof DataClassificationLevelSchema
>;
export type FieldSecurityRule = z.infer<typeof FieldSecurityRuleSchema>;
export type DomainSecurityRule = z.infer<typeof DomainSecurityRuleSchema>;
export type SecurityPolicy = z.infer<typeof SecurityPolicySchema>;

// Helper functions
export function createFieldSecurityRule(
  domain: string,
  field: string,
  classification: DataClassificationLevel,
  options: Partial<FieldSecurityRule> = {}
): FieldSecurityRule {
  return {
    domain,
    field,
    classification,
    requiredRoles: [],
    requiredPermissions: [],
    auditLevel: "ACCESS",
    ...options,
  };
}

export function createDomainSecurityRule(
  domain: string,
  baselineClassification: DataClassificationLevel,
  options: Partial<DomainSecurityRule> = {}
): DomainSecurityRule {
  return {
    domain,
    baselineClassification,
    requiredRoles: [],
    requiredPermissions: [],
    fieldRules: {},
    ...options,
  };
}

// Data masking functions
export const maskingFunctions = {
  PARTIAL: (value: string) => {
    if (typeof value !== "string") return value;
    const length = value.length;
    const visibleChars = Math.ceil(length * 0.3); // Show 30% of characters
    return value.slice(0, visibleChars) + "*".repeat(length - visibleChars);
  },

  FULL: () => "********",

  HASH: (value: string) => {
    if (typeof value !== "string") return value;
    return createHash("sha256").update(value).digest("hex").slice(0, 8);
  },

  EMAIL: (value: string) => {
    if (typeof value !== "string" || !value.includes("@")) return value;
    const [local, domain] = value.split("@");
    return `${local[0]}***@${domain}`;
  },

  PHONE: (value: string) => {
    if (typeof value !== "string") return value;
    const digits = value.replace(/\D/g, "");
    return `****${digits.slice(-4)}`;
  },

  SSN: (value: string) => {
    if (typeof value !== "string") return value;
    const digits = value.replace(/\D/g, "");
    return `***-**-${digits.slice(-4)}`;
  },
};
