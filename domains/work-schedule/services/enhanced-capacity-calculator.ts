/**
 * Enhanced Capacity Calculator Service
 * Handles position-aware capacity calculations with admin time allocation
 */

import { format, addDays, parseISO, isWeekend } from "date-fns";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type UserPosition = 
  | 'consultant' 
  | 'senior_consultant' 
  | 'manager' 
  | 'senior_manager' 
  | 'partner' 
  | 'senior_partner';

export interface WorkScheduleWithAdmin {
  id: string;
  userId: string;
  workDay: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  usesDefaultAdminTime: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultantCapacity {
  consultantId: string;
  totalWorkHours: number;
  totalAdminHours: number;
  totalPayrollCapacity: number;
  currentlyAssignedHours: number;
  availableCapacityHours: number;
  utilizationPercentage: number;
  adminTimePercentage: number;
  processingWindowDays: number;
}

export interface CapacityByDay {
  date: string;
  workDay: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignedHours: number;
  availableHours: number;
  isWorkingDay: boolean;
}

export interface PayrollProcessingRequirement {
  payrollId: string;
  processingTime: number;
  processingDaysBeforeEft: number;
  eftDate: string;
  primaryConsultantUserId?: string;
  backupConsultantUserId?: string;
}

export interface PositionAdminDefault {
  position: UserPosition;
  defaultAdminPercentage: number;
  description: string;
}

export interface CapacityConflict {
  type: 'overallocation' | 'timeline_risk' | 'unavailable_day' | 'insufficient_buffer';
  severity: 'low' | 'medium' | 'high' | 'critical';
  consultantId: string;
  payrollId?: string;
  message: string;
  suggestedResolution: string;
  affectedDates: string[];
}

export interface AssignmentRecommendation {
  consultantId: string;
  score: number;
  reasoning: string[];
  capacityUtilization: number;
  alternativeTimelines: ProcessingTimeline[];
  conflictLevel: 'none' | 'minor' | 'major' | 'critical';
}

export interface ProcessingTimeline {
  startDate: string;
  endDate: string;
  eftDate: string;
  bufferDays: number;
  workingDaysAvailable: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// =============================================================================
// POSITION ADMIN TIME DEFAULTS
// =============================================================================

export const POSITION_ADMIN_DEFAULTS: Record<UserPosition, PositionAdminDefault> = {
  consultant: {
    position: 'consultant',
    defaultAdminPercentage: 12.5,
    description: 'Basic admin tasks: team meetings, system updates, training'
  },
  senior_consultant: {
    position: 'senior_consultant', 
    defaultAdminPercentage: 17.5,
    description: 'Admin tasks plus mentoring junior staff and knowledge sharing'
  },
  manager: {
    position: 'manager',
    defaultAdminPercentage: 45.0,
    description: 'Team management, client meetings, planning, and reporting'
  },
  senior_manager: {
    position: 'senior_manager',
    defaultAdminPercentage: 55.0,
    description: 'Strategic management of multiple teams and complex client relationships'
  },
  partner: {
    position: 'partner',
    defaultAdminPercentage: 65.0,
    description: 'Business development, client relations, strategic planning, and firm management'
  },
  senior_partner: {
    position: 'senior_partner',
    defaultAdminPercentage: 75.0,
    description: 'Executive duties, firm-wide management, partnerships, and strategic direction'
  }
};

// =============================================================================
// CORE CAPACITY CALCULATION SERVICE
// =============================================================================

export class EnhancedCapacityCalculator {
  
  /**
   * Calculate consultant capacity for a specific date range
   */
  static calculateConsultantCapacity(
    schedules: WorkScheduleWithAdmin[],
    assignedPayrolls: PayrollProcessingRequirement[],
    startDate: string,
    endDate: string
  ): ConsultantCapacity {
    
    const totalWorkHours = schedules.reduce((sum, schedule) => sum + schedule.workHours, 0);
    const totalAdminHours = schedules.reduce((sum, schedule) => sum + schedule.adminTimeHours, 0);
    const totalPayrollCapacity = schedules.reduce((sum, schedule) => sum + schedule.payrollCapacityHours, 0);
    
    // Calculate currently assigned hours from payrolls
    const currentlyAssignedHours = assignedPayrolls.reduce(
      (sum, payroll) => sum + payroll.processingTime, 0
    );
    
    const availableCapacityHours = Math.max(0, totalPayrollCapacity - currentlyAssignedHours);
    const utilizationPercentage = totalPayrollCapacity > 0 
      ? (currentlyAssignedHours / totalPayrollCapacity) * 100 
      : 0;
    const adminTimePercentage = totalWorkHours > 0 
      ? (totalAdminHours / totalWorkHours) * 100 
      : 0;
    
    const processingWindowDays = this.calculateProcessingWindowDays(startDate, endDate);
    
    return {
      consultantId: schedules[0]?.userId || '',
      totalWorkHours,
      totalAdminHours,
      totalPayrollCapacity,
      currentlyAssignedHours,
      availableCapacityHours,
      utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
      adminTimePercentage: Math.round(adminTimePercentage * 100) / 100,
      processingWindowDays
    };
  }

  /**
   * Calculate capacity breakdown by individual days
   */
  static calculateCapacityByDay(
    schedules: WorkScheduleWithAdmin[],
    assignedPayrolls: PayrollProcessingRequirement[],
    startDate: string,
    endDate: string
  ): CapacityByDay[] {
    
    const days: CapacityByDay[] = [];
    let currentDate = parseISO(startDate);
    const end = parseISO(endDate);
    
    while (currentDate <= end) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const workDay = format(currentDate, 'EEEE');
      
      // Find schedule for this day
      const schedule = schedules.find(s => s.workDay.toLowerCase() === workDay.toLowerCase());
      
      if (schedule) {
        // Calculate assigned hours for this day (simplified - could be more sophisticated)
        const dailyAssignedHours = this.calculateDailyAssignedHours(
          assignedPayrolls, 
          dateStr, 
          schedule.payrollCapacityHours
        );
        
        days.push({
          date: dateStr,
          workDay,
          workHours: schedule.workHours,
          adminTimeHours: schedule.adminTimeHours,
          payrollCapacityHours: schedule.payrollCapacityHours,
          assignedHours: dailyAssignedHours,
          availableHours: Math.max(0, schedule.payrollCapacityHours - dailyAssignedHours),
          isWorkingDay: true
        });
      } else {
        // Non-working day
        days.push({
          date: dateStr,
          workDay,
          workHours: 0,
          adminTimeHours: 0,
          payrollCapacityHours: 0,
          assignedHours: 0,
          availableHours: 0,
          isWorkingDay: false
        });
      }
      
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  }

  /**
   * Calculate admin time hours based on position and work hours
   */
  static calculateAdminTimeHours(
    workHours: number, 
    position: UserPosition, 
    customAdminPercentage?: number
  ): number {
    const percentage = customAdminPercentage ?? POSITION_ADMIN_DEFAULTS[position].defaultAdminPercentage;
    return Math.round((workHours * (percentage / 100)) * 100) / 100;
  }

  /**
   * Calculate effective payroll capacity (work hours - admin time)
   */
  static calculatePayrollCapacity(workHours: number, adminTimeHours: number): number {
    return Math.max(0, workHours - adminTimeHours);
  }

  /**
   * Detect capacity conflicts for a consultant
   */
  static detectCapacityConflicts(
    capacity: ConsultantCapacity,
    dailyCapacity: CapacityByDay[],
    payroll: PayrollProcessingRequirement
  ): CapacityConflict[] {
    
    const conflicts: CapacityConflict[] = [];
    
    // Check for overallocation
    if (capacity.utilizationPercentage > 100) {
      conflicts.push({
        type: 'overallocation',
        severity: capacity.utilizationPercentage > 120 ? 'critical' : 'high',
        consultantId: capacity.consultantId,
        payrollId: payroll.payrollId,
        message: `Consultant overallocated: ${capacity.utilizationPercentage}% utilization`,
        suggestedResolution: 'Redistribute work or extend timeline',
        affectedDates: dailyCapacity.filter(d => d.availableHours < 0).map(d => d.date)
      });
    }
    
    // Check for EFT date timeline risk
    const eftDate = parseISO(payroll.eftDate);
    const bufferDate = addDays(eftDate, -payroll.processingDaysBeforeEft);
    const workingDaysUntilBuffer = this.calculateWorkingDays(
      dailyCapacity.filter(d => d.isWorkingDay && parseISO(d.date) <= bufferDate)
    );
    
    if (workingDaysUntilBuffer < 2) {
      conflicts.push({
        type: 'timeline_risk',
        severity: workingDaysUntilBuffer < 1 ? 'critical' : 'high',
        consultantId: capacity.consultantId,
        payrollId: payroll.payrollId,
        message: `Insufficient processing time: only ${workingDaysUntilBuffer} working days until deadline`,
        suggestedResolution: 'Start processing immediately or reassign to available consultant',
        affectedDates: [format(bufferDate, 'yyyy-MM-dd'), payroll.eftDate]
      });
    }
    
    // Check for unavailable days near EFT
    const criticalDays = dailyCapacity.filter(d => {
      const dayDate = parseISO(d.date);
      return dayDate >= addDays(eftDate, -3) && dayDate <= eftDate;
    });
    
    const unavailableCriticalDays = criticalDays.filter(d => !d.isWorkingDay);
    if (unavailableCriticalDays.length > 1) {
      conflicts.push({
        type: 'unavailable_day',
        severity: 'medium',
        consultantId: capacity.consultantId,
        payrollId: payroll.payrollId,
        message: `Consultant unavailable on ${unavailableCriticalDays.length} critical days before EFT`,
        suggestedResolution: 'Process payroll earlier or assign backup consultant',
        affectedDates: unavailableCriticalDays.map(d => d.date)
      });
    }
    
    return conflicts;
  }

  /**
   * Generate assignment recommendations for a payroll
   */
  static generateAssignmentRecommendations(
    consultantCapacities: Map<string, ConsultantCapacity>,
    payroll: PayrollProcessingRequirement,
    consultantDetails: Map<string, { position: UserPosition; name: string }>
  ): AssignmentRecommendation[] {
    
    const recommendations: AssignmentRecommendation[] = [];
    
    for (const [consultantId, capacity] of consultantCapacities) {
      const consultant = consultantDetails.get(consultantId);
      if (!consultant) continue;
      
      // Calculate recommendation score (0-100)
      let score = 0;
      const reasoning: string[] = [];
      
      // Available capacity factor (40% of score)
      const capacityFactor = Math.min(1, capacity.availableCapacityHours / payroll.processingTime);
      score += capacityFactor * 40;
      if (capacityFactor >= 1) {
        reasoning.push(`Sufficient capacity: ${capacity.availableCapacityHours}h available vs ${payroll.processingTime}h needed`);
      } else {
        reasoning.push(`Limited capacity: ${capacity.availableCapacityHours}h available vs ${payroll.processingTime}h needed`);
      }
      
      // Utilization balance factor (30% of score)
      const optimalUtilization = 75; // Target 75% utilization
      const utilizationDistance = Math.abs(capacity.utilizationPercentage - optimalUtilization);
      const utilizationFactor = Math.max(0, 1 - (utilizationDistance / 50));
      score += utilizationFactor * 30;
      reasoning.push(`Current utilization: ${capacity.utilizationPercentage}%`);
      
      // Position appropriateness factor (20% of score)
      const positionFactor = this.calculatePositionAppropriatenessFactor(consultant.position, payroll);
      score += positionFactor * 20;
      
      // Timeline buffer factor (10% of score)
      const bufferFactor = Math.min(1, capacity.processingWindowDays / 5); // Prefer 5+ day buffer
      score += bufferFactor * 10;
      if (capacity.processingWindowDays >= 5) {
        reasoning.push(`Good timeline buffer: ${capacity.processingWindowDays} days`);
      } else {
        reasoning.push(`Tight timeline: ${capacity.processingWindowDays} days`);
      }
      
      // Determine conflict level
      let conflictLevel: 'none' | 'minor' | 'major' | 'critical' = 'none';
      if (capacity.utilizationPercentage > 120) {
        conflictLevel = 'critical';
      } else if (capacity.utilizationPercentage > 100) {
        conflictLevel = 'major';
      } else if (capacity.utilizationPercentage > 90) {
        conflictLevel = 'minor';
      }
      
      recommendations.push({
        consultantId,
        score: Math.round(score),
        reasoning,
        capacityUtilization: capacity.utilizationPercentage,
        alternativeTimelines: this.generateAlternativeTimelines(payroll, capacity),
        conflictLevel
      });
    }
    
    // Sort by score (highest first)
    return recommendations.sort((a, b) => b.score - a.score);
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private static calculateProcessingWindowDays(startDate: string, endDate: string): number {
    let current = parseISO(startDate);
    const end = parseISO(endDate);
    let days = 0;
    
    while (current <= end) {
      if (!isWeekend(current)) {
        days++;
      }
      current = addDays(current, 1);
    }
    
    return days;
  }

  private static calculateDailyAssignedHours(
    payrolls: PayrollProcessingRequirement[],
    date: string,
    dailyCapacity: number
  ): number {
    // Simplified calculation - in reality, this would be more sophisticated
    // distributing payroll hours across available processing days
    const totalAssignedHours = payrolls.reduce((sum, p) => sum + p.processingTime, 0);
    const totalCapacity = dailyCapacity * 5; // Assume 5-day work week
    
    if (totalCapacity === 0) return 0;
    
    return Math.min(dailyCapacity, (totalAssignedHours / totalCapacity) * dailyCapacity);
  }

  private static calculateWorkingDays(dailyCapacity: CapacityByDay[]): number {
    return dailyCapacity.filter(d => d.isWorkingDay).length;
  }

  private static calculatePositionAppropriatenessFactor(
    position: UserPosition, 
    payroll: PayrollProcessingRequirement
  ): number {
    // Simple position appropriateness - could be enhanced with payroll complexity factors
    const complexityFactors = {
      consultant: 0.8,
      senior_consultant: 0.9,
      manager: 0.7, // Managers often focused on admin
      senior_manager: 0.6,
      partner: 0.5,
      senior_partner: 0.4
    };
    
    return complexityFactors[position] || 0.5;
  }

  private static generateAlternativeTimelines(
    payroll: PayrollProcessingRequirement,
    capacity: ConsultantCapacity
  ): ProcessingTimeline[] {
    
    const eftDate = parseISO(payroll.eftDate);
    const timelines: ProcessingTimeline[] = [];
    
    // Standard timeline
    const standardStart = addDays(eftDate, -payroll.processingDaysBeforeEft);
    timelines.push({
      startDate: format(standardStart, 'yyyy-MM-dd'),
      endDate: format(addDays(eftDate, -1), 'yyyy-MM-dd'),
      eftDate: payroll.eftDate,
      bufferDays: payroll.processingDaysBeforeEft,
      workingDaysAvailable: capacity.processingWindowDays,
      riskLevel: capacity.processingWindowDays >= 3 ? 'low' : 'high'
    });
    
    // Early start timeline (if needed)
    if (capacity.processingWindowDays < 3) {
      const earlyStart = addDays(standardStart, -2);
      timelines.push({
        startDate: format(earlyStart, 'yyyy-MM-dd'),
        endDate: format(addDays(eftDate, -1), 'yyyy-MM-dd'),
        eftDate: payroll.eftDate,
        bufferDays: payroll.processingDaysBeforeEft + 2,
        workingDaysAvailable: capacity.processingWindowDays + 2,
        riskLevel: 'medium'
      });
    }
    
    return timelines;
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get position admin time percentage
 */
export function getPositionAdminPercentage(position: UserPosition): number {
  return POSITION_ADMIN_DEFAULTS[position].defaultAdminPercentage;
}

/**
 * Get all position admin defaults
 */
export function getAllPositionAdminDefaults(): PositionAdminDefault[] {
  return Object.values(POSITION_ADMIN_DEFAULTS);
}

/**
 * Validate if admin time percentage is reasonable for position
 */
export function validateAdminTimeForPosition(
  position: UserPosition, 
  adminPercentage: number
): { valid: boolean; message?: string } {
  
  const defaultPercentage = POSITION_ADMIN_DEFAULTS[position].defaultAdminPercentage;
  const tolerance = 10; // Allow ±10% variance from default
  
  if (adminPercentage < 0 || adminPercentage > 100) {
    return { valid: false, message: 'Admin time percentage must be between 0 and 100' };
  }
  
  if (Math.abs(adminPercentage - defaultPercentage) > tolerance) {
    return { 
      valid: false, 
      message: `Admin time of ${adminPercentage}% is unusual for ${position} (typical: ${defaultPercentage}%)` 
    };
  }
  
  return { valid: true };
}

/**
 * Format capacity utilization for display
 */
export function formatCapacityUtilization(utilization: number): string {
  if (utilization <= 70) return `${utilization}% - Under-utilized`;
  if (utilization <= 85) return `${utilization}% - Well-balanced`;
  if (utilization <= 100) return `${utilization}% - High utilization`;
  return `${utilization}% - Overallocated`;
}

/**
 * Get capacity status color for UI
 */
export function getCapacityStatusColor(utilization: number): string {
  if (utilization <= 70) return 'blue';    // Under-utilized
  if (utilization <= 85) return 'green';   // Well-balanced
  if (utilization <= 100) return 'yellow'; // High utilization
  return 'red';                             // Overallocated
}