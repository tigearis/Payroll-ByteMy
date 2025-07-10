"use client";

import { format, parseISO, addDays, isBefore, isAfter } from "date-fns";
import { 
  Wand2,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Target,
  Star,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Filter,
  Search,
  Zap,
  WifiOff,
  RefreshCw
} from "lucide-react";
import { useState, useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  type UserPosition,
  type ConsultantCapacity,
  type CapacityConflict,
  getPositionAdminPercentage,
  formatCapacityUtilization,
  getCapacityStatusColor
} from "../services/enhanced-capacity-calculator";
import { AssignmentWizardSkeleton, SmartLoadingSpinner } from "./loading-states";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface PayrollToAssign {
  id: string;
  name: string;
  clientName: string;
  processingTime: number;
  processingDaysBeforeEft: number;
  complexity: 'low' | 'medium' | 'high';
  requiredSkills: Array<{
    name: string;
    requiredLevel: string;
  }>;
  payrollDates?: {
    adjustedEftDate: string;
    originalEftDate: string;
  }[];
}

interface AvailableConsultant {
  id: string;
  name: string;
  email: string;
  position: UserPosition;
  defaultAdminTimePercentage: number;
  isStaff: boolean;
  skills: Array<{
    name: string;
    proficiency: string;
  }>;
  workSchedules: {
    workDay: string;
    workHours: number;
    adminTimeHours: number;
    payrollCapacityHours: number;
  }[];
  assignedPayrolls: {
    id: string;
    name: string;
    processingTime: number;
  }[];
  capacity: ConsultantCapacity;
  conflicts: CapacityConflict[];
}

interface AssignmentRecommendation {
  consultantId: string;
  consultant: AvailableConsultant;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string[];
  warnings: string[];
  alternativeTimeline?: {
    suggestedStartDate: string;
    reason: string;
  };
}

interface AssignmentScenario {
  id: string;
  name: string;
  description: string;
  assignments: {
    payrollId: string;
    consultantId: string;
    startDate: string;
    confidence: number;
  }[];
  totalScore: number;
  risks: string[];
  benefits: string[];
}

interface AssignmentWizardProps {
  payrolls?: PayrollToAssign[];
  consultants?: AvailableConsultant[];
  onAssignPayroll?: (payrollId: string, consultantId: string, startDate: string) => void;
  onBulkAssign?: (assignments: Array<{payrollId: string; consultantId: string; startDate: string}>) => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getComplexityColor = (complexity: string): string => {
  switch (complexity) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPositionColor = (position: UserPosition): string => {
  switch (position) {
    case 'consultant': return 'bg-blue-100 text-blue-800';
    case 'senior_consultant': return 'bg-indigo-100 text-indigo-800';
    case 'manager': return 'bg-green-100 text-green-800';
    case 'senior_manager': return 'bg-emerald-100 text-emerald-800';
    case 'partner': return 'bg-purple-100 text-purple-800';
    case 'senior_partner': return 'bg-violet-100 text-violet-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPositionDisplayName = (position: UserPosition): string => {
  return position.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const calculateAssignmentScore = (
  payroll: PayrollToAssign,
  consultant: AvailableConsultant
): { score: number; reasoning: string[]; warnings: string[] } => {
  let score = 0;
  const reasoning: string[] = [];
  const warnings: string[] = [];

  // Capacity availability (40% of score)
  const capacityScore = Math.min(100, (consultant.capacity.availableCapacityHours / payroll.processingTime) * 100);
  score += capacityScore * 0.4;
  
  if (capacityScore >= 100) {
    reasoning.push(`Sufficient capacity: ${consultant.capacity.availableCapacityHours.toFixed(1)}h available for ${payroll.processingTime}h required`);
  } else if (capacityScore >= 80) {
    reasoning.push(`Adequate capacity: ${consultant.capacity.availableCapacityHours.toFixed(1)}h available (tight fit)`);
    warnings.push('Capacity utilization will be high');
  } else {
    warnings.push(`Insufficient capacity: Only ${consultant.capacity.availableCapacityHours.toFixed(1)}h available for ${payroll.processingTime}h required`);
  }

  // Position/experience match (25% of score)
  let positionScore = 0;
  switch (payroll.complexity) {
    case 'low':
      positionScore = ['consultant', 'senior_consultant'].includes(consultant.position) ? 100 : 80;
      break;
    case 'medium':
      positionScore = ['senior_consultant', 'manager'].includes(consultant.position) ? 100 : 
                     consultant.position === 'consultant' ? 60 : 90;
      break;
    case 'high':
      positionScore = ['manager', 'senior_manager', 'partner', 'senior_partner'].includes(consultant.position) ? 100 : 40;
      break;
  }
  score += positionScore * 0.25;
  
  if (positionScore >= 90) {
    reasoning.push(`Excellent position match: ${getPositionDisplayName(consultant.position)} for ${payroll.complexity} complexity`);
  } else if (positionScore >= 70) {
    reasoning.push(`Good position match: Can handle ${payroll.complexity} complexity payroll`);
  } else {
    warnings.push(`Position mismatch: ${getPositionDisplayName(consultant.position)} may struggle with ${payroll.complexity} complexity`);
  }

  // Skills match (20% of score)
  const matchingSkills = payroll.requiredSkills.filter(requiredSkill => 
    consultant.skills.some(consultantSkill => consultantSkill.name === requiredSkill.name)
  );
  const skillScore = payroll.requiredSkills.length > 0 ? 
    (matchingSkills.length / payroll.requiredSkills.length) * 100 : 100;
  score += skillScore * 0.2;

  if (skillScore >= 100) {
    reasoning.push('Perfect skills match: All required skills available');
  } else if (skillScore >= 70) {
    reasoning.push(`Good skills match: ${matchingSkills.length}/${payroll.requiredSkills.length} required skills`);
  } else if (payroll.requiredSkills.length > 0) {
    warnings.push(`Skills gap: Missing ${payroll.requiredSkills.length - matchingSkills.length} required skills`);
  }

  // Current workload (15% of score)
  const utilizationScore = Math.max(0, 100 - consultant.capacity.utilizationPercentage);
  score += utilizationScore * 0.15;

  if (consultant.capacity.utilizationPercentage <= 70) {
    reasoning.push(`Low current workload: ${consultant.capacity.utilizationPercentage.toFixed(0)}% utilized`);
  } else if (consultant.capacity.utilizationPercentage <= 90) {
    reasoning.push(`Moderate workload: ${consultant.capacity.utilizationPercentage.toFixed(0)}% utilized`);
  } else {
    warnings.push(`High workload: ${consultant.capacity.utilizationPercentage.toFixed(0)}% utilized`);
  }

  return { score: Math.min(100, score), reasoning, warnings };
};

const generateRecommendations = (
  payroll: PayrollToAssign,
  consultants: AvailableConsultant[]
): AssignmentRecommendation[] => {
  return consultants
    .map(consultant => {
      const { score, reasoning, warnings } = calculateAssignmentScore(payroll, consultant);
      
      let confidence: 'high' | 'medium' | 'low' = 'low';
      if (score >= 80 && warnings.length === 0) confidence = 'high';
      else if (score >= 60 && warnings.length <= 1) confidence = 'medium';

      let alternativeTimeline: AssignmentRecommendation['alternativeTimeline'];
      if (consultant.capacity.availableCapacityHours < payroll.processingTime) {
        // Suggest starting earlier to spread the work
        const suggestedStartDate = format(
          addDays(new Date(), -Math.ceil(payroll.processingTime / 4)), 
          'yyyy-MM-dd'
        );
        alternativeTimeline = {
          suggestedStartDate,
          reason: 'Start earlier to distribute workload across more days'
        };
      }

      return {
        consultantId: consultant.id,
        consultant,
        score,
        confidence,
        reasoning,
        warnings,
        ...(alternativeTimeline && { alternativeTimeline })
      };
    })
    .sort((a, b) => b.score - a.score);
};

const generateAssignmentScenarios = (
  payrolls: PayrollToAssign[],
  consultants: AvailableConsultant[]
): AssignmentScenario[] => {
  const scenarios: AssignmentScenario[] = [];

  // Scenario 1: Optimal Load Distribution
  const optimalAssignments = payrolls.map(payroll => {
    const recommendations = generateRecommendations(payroll, consultants);
    const bestMatch = recommendations.find(r => r.confidence === 'high') || recommendations[0];
    return {
      payrollId: payroll.id,
      consultantId: bestMatch.consultantId,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      confidence: bestMatch.score
    };
  });

  scenarios.push({
    id: 'optimal',
    name: 'Optimal Load Distribution',
    description: 'Assigns each payroll to the best available consultant based on capacity and skills',
    assignments: optimalAssignments,
    totalScore: optimalAssignments.reduce((sum, a) => sum + a.confidence, 0) / optimalAssignments.length,
    risks: ['May overload some consultants', 'Skills gaps possible'],
    benefits: ['Maximizes overall efficiency', 'Best capacity utilization']
  });

  // Scenario 2: Conservative Assignment
  const conservativeAssignments = payrolls.map(payroll => {
    const recommendations = generateRecommendations(payroll, consultants);
    const conservativeMatch = recommendations.find(r => 
      r.consultant.capacity.utilizationPercentage <= 70 && r.warnings.length === 0
    ) || recommendations[0];
    return {
      payrollId: payroll.id,
      consultantId: conservativeMatch.consultantId,
      startDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      confidence: conservativeMatch.score
    };
  });

  scenarios.push({
    id: 'conservative',
    name: 'Conservative Assignment',
    description: 'Prioritizes low-risk assignments with buffer capacity',
    assignments: conservativeAssignments,
    totalScore: conservativeAssignments.reduce((sum, a) => sum + a.confidence, 0) / conservativeAssignments.length,
    risks: ['May underutilize some consultants', 'Potentially slower processing'],
    benefits: ['Lower risk of conflicts', 'Built-in capacity buffer', 'Reduced stress levels']
  });

  // Scenario 3: Skills-First Assignment
  const skillsAssignments = payrolls.map(payroll => {
    const recommendations = generateRecommendations(payroll, consultants);
    const skillsMatch = recommendations.sort((a, b) => {
      const aSkills = payroll.requiredSkills.filter(requiredSkill => 
        a.consultant.skills.some(consultantSkill => consultantSkill.name === requiredSkill.name)
      ).length;
      const bSkills = payroll.requiredSkills.filter(requiredSkill => 
        b.consultant.skills.some(consultantSkill => consultantSkill.name === requiredSkill.name)
      ).length;
      return bSkills - aSkills;
    })[0];
    return {
      payrollId: payroll.id,
      consultantId: skillsMatch.consultantId,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      confidence: skillsMatch.score
    };
  });

  scenarios.push({
    id: 'skills-first',
    name: 'Skills-First Assignment',
    description: 'Prioritizes perfect skills matches over capacity optimization',
    assignments: skillsAssignments,
    totalScore: skillsAssignments.reduce((sum, a) => sum + a.confidence, 0) / skillsAssignments.length,
    risks: ['Potential capacity overloads', 'Uneven workload distribution'],
    benefits: ['Perfect skills utilization', 'Higher quality outcomes', 'Faster processing times']
  });

  return scenarios;
};

// =============================================================================
// RECOMMENDATION CARD COMPONENT
// =============================================================================

interface RecommendationCardProps {
  recommendation: AssignmentRecommendation;
  payroll: PayrollToAssign;
  onAssign: (consultantId: string, startDate: string) => void;
  onViewDetails: (consultantId: string) => void;
}

export function RecommendationCard({ 
  recommendation, 
  payroll, 
  onAssign, 
  onViewDetails 
}: RecommendationCardProps) {
  const { consultant, score, confidence, reasoning, warnings, alternativeTimeline } = recommendation;
  
  const confidenceColor = confidence === 'high' ? 'text-green-600' :
    confidence === 'medium' ? 'text-yellow-600' : 'text-red-600';

  const confidenceBg = confidence === 'high' ? 'bg-green-100' :
    confidence === 'medium' ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <Card className={`transition-all duration-200 ${confidence === 'high' ? 'ring-2 ring-green-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`/avatars/${consultant.id}.jpg`} />
              <AvatarFallback>
                {consultant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-sm">{consultant.name}</h4>
              <div className="flex items-center space-x-2">
                <Badge className={`${getPositionColor(consultant.position)} text-xs`}>
                  {getPositionDisplayName(consultant.position)}
                </Badge>
                <Badge className={`${confidenceBg} ${confidenceColor} text-xs`}>
                  {confidence} confidence
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {score.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Match Score</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Capacity Overview */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Capacity Analysis</span>
            <span className="text-sm">
              {consultant.capacity.availableCapacityHours.toFixed(1)}h / {payroll.processingTime}h
            </span>
          </div>
          <Progress 
            value={Math.min(100, (consultant.capacity.availableCapacityHours / payroll.processingTime) * 100)} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Available</span>
            <span>Required</span>
          </div>
        </div>

        {/* Reasoning */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Why this consultant?</Label>
          <div className="space-y-1">
            {reasoning.map((reason, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm">
                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-green-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-orange-600">Considerations</Label>
            <div className="space-y-1">
              {warnings.map((warning, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-orange-700">{warning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternative Timeline */}
        {alternativeTimeline && (
          <Alert className="py-2">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <span className="font-medium">Suggestion:</span> Start on{' '}
              {format(parseISO(alternativeTimeline.suggestedStartDate), 'MMM d')} - {alternativeTimeline.reason}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            onClick={() => onAssign(consultant.id, format(new Date(), 'yyyy-MM-dd'))}
            className="flex-1"
            disabled={confidence === 'low' && warnings.length > 2}
          >
            <Target className="w-3 h-3 mr-1" />
            Assign Now
          </Button>
          {alternativeTimeline && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAssign(consultant.id, alternativeTimeline.suggestedStartDate)}
              className="flex-1"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Use Timeline
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(consultant.id)}
          >
            <Users className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// SCENARIO COMPARISON COMPONENT
// =============================================================================

interface ScenarioComparisonProps {
  scenarios: AssignmentScenario[];
  payrolls: PayrollToAssign[];
  consultants: AvailableConsultant[];
  onSelectScenario: (scenarioId: string) => void;
}

export function ScenarioComparison({ 
  scenarios, 
  payrolls, 
  consultants, 
  onSelectScenario 
}: ScenarioComparisonProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            className={`cursor-pointer transition-all duration-200 ${
              selectedScenario === scenario.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedScenario(scenario.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{scenario.name}</CardTitle>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {scenario.totalScore.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Score</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{scenario.description}</p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-green-600">Benefits</Label>
                <ul className="text-xs text-green-700 mt-1 space-y-1">
                  {scenario.benefits.slice(0, 2).map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-1">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Label className="text-xs font-medium text-orange-600">Risks</Label>
                <ul className="text-xs text-orange-700 mt-1 space-y-1">
                  {scenario.risks.slice(0, 2).map((risk, index) => (
                    <li key={index} className="flex items-start space-x-1">
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                size="sm"
                variant={selectedScenario === scenario.id ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectScenario(scenario.id);
                }}
                className="w-full"
              >
                <Star className="w-3 h-3 mr-1" />
                Apply Scenario
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedScenario && (
        <Card>
          <CardHeader>
            <CardTitle>Scenario Details: {scenarios.find(s => s.id === selectedScenario)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarios.find(s => s.id === selectedScenario)?.assignments.map((assignment) => {
                const payroll = payrolls.find(p => p.id === assignment.payrollId);
                const consultant = consultants.find(c => c.id === assignment.consultantId);
                
                return (
                  <div key={assignment.payrollId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-sm">{payroll?.name}</p>
                        <p className="text-xs text-muted-foreground">{payroll?.clientName}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{consultant?.name}</p>
                        <Badge className={`${getPositionColor(consultant?.position as UserPosition)} text-xs`}>
                          {getPositionDisplayName(consultant?.position as UserPosition)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{assignment.confidence.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Confidence</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// =============================================================================
// MAIN ASSIGNMENT WIZARD COMPONENT
// =============================================================================

export function AssignmentWizard({ 
  payrolls = [], 
  consultants = [], 
  onAssignPayroll, 
  onBulkAssign,
  isLoading = false,
  error = null,
  onRefresh
}: AssignmentWizardProps) {
  const [activeTab, setActiveTab] = useState('individual');
  const [selectedPayroll, setSelectedPayroll] = useState<string | null>(null);
  const [filterPosition, setFilterPosition] = useState<UserPosition | 'all'>('all');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'partial'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Show loading state
  if (isLoading) {
    return <AssignmentWizardSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <WifiOff className="w-16 h-16 mx-auto text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Unable to Load Assignment Data</h3>
              <p className="text-gray-600 mt-1">{error}</p>
            </div>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show empty state
  if ((!payrolls || payrolls.length === 0) && (!consultants || consultants.length === 0)) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Wand2 className="w-16 h-16 mx-auto text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No Assignment Data Available</h3>
              <p className="text-gray-600 mt-1">
                No payrolls or consultants found. Check your data connections and try refreshing.
              </p>
            </div>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter consultants based on current filters
  const filteredConsultants = useMemo(() => {
    return consultants.filter(consultant => {
      if (filterPosition !== 'all' && consultant.position !== filterPosition) return false;
      
      if (filterAvailability === 'available' && consultant.capacity.utilizationPercentage >= 90) return false;
      if (filterAvailability === 'partial' && consultant.capacity.utilizationPercentage < 70) return false;
      
      if (searchTerm && !consultant.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    });
  }, [consultants, filterPosition, filterAvailability, searchTerm]);

  // Generate recommendations for selected payroll
  const recommendations = useMemo(() => {
    if (!selectedPayroll) return [];
    const payroll = payrolls.find(p => p.id === selectedPayroll);
    if (!payroll) return [];
    return generateRecommendations(payroll, filteredConsultants);
  }, [selectedPayroll, payrolls, filteredConsultants]);

  // Generate assignment scenarios
  const scenarios = useMemo(() => {
    return generateAssignmentScenarios(payrolls, consultants);
  }, [payrolls, consultants]);

  const handleAssignPayroll = (consultantId: string, startDate: string) => {
    if (!selectedPayroll || !onAssignPayroll) return;
    onAssignPayroll(selectedPayroll, consultantId, startDate);
  };

  const handleApplyScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario || !onBulkAssign) return;
    
    onBulkAssign(scenario.assignments.map(assignment => ({
      payrollId: assignment.payrollId,
      consultantId: assignment.consultantId,
      startDate: assignment.startDate
    })));
  };

  const handleViewConsultantDetails = (consultantId: string) => {
    // Implementation would show consultant details modal
    console.log('View consultant details:', consultantId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Wand2 className="w-6 h-6 text-purple-600" />
            <span>Intelligent Assignment Wizard</span>
          </h2>
          <p className="text-muted-foreground">
            AI-powered payroll assignment recommendations with capacity optimization
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Zap className="w-4 h-4 mr-1" />
          {payrolls.length} payrolls • {consultants.length} consultants
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="individual">Individual Assignment</TabsTrigger>
          <TabsTrigger value="scenarios">Bulk Scenarios</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Payroll Selection */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Select Payroll</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {payrolls.map((payroll) => (
                  <Card 
                    key={payroll.id}
                    className={`cursor-pointer p-3 transition-all duration-200 ${
                      selectedPayroll === payroll.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedPayroll(payroll.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{payroll.name}</h4>
                        <Badge className={getComplexityColor(payroll.complexity)}>
                          {payroll.complexity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{payroll.clientName}</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {payroll.processingTime}h required
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {payroll.processingDaysBeforeEft} days
                          </span>
                        </div>
                        {payroll.payrollDates && payroll.payrollDates.length > 0 && (
                          <div className="text-xs text-blue-600">
                            Next EFT: {new Date(payroll.payrollDates[0].adjustedEftDate || payroll.payrollDates[0].originalEftDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="lg:col-span-3">
              {selectedPayroll ? (
                <div className="space-y-4">
                  {/* Filters */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Search className="w-4 h-4" />
                          <Input
                            placeholder="Search consultants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-48"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Filter className="w-4 h-4" />
                          <select
                            value={filterPosition}
                            onChange={(e) => setFilterPosition(e.target.value as UserPosition | 'all')}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="all">All Positions</option>
                            <option value="consultant">Consultant</option>
                            <option value="senior_consultant">Senior Consultant</option>
                            <option value="manager">Manager</option>
                            <option value="senior_manager">Senior Manager</option>
                            <option value="partner">Partner</option>
                            <option value="senior_partner">Senior Partner</option>
                          </select>
                        </div>

                        <select
                          value={filterAvailability}
                          onChange={(e) => setFilterAvailability(e.target.value as 'all' | 'available' | 'partial')}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="all">All Availability</option>
                          <option value="available">Available (&lt;90%)</option>
                          <option value="partial">Partially Available (&gt;70%)</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.length > 0 ? (
                      recommendations.slice(0, 6).map((recommendation) => (
                        <RecommendationCard
                          key={recommendation.consultantId}
                          recommendation={recommendation}
                          payroll={payrolls.find(p => p.id === selectedPayroll)!}
                          onAssign={handleAssignPayroll}
                          onViewDetails={handleViewConsultantDetails}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No consultants match the current filters</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Select a Payroll</h3>
                    <p>Choose a payroll from the list to see AI-powered consultant recommendations</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <ScenarioComparison
            scenarios={scenarios}
            payrolls={payrolls}
            consultants={consultants}
            onSelectScenario={handleApplyScenario}
          />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Capacity Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {consultants.reduce((sum, c) => sum + c.capacity.totalPayrollCapacity, 0).toFixed(0)}h
                  </div>
                  <div className="text-sm text-muted-foreground">Total Team Capacity</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {payrolls.reduce((sum, p) => sum + p.processingTime, 0).toFixed(0)}h
                  </div>
                  <div className="text-sm text-muted-foreground">Total Workload</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.max(0, consultants.reduce((sum, c) => sum + c.capacity.totalPayrollCapacity, 0) - payrolls.reduce((sum, p) => sum + p.processingTime, 0)).toFixed(0)}h
                  </div>
                  <div className="text-sm text-muted-foreground">Available Buffer</div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <h4 className="font-medium">Optimization Recommendations</h4>
                <div className="space-y-2">
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      Consider the <strong>Conservative Assignment</strong> scenario to maintain healthy buffer capacity and reduce stress.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      Current team utilization allows for {Math.floor(consultants.reduce((sum, c) => sum + c.capacity.availableCapacityHours, 0) / 10)} additional standard payrolls.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}