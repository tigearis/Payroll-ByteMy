/**
 * Enhanced Service Pricing Engine
 * 
 * Handles complex pricing calculations including:
 * - Volume discounts
 * - Client tier pricing
 * - Contract-based discounts
 * - Seasonal pricing
 * - Bundle pricing
 * - Custom pricing rules
 */

import { ServiceFragment, ServicePricingRuleFragment, EnhancedClientServiceAgreementFragment } from '../graphql/generated/graphql';

export interface PricingContext {
  serviceId: string;
  clientId: string;
  quantity: number;
  billingDate?: Date;
  contractLength?: number; // in months
  clientTier?: 'standard' | 'premium' | 'enterprise';
  employeeCount?: number;
  monthlyPayrollCount?: number;
  existingServices?: string[]; // Other services the client uses
  isNewClient?: boolean;
  seasonalPeriod?: 'peak' | 'off-peak' | 'standard';
}

export interface PricingRule {
  id: string;
  serviceId: string;
  ruleName: string;
  ruleType: 'volume_discount' | 'client_tier' | 'contract_length' | 'seasonal' | 'bundle' | 'new_client' | 'loyalty' | 'custom';
  priority: number;
  conditions: {
    minQuantity?: number;
    maxQuantity?: number;
    clientTier?: string[];
    minContractLength?: number;
    minEmployeeCount?: number;
    maxEmployeeCount?: number;
    requiredServices?: string[];
    seasonalPeriods?: string[];
    isNewClient?: boolean;
    minMonthlyPayrolls?: number;
    customCondition?: string; // JSON path for complex conditions
  };
  pricing: {
    adjustmentType: 'percentage_discount' | 'fixed_discount' | 'fixed_rate' | 'markup' | 'tier_rate';
    value: number;
    maxDiscount?: number; // Cap on total discount
    minRate?: number; // Floor on final rate
    tierRates?: Array<{
      minQuantity: number;
      rate: number;
    }>;
  };
  effectiveFrom?: Date;
  effectiveUntil?: Date;
  isActive: boolean;
}

export interface PricingResult {
  originalRate: number;
  finalRate: number;
  totalAmount: number;
  appliedRules: Array<{
    ruleId: string;
    ruleName: string;
    ruleType: string;
    adjustment: number;
    adjustmentType: string;
  }>;
  discountAmount: number;
  discountPercentage: number;
  metadata: {
    calculationDate: Date;
    context: PricingContext;
    warnings?: string[];
  };
}

export class ServicePricingEngine {
  private pricingRules: Map<string, PricingRule[]> = new Map();
  private serviceCache: Map<string, ServiceFragment> = new Map();

  constructor() {
    // Initialize with default pricing rules
    this.initializeDefaultRules();
  }

  /**
   * Calculate price for a service with given context
   */
  async calculatePrice(
    service: ServiceFragment,
    context: PricingContext,
    customRules?: PricingRule[]
  ): Promise<PricingResult> {
    const originalRate = service.defaultRate;
    let currentRate = originalRate;
    const appliedRules: PricingResult['appliedRules'] = [];
    const warnings: string[] = [];

    // Get applicable pricing rules
    const applicableRules = await this.getApplicableRules(service.id, context, customRules);

    // Sort rules by priority (higher priority first)
    applicableRules.sort((a, b) => b.priority - a.priority);

    // Apply each rule in order
    for (const rule of applicableRules) {
      const ruleResult = this.applyPricingRule(rule, currentRate, context);
      
      if (ruleResult.adjusted) {
        appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.ruleName,
          ruleType: rule.ruleType,
          adjustment: ruleResult.adjustment,
          adjustmentType: rule.pricing.adjustmentType
        });
        
        currentRate = ruleResult.newRate;
        
        if (ruleResult.warning) {
          warnings.push(ruleResult.warning);
        }
      }
    }

    // Apply minimum rate floor if specified
    const minRate = Math.min(...applicableRules.map(r => r.pricing.minRate || 0).filter(r => r > 0));
    if (minRate > 0 && currentRate < minRate) {
      currentRate = minRate;
      warnings.push(`Rate adjusted to minimum floor of ${minRate}`);
    }

    const totalAmount = currentRate * context.quantity;
    const discountAmount = (originalRate - currentRate) * context.quantity;
    const discountPercentage = originalRate > 0 ? ((originalRate - currentRate) / originalRate) * 100 : 0;

    return {
      originalRate,
      finalRate: currentRate,
      totalAmount,
      appliedRules,
      discountAmount,
      discountPercentage,
      metadata: {
        calculationDate: new Date(),
        context,
        warnings: warnings.length > 0 ? warnings : undefined
      }
    };
  }

  /**
   * Calculate bundle pricing for multiple services
   */
  async calculateBundlePrice(
    services: Array<{ service: ServiceFragment; quantity: number }>,
    context: Omit<PricingContext, 'serviceId' | 'quantity'>,
    bundleDiscount?: number
  ): Promise<{
    services: PricingResult[];
    bundleDiscount: number;
    totalOriginal: number;
    totalFinal: number;
    totalSavings: number;
  }> {
    const serviceResults: PricingResult[] = [];
    let totalOriginal = 0;
    let totalFinal = 0;

    // Calculate individual service prices
    for (const { service, quantity } of services) {
      const serviceContext: PricingContext = {
        ...context,
        serviceId: service.id,
        quantity,
        existingServices: services.map(s => s.service.id) // For bundle rule context
      };

      const result = await this.calculatePrice(service, serviceContext);
      serviceResults.push(result);
      totalOriginal += result.originalRate * quantity;
      totalFinal += result.totalAmount;
    }

    // Apply bundle discount if specified
    let finalBundleDiscount = bundleDiscount || 0;
    if (finalBundleDiscount > 0) {
      const bundleDiscountAmount = totalFinal * (finalBundleDiscount / 100);
      totalFinal -= bundleDiscountAmount;
    }

    return {
      services: serviceResults,
      bundleDiscount: finalBundleDiscount,
      totalOriginal,
      totalFinal,
      totalSavings: totalOriginal - totalFinal
    };
  }

  /**
   * Get pricing recommendations for a client
   */
  async getPricingRecommendations(
    clientId: string,
    serviceIds: string[],
    context: Partial<PricingContext>
  ): Promise<{
    recommendations: Array<{
      serviceId: string;
      originalRate: number;
      recommendedRate: number;
      reason: string;
      potentialSavings: number;
    }>;
    bundleOpportunities: Array<{
      services: string[];
      bundleName: string;
      totalSavings: number;
      description: string;
    }>;
  }> {
    // This would integrate with actual service data and client history
    // For now, return a structured response format
    return {
      recommendations: [],
      bundleOpportunities: []
    };
  }

  private async getApplicableRules(
    serviceId: string,
    context: PricingContext,
    customRules?: PricingRule[]
  ): Promise<PricingRule[]> {
    const serviceRules = this.pricingRules.get(serviceId) || [];
    const allRules = [...serviceRules, ...(customRules || [])];
    
    return allRules.filter(rule => this.isRuleApplicable(rule, context));
  }

  private isRuleApplicable(rule: PricingRule, context: PricingContext): boolean {
    if (!rule.isActive) return false;

    const now = new Date();
    if (rule.effectiveFrom && now < rule.effectiveFrom) return false;
    if (rule.effectiveUntil && now > rule.effectiveUntil) return false;

    const conditions = rule.conditions;

    // Check quantity conditions
    if (conditions.minQuantity && context.quantity < conditions.minQuantity) return false;
    if (conditions.maxQuantity && context.quantity > conditions.maxQuantity) return false;

    // Check client tier
    if (conditions.clientTier && context.clientTier && !conditions.clientTier.includes(context.clientTier)) {
      return false;
    }

    // Check contract length
    if (conditions.minContractLength && (!context.contractLength || context.contractLength < conditions.minContractLength)) {
      return false;
    }

    // Check employee count
    if (conditions.minEmployeeCount && (!context.employeeCount || context.employeeCount < conditions.minEmployeeCount)) {
      return false;
    }
    if (conditions.maxEmployeeCount && context.employeeCount && context.employeeCount > conditions.maxEmployeeCount) {
      return false;
    }

    // Check required services
    if (conditions.requiredServices && conditions.requiredServices.length > 0) {
      if (!context.existingServices || !conditions.requiredServices.every(s => context.existingServices!.includes(s))) {
        return false;
      }
    }

    // Check seasonal periods
    if (conditions.seasonalPeriods && context.seasonalPeriod && !conditions.seasonalPeriods.includes(context.seasonalPeriod)) {
      return false;
    }

    // Check new client status
    if (conditions.isNewClient !== undefined && context.isNewClient !== conditions.isNewClient) {
      return false;
    }

    // Check monthly payroll count
    if (conditions.minMonthlyPayrolls && (!context.monthlyPayrollCount || context.monthlyPayrollCount < conditions.minMonthlyPayrolls)) {
      return false;
    }

    return true;
  }

  private applyPricingRule(
    rule: PricingRule,
    currentRate: number,
    context: PricingContext
  ): { adjusted: boolean; newRate: number; adjustment: number; warning?: string } {
    const pricing = rule.pricing;
    let newRate = currentRate;
    let adjustment = 0;
    let warning: string | undefined;

    switch (pricing.adjustmentType) {
      case 'percentage_discount':
        adjustment = currentRate * (pricing.value / 100);
        newRate = currentRate - adjustment;
        break;

      case 'fixed_discount':
        adjustment = pricing.value;
        newRate = Math.max(0, currentRate - adjustment);
        break;

      case 'fixed_rate':
        adjustment = currentRate - pricing.value;
        newRate = pricing.value;
        break;

      case 'markup':
        adjustment = -(currentRate * (pricing.value / 100));
        newRate = currentRate + Math.abs(adjustment);
        break;

      case 'tier_rate':
        if (pricing.tierRates && pricing.tierRates.length > 0) {
          const applicableTier = pricing.tierRates
            .filter(tier => context.quantity >= tier.minQuantity)
            .sort((a, b) => b.minQuantity - a.minQuantity)[0];
          
          if (applicableTier) {
            adjustment = currentRate - applicableTier.rate;
            newRate = applicableTier.rate;
          }
        }
        break;

      default:
        return { adjusted: false, newRate: currentRate, adjustment: 0 };
    }

    // Apply maximum discount cap
    if (pricing.maxDiscount && adjustment > pricing.maxDiscount) {
      adjustment = pricing.maxDiscount;
      newRate = currentRate - adjustment;
      warning = `Discount capped at maximum of ${pricing.maxDiscount}`;
    }

    // Apply minimum rate floor
    if (pricing.minRate && newRate < pricing.minRate) {
      const originalAdjustment = adjustment;
      adjustment = currentRate - pricing.minRate;
      newRate = pricing.minRate;
      warning = `Rate adjusted to minimum floor of ${pricing.minRate} (original adjustment was ${originalAdjustment})`;
    }

    return {
      adjusted: adjustment !== 0,
      newRate,
      adjustment,
      warning
    };
  }

  private initializeDefaultRules(): void {
    // Volume discount rules
    const volumeDiscountRules: PricingRule[] = [
      {
        id: 'vol-discount-small',
        serviceId: 'all', // Applies to all services
        ruleName: 'Small Volume Discount',
        ruleType: 'volume_discount',
        priority: 5,
        conditions: {
          minQuantity: 5,
          maxQuantity: 19
        },
        pricing: {
          adjustmentType: 'percentage_discount',
          value: 5
        },
        isActive: true
      },
      {
        id: 'vol-discount-medium',
        serviceId: 'all',
        ruleName: 'Medium Volume Discount',
        ruleType: 'volume_discount',
        priority: 6,
        conditions: {
          minQuantity: 20,
          maxQuantity: 49
        },
        pricing: {
          adjustmentType: 'percentage_discount',
          value: 10
        },
        isActive: true
      },
      {
        id: 'vol-discount-large',
        serviceId: 'all',
        ruleName: 'Large Volume Discount',
        ruleType: 'volume_discount',
        priority: 7,
        conditions: {
          minQuantity: 50
        },
        pricing: {
          adjustmentType: 'percentage_discount',
          value: 15,
          maxDiscount: 100 // Cap discount at $100
        },
        isActive: true
      }
    ];

    // Client tier pricing rules
    const clientTierRules: PricingRule[] = [
      {
        id: 'premium-tier-discount',
        serviceId: 'all',
        ruleName: 'Premium Client Discount',
        ruleType: 'client_tier',
        priority: 8,
        conditions: {
          clientTier: ['premium']
        },
        pricing: {
          adjustmentType: 'percentage_discount',
          value: 8
        },
        isActive: true
      },
      {
        id: 'enterprise-tier-discount',
        serviceId: 'all',
        ruleName: 'Enterprise Client Discount',
        ruleType: 'client_tier',
        priority: 9,
        conditions: {
          clientTier: ['enterprise']
        },
        pricing: {
          adjustmentType: 'percentage_discount',
          value: 12
        },
        isActive: true
      }
    ];

    // New client incentives
    const newClientRules: PricingRule[] = [
      {
        id: 'new-client-discount',
        serviceId: 'all',
        ruleName: 'New Client Welcome Discount',
        ruleType: 'new_client',
        priority: 10,
        conditions: {
          isNewClient: true
        },
        pricing: {
          adjustmentType: 'percentage_discount',
          value: 15,
          maxDiscount: 200
        },
        effectiveFrom: new Date('2024-01-01'),
        effectiveUntil: new Date('2024-12-31'),
        isActive: true
      }
    ];

    // Store all default rules
    this.pricingRules.set('all', [...volumeDiscountRules, ...clientTierRules, ...newClientRules]);
  }

  /**
   * Add custom pricing rule for a specific service
   */
  addCustomRule(serviceId: string, rule: PricingRule): void {
    const serviceRules = this.pricingRules.get(serviceId) || [];
    serviceRules.push(rule);
    this.pricingRules.set(serviceId, serviceRules);
  }

  /**
   * Remove a pricing rule
   */
  removeRule(serviceId: string, ruleId: string): void {
    const serviceRules = this.pricingRules.get(serviceId) || [];
    const updatedRules = serviceRules.filter(rule => rule.id !== ruleId);
    this.pricingRules.set(serviceId, updatedRules);
  }

  /**
   * Get all rules for a service
   */
  getServiceRules(serviceId: string): PricingRule[] {
    return this.pricingRules.get(serviceId) || [];
  }
}

// Export singleton instance
export const pricingEngine = new ServicePricingEngine();