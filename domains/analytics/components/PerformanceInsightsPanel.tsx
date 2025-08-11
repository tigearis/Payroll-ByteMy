// domains/analytics/components/PerformanceInsightsPanel.tsx
'use client';

import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertCircle,
  Lightbulb,
  Clock,
  Target,
  ChevronRight,
  ChevronDown,
  Filter,
  ExternalLink
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceInsight } from '../services/performance-analytics-service';

// ====================================================================
// PERFORMANCE INSIGHTS PANEL
// Specialized component for displaying performance insights and alerts
// Supports filtering, grouping, and detailed insight management
// ====================================================================

interface PerformanceInsightsPanelProps {
  insights?: PerformanceInsight[];
  title?: string;
  maxInsights?: number;
  showFilters?: boolean;
  showActions?: boolean;
  compactMode?: boolean;
  onInsightClick?: (insight: PerformanceInsight) => void;
  onActionRequired?: (insight: PerformanceInsight) => void;
  className?: string;
}

interface InsightFilters {
  severity: 'all' | 'critical' | 'warning' | 'info';
  type: 'all' | 'optimization_opportunity' | 'performance_regression' | 'capacity_warning' | 'business_impact';
  timeframe: 'all' | '1h' | '24h' | '7d' | '30d';
}

export const PerformanceInsightsPanel: React.FC<PerformanceInsightsPanelProps> = ({
  insights = [],
  title = "Performance Insights",
  maxInsights = 10,
  showFilters = true,
  showActions = true,
  compactMode = false,
  onInsightClick,
  onActionRequired,
  className = ""
}) => {
  const [filters, setFilters] = useState<InsightFilters>({
    severity: 'all',
    type: 'all',
    timeframe: '24h'
  });

  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());
  const [showAllInsights, setShowAllInsights] = useState(false);

  // Filter and sort insights
  const filteredInsights = useMemo(() => {
    const filtered = insights.filter(insight => {
      // Filter by severity
      if (filters.severity !== 'all' && insight.severity !== filters.severity) {
        return false;
      }

      // Filter by type
      if (filters.type !== 'all' && insight.type !== filters.type) {
        return false;
      }

      // Filter by timeframe
      if (filters.timeframe !== 'all') {
        const now = new Date();
        const timeframeMins = {
          '1h': 60,
          '24h': 24 * 60,
          '7d': 7 * 24 * 60,
          '30d': 30 * 24 * 60
        }[filters.timeframe] || 24 * 60;

        const cutoffTime = new Date(now.getTime() - timeframeMins * 60 * 1000);
        if (insight.createdAt < cutoffTime) {
          return false;
        }
      }

      return true;
    });

    // Sort by severity (critical first), then by creation time
    const severityOrder = { critical: 3, warning: 2, info: 1 };
    filtered.sort((a, b) => {
      const aSeverity = severityOrder[a.severity] || 0;
      const bSeverity = severityOrder[b.severity] || 0;

      if (aSeverity !== bSeverity) {
        return bSeverity - aSeverity;
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return filtered;
  }, [insights, filters]);

  // Get displayed insights based on maxInsights and showAll state
  const displayedInsights = useMemo(() => {
    return showAllInsights ? filteredInsights : filteredInsights.slice(0, maxInsights);
  }, [filteredInsights, maxInsights, showAllInsights]);

  // Calculate insight statistics
  const insightStats = useMemo(() => {
    const stats = filteredInsights.reduce((acc, insight) => {
      acc[insight.severity]++;
      acc.total++;
      return acc;
    }, { critical: 0, warning: 0, info: 0, total: 0 });

    return stats;
  }, [filteredInsights]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Lightbulb className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization_opportunity': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'performance_regression': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'capacity_warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'business_impact': return <Target className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const toggleInsightExpansion = (insightId: string) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(insightId)) {
      newExpanded.delete(insightId);
    } else {
      newExpanded.add(insightId);
    }
    setExpandedInsights(newExpanded);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getInsightPriorityScore = (insight: PerformanceInsight): number => {
    let score = 0;
    
    // Severity weight
    const severityWeight = { critical: 100, warning: 50, info: 10 };
    score += severityWeight[insight.severity] || 0;
    
    // Type weight
    const typeWeight = { 
      performance_regression: 30, 
      capacity_warning: 25, 
      business_impact: 20, 
      optimization_opportunity: 15 
    };
    score += typeWeight[insight.type] || 0;
    
    // Freshness weight (newer insights get higher priority)
    const ageHours = (new Date().getTime() - insight.createdAt.getTime()) / (1000 * 60 * 60);
    score += Math.max(0, 20 - ageHours);
    
    return score;
  };

  if (!insights || insights.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-700">All Systems Optimal</p>
            <p className="text-sm text-muted-foreground">No performance insights or alerts at this time</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>{title}</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              {insightStats.critical > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {insightStats.critical} Critical
                </Badge>
              )}
              {insightStats.warning > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  {insightStats.warning} Warning
                </Badge>
              )}
              {insightStats.info > 0 && (
                <Badge variant="outline" className="text-xs">
                  {insightStats.info} Info
                </Badge>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value as any }))}
                className="text-xs px-2 py-1 border border-gray-200 rounded"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {displayedInsights.map((insight) => {
            const isExpanded = expandedInsights.has(insight.id);
            const priorityScore = getInsightPriorityScore(insight);

            return (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border-l-4 border transition-all duration-200 hover:shadow-sm ${
                  insight.severity === 'critical' ? 'border-l-red-500 bg-red-50/50' :
                  insight.severity === 'warning' ? 'border-l-yellow-500 bg-yellow-50/50' :
                  'border-l-blue-500 bg-blue-50/50'
                }`}
              >
                {/* Insight Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex items-center space-x-2 mt-0.5">
                      {getSeverityIcon(insight.severity)}
                      {getTypeIcon(insight.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {insight.title}
                        </h4>
                        <Badge 
                          className={`text-xs ${getSeverityColor(insight.severity)}`}
                          variant="outline"
                        >
                          {insight.severity.toUpperCase()}
                        </Badge>
                        {priorityScore > 120 && (
                          <Badge variant="destructive" className="text-xs">
                            HIGH PRIORITY
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {insight.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(insight.createdAt)}</span>
                        </span>
                        
                        <span>
                          {insight.affectedSystems.length} system{insight.affectedSystems.length !== 1 ? 's' : ''}
                        </span>
                        
                        {insight.estimatedImpact?.costSaving && (
                          <span className="text-red-600 font-medium">
                            ${insight.estimatedImpact.costSaving}/day impact
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {showActions && onActionRequired && insight.severity === 'critical' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onActionRequired(insight)}
                        className="text-xs"
                      >
                        Action Required
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleInsightExpansion(insight.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Affected Systems (Always Visible) */}
                {!compactMode && insight.affectedSystems.length > 0 && (
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-xs font-medium text-muted-foreground">Systems:</span>
                    <div className="flex flex-wrap gap-1">
                      {insight.affectedSystems.slice(0, 3).map(systemId => (
                        <Badge key={systemId} variant="outline" className="text-xs">
                          {systemId.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                      {insight.affectedSystems.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{insight.affectedSystems.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-gray-200">
                    {/* Recommendations */}
                    {insight.recommendations.length > 0 && (
                      <div>
                        <h5 className="text-xs font-semibold text-gray-900 mb-2">Recommendations</h5>
                        <ul className="space-y-1">
                          {insight.recommendations.slice(0, 5).map((rec, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-start">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                          {insight.recommendations.length > 5 && (
                            <li className="text-xs text-muted-foreground italic">
                              +{insight.recommendations.length - 5} more recommendations
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Estimated Impact */}
                    {insight.estimatedImpact && (
                      <div>
                        <h5 className="text-xs font-semibold text-gray-900 mb-2">Estimated Impact</h5>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {insight.estimatedImpact.performanceGain && (
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span>Performance: {insight.estimatedImpact.performanceGain}</span>
                            </div>
                          )}
                          {insight.estimatedImpact.costSaving && (
                            <div className="flex items-center space-x-2">
                              <Target className="w-3 h-3 text-red-500" />
                              <span>Cost Impact: ${insight.estimatedImpact.costSaving}/day</span>
                            </div>
                          )}
                          {insight.estimatedImpact.userExperienceImprovement && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-blue-500" />
                              <span>UX: {insight.estimatedImpact.userExperienceImprovement}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {showActions && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="text-xs text-muted-foreground">
                          {insight.expiresAt ? (
                            <span>Expires: {insight.expiresAt.toLocaleString()}</span>
                          ) : (
                            <span>Created: {insight.createdAt.toLocaleString()}</span>
                          )}
                        </div>
                        
                        {onInsightClick && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onInsightClick(insight)}
                            className="text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Show More/Less Button */}
          {filteredInsights.length > maxInsights && (
            <div className="text-center pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllInsights(!showAllInsights)}
                className="text-xs"
              >
                {showAllInsights ? (
                  <>Show Less</>
                ) : (
                  <>Show {filteredInsights.length - maxInsights} More Insights</>
                )}
              </Button>
            </div>
          )}

          {/* Empty State for Filtered Results */}
          {displayedInsights.length === 0 && filteredInsights.length === 0 && (
            <div className="text-center py-6">
              <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No insights match current filters</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ severity: 'all', type: 'all', timeframe: 'all' })}
                className="text-xs mt-2"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceInsightsPanel;