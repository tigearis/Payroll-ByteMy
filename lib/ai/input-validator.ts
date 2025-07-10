import * as DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

export interface ValidationResult {
  isValid: boolean;
  sanitizedInput?: string | undefined;
  violations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class AIInputValidator {
  private static readonly SUSPICIOUS_PATTERNS = [
    // Prompt injection patterns
    {
      pattern: /ignore.*(previous|above|prior).*(instructions?|prompts?|rules?)/i,
      risk: 'critical',
      description: 'Prompt injection attempt - instruction override'
    },
    {
      pattern: /system.*prompt|prompt.*system/i,
      risk: 'high',
      description: 'System prompt manipulation attempt'
    },
    {
      pattern: /act\s+as\s+(admin|administrator|root|system)/i,
      risk: 'high',
      description: 'Role escalation attempt'
    },
    
    // Data extraction patterns
    {
      pattern: /\b(password|token|secret|key|api.?key)\b/i,
      risk: 'medium',
      description: 'Potential credential harvesting'
    },
    {
      pattern: /show\s+me\s+(all|every|database|table|schema)/i,
      risk: 'medium',
      description: 'Data enumeration attempt'
    },
    
    // Code injection patterns
    {
      pattern: /<script|javascript:|data:/i,
      risk: 'high',
      description: 'Script injection attempt'
    },
    {
      pattern: /\$\{|\{\{|\[\[|\]\]|\}\}/,
      risk: 'medium',
      description: 'Template injection attempt'
    }
  ];

  private static readonly MAX_INPUT_LENGTH = 2000;
  private static readonly MIN_INPUT_LENGTH = 3;

  static validateInput(input: string, context?: {
    userId: string;
    userRole: string;
    endpoint: string;
  }): ValidationResult {
    const violations: string[] = [];
    let riskLevel: ValidationResult['riskLevel'] = 'low';

    // Basic validation
    if (!input || input.trim().length < this.MIN_INPUT_LENGTH) {
      violations.push('Input too short');
      return { isValid: false, violations, riskLevel: 'low' };
    }

    if (input.length > this.MAX_INPUT_LENGTH) {
      violations.push(`Input exceeds maximum length of ${this.MAX_INPUT_LENGTH} characters`);
      return { isValid: false, violations, riskLevel: 'medium' };
    }

    // Sanitize input
    // Note: Using default import style for isomorphic-dompurify
    const sanitizedInput = (DOMPurify as any).sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });

    // Pattern matching
    for (const { pattern, risk, description } of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(input)) {
        violations.push(description);
        
        // Update risk level to highest detected
        const riskLevels = ['low', 'medium', 'high', 'critical'];
        const currentRiskIndex = riskLevels.indexOf(riskLevel);
        const detectedRiskIndex = riskLevels.indexOf(risk);
        
        if (detectedRiskIndex > currentRiskIndex) {
          riskLevel = risk as ValidationResult['riskLevel'];
        }
      }
    }

    // Additional entropy analysis for obfuscated attacks
    const entropy = this.calculateEntropy(input);
    if (entropy > 4.5 && input.length > 100) {
      violations.push('High entropy content - possible obfuscated attack');
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    }

    const isValid = violations.length === 0 || riskLevel === 'low';

    // Log security events for medium+ risk
    if (riskLevel !== 'low' && context) {
      this.logSecurityEvent({
        ...context,
        riskLevel,
        violations,
        inputLength: input.length,
        sanitizedLength: sanitizedInput.length,
        entropy
      });
    }

    return {
      isValid,
      sanitizedInput: isValid ? sanitizedInput : undefined,
      violations,
      riskLevel
    };
  }

  private static calculateEntropy(str: string): number {
    const freq: { [key: string]: number } = {};
    
    for (const char of str) {
      freq[char] = (freq[char] || 0) + 1;
    }
    
    let entropy = 0;
    const len = str.length;
    
    for (const count of Object.values(freq)) {
      const p = count / len;
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    }
    
    return entropy;
  }

  private static async logSecurityEvent(event: any) {
    try {
      // Log to security monitoring system
      console.warn('AI Security Event:', {
        timestamp: new Date().toISOString(),
        ...event
      });
      
      // TODO: Send to security monitoring system
      // await securityMonitor.alert(event);
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }
}

// Zod schema for additional validation
export const aiInputSchema = z.object({
  message: z.string()
    .min(3, 'Message too short')
    .max(2000, 'Message too long')
    .refine(
      (val) => AIInputValidator.validateInput(val).isValid,
      'Message contains suspicious content'
    ),
  context: z.object({
    pathname: z.string().optional(),
    searchParams: z.record(z.string()).optional(),
    pageData: z.record(z.any()).optional()
  }).optional()
});