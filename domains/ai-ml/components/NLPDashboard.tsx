/**
 * Natural Language Processing Dashboard
 * 
 * Comprehensive React dashboard for AI-powered natural language processing capabilities
 * including conversational business intelligence, intelligent report generation, 
 * AI insights management, and natural language query interface.
 * 
 * Features:
 * - Conversational Business Intelligence Interface
 * - AI-Generated Insights Display and Management
 * - Intelligent Report Generation and Viewing
 * - Natural Language Query Processing
 * - Real-time Insight Generation and Updates
 * - Executive-Grade AI Analytics Reporting
 * - Multi-domain Business Intelligence Support
 * - Interactive Insight Exploration and Correlation
 * 
 * Integration: Comprehensive React TypeScript dashboard with advanced NLP capabilities
 */

import { 
  MessageSquare, 
  Brain, 
  FileText, 
  Search, 
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  Shield,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  Share,
  Settings,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Import UI components (assuming they exist in your project)
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// Import NLP hook
import { useNaturalLanguageProcessing } from '../hooks/use-natural-language-processing';

// Import types
import type { 
  NLPInsight, 
  NLPReport, 
  NLPQuery, 
  BusinessContext 
} from '../services/natural-language-processing-engine';

// ================================================================================
// COMPONENT INTERFACES
// ================================================================================

interface NLPDashboardProps {
  initialContext?: BusinessContext;
  className?: string;
}

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  confidence?: number;
  relatedInsights?: string[];
}

interface InsightFilterOptions {
  type?: NLPInsight['type'];
  businessImpact?: NLPInsight['businessImpact'];
  domain?: BusinessContext['domain'];
  timeframe?: string;
}

// ================================================================================
// MAIN DASHBOARD COMPONENT
// ================================================================================

const NLPDashboard: React.FC<NLPDashboardProps> = ({
  initialContext,
  className = ""
}) => {
  const {
    insights,
    reports,
    conversationHistory,
    isGeneratingInsights,
    isGeneratingReport,
    isProcessingQuery,
    error,
    generateInsights,
    generateReport,
    processQuery,
    startConversation,
    continueConversation,
    refreshData
  } = useNaturalLanguageProcessing();

  // ================================================================================
  // STATE MANAGEMENT
  // ================================================================================

  const [activeTab, setActiveTab] = useState<string>('conversation');
  const [selectedInsight, setSelectedInsight] = useState<NLPInsight | null>(null);
  const [selectedReport, setSelectedReport] = useState<NLPReport | null>(null);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [insightFilters, setInsightFilters] = useState<InsightFilterOptions>({});
  const [queryInput, setQueryInput] = useState<string>('');
  const [businessContext, setBusinessContext] = useState<BusinessContext>(
    initialContext || {
      domain: 'analytics',
      roles: ['manager'],
      timeContext: 'real-time',
      decisionContext: 'operational',
      urgency: 'standard'
    }
  );

  // ================================================================================
  // COMPUTED VALUES
  // ================================================================================

  const filteredInsights = useMemo(() => {
    if (!insights) return [];

    return insights.filter(insight => {
      if (insightFilters.type && insight.type !== insightFilters.type) return false;
      if (insightFilters.businessImpact && insight.businessImpact !== insightFilters.businessImpact) return false;
      return true;
    });
  }, [insights, insightFilters]);

  const insightsByType = useMemo(() => {
    if (!insights) return {};

    return insights.reduce((acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [insights]);

  const highPriorityInsights = useMemo(() => {
    if (!insights) return [];

    return insights
      .filter(insight => insight.businessImpact === 'high')
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);
  }, [insights]);

  const recentReports = useMemo(() => {
    if (!reports) return [];

    return [...reports]
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
      .slice(0, 3);
  }, [reports]);

  // ================================================================================
  // EVENT HANDLERS
  // ================================================================================

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setConversationMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    try {
      const response = await continueConversation(currentMessage);
      
      const aiMessage: ConversationMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response,
        timestamp: new Date(),
        confidence: 0.85
      };

      setConversationMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ConversationMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        confidence: 0.0
      };

      setConversationMessages(prev => [...prev, errorMessage]);
    }
  }, [currentMessage, continueConversation]);

  const handleProcessQuery = useCallback(async () => {
    if (!queryInput.trim()) return;

    const query: NLPQuery = {
      query: queryInput,
      context: { businessContext },
      preferredResponseStyle: 'executive',
      targetAudience: businessContext.roles
    };

    try {
      await processQuery(query);
      setQueryInput('');
    } catch (error) {
      console.error('Query processing failed:', error);
    }
  }, [queryInput, businessContext, processQuery]);

  const handleGenerateInsights = useCallback(async () => {
    try {
      await generateInsights({}, businessContext.domain, businessContext.roles);
    } catch (error) {
      console.error('Insight generation failed:', error);
    }
  }, [businessContext, generateInsights]);

  const handleGenerateReport = useCallback(async (reportType: NLPReport['reportType']) => {
    try {
      await generateReport({}, reportType, businessContext.roles);
    } catch (error) {
      console.error('Report generation failed:', error);
    }
  }, [businessContext, generateReport]);

  const handleStartConversation = useCallback(async () => {
    try {
      const greeting = await startConversation(businessContext);
      
      const greetingMessage: ConversationMessage = {
        id: `greeting-${Date.now()}`,
        type: 'ai',
        content: greeting,
        timestamp: new Date(),
        confidence: 1.0
      };

      setConversationMessages([greetingMessage]);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [businessContext, startConversation]);

  // ================================================================================
  // EFFECTS
  // ================================================================================

  useEffect(() => {
    // Start conversation when component mounts or business context changes
    handleStartConversation();
  }, [handleStartConversation]);

  // ================================================================================
  // RENDER METHODS
  // ================================================================================

  const renderConversationInterface = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col space-y-4">
        {/* Business Context Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Business Context</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={businessContext.domain}
                onValueChange={(value: BusinessContext['domain']) =>
                  setBusinessContext(prev => ({ ...prev, domain: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payroll">Payroll</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={businessContext.decisionContext}
                onValueChange={(value: BusinessContext['decisionContext']) =>
                  setBusinessContext(prev => ({ ...prev, decisionContext: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Decision context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="tactical">Tactical</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Conversation History */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>AI Business Conversation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.confidence !== undefined && (
                          <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessingQuery && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask me anything about your business data..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isProcessingQuery}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isProcessingQuery}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInsightsPanel = () => (
    <div className="space-y-6">
      {/* Insights Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <span>AI-Generated Insights</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateInsights}
                disabled={isGeneratingInsights}
              >
                {isGeneratingInsights ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Insights
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(insightsByType).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{type}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High Priority Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-medium flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>High Priority Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highPriorityInsights.map((insight) => (
              <div
                key={insight.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedInsight(insight)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getInsightIcon(insight.type)}
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge variant={getInsightBadgeVariant(insight.businessImpact)}>
                        {insight.businessImpact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {insight.narrative}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                        <span>Priority: {insight.priority}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {insight.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-md font-medium">All Insights</CardTitle>
            <div className="flex items-center space-x-2">
              <Select
                value={insightFilters.type || 'all'}
                onValueChange={(value) => 
                  setInsightFilters(prev => ({ 
                    ...prev, 
                    type: value === 'all' ? undefined : value as NLPInsight['type']
                  }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="trend">Trends</SelectItem>
                  <SelectItem value="anomaly">Anomalies</SelectItem>
                  <SelectItem value="opportunity">Opportunities</SelectItem>
                  <SelectItem value="risk">Risks</SelectItem>
                  <SelectItem value="recommendation">Recommendations</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={insightFilters.businessImpact || 'all'}
                onValueChange={(value) => 
                  setInsightFilters(prev => ({ 
                    ...prev, 
                    businessImpact: value === 'all' ? undefined : value as NLPInsight['businessImpact']
                  }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Impact</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="low">Low Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => setSelectedInsight(insight)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getInsightIcon(insight.type)}
                        <span className="font-medium text-sm">{insight.title}</span>
                        <Badge 
                          variant={getInsightBadgeVariant(insight.businessImpact)}
                          className="text-xs"
                        >
                          {insight.businessImpact}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {insight.narrative}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(insight.confidence * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportsPanel = () => (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>AI Report Generation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleGenerateReport('executive')}
              disabled={isGeneratingReport}
              className="flex items-center justify-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Executive Report</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleGenerateReport('operational')}
              disabled={isGeneratingReport}
              className="flex items-center justify-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Operational Report</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleGenerateReport('analytical')}
              disabled={isGeneratingReport}
              className="flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytical Report</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleGenerateReport('strategic')}
              disabled={isGeneratingReport}
              className="flex items-center justify-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>Strategic Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-medium flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Recent Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-2">{report.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {report.executiveSummary}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="capitalize">{report.reportType}</span>
                        <span>Confidence: {Math.round(report.confidenceScore * 100)}%</span>
                        <span>{report.keyInsights.length} insights</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {report.generatedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQueryInterface = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Natural Language Query</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Ask a complex business question in natural language..."
              rows={3}
              disabled={isProcessingQuery}
            />
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Example: "What are the top revenue opportunities in payroll services this quarter?"
              </div>
              <Button
                onClick={handleProcessQuery}
                disabled={!queryInput.trim() || isProcessingQuery}
              >
                {isProcessingQuery ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Query
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Query Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-medium">Example Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {[
              "What are the biggest risks to our payroll operations this month?",
              "Show me opportunities to improve billing efficiency",
              "Generate an executive summary of our performance trends",
              "What security threats should we be most concerned about?",
              "Compare our operational metrics to last quarter",
              "What strategic recommendations do you have for growth?"
            ].map((example, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setQueryInput(example)}
              >
                <p className="text-sm text-gray-700">{example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ================================================================================
  // UTILITY FUNCTIONS
  // ================================================================================

  const getInsightIcon = (type: NLPInsight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'anomaly':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'opportunity':
        return <Target className="w-4 h-4 text-green-600" />;
      case 'risk':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4 text-purple-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInsightBadgeVariant = (impact: NLPInsight['businessImpact']) => {
    switch (impact) {
      case 'high':
        return 'destructive' as const;
      case 'medium':
        return 'default' as const;
      case 'low':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  // ================================================================================
  // MAIN RENDER
  // ================================================================================

  return (
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <span>AI Natural Language Processing</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Conversational business intelligence with AI-powered insights and reporting
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conversation" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Conversation</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Insights</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="query" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Query</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversation" className="mt-6">
          {renderConversationInterface()}
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          {renderInsightsPanel()}
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          {renderReportsPanel()}
        </TabsContent>

        <TabsContent value="query" className="mt-6">
          {renderQueryInterface()}
        </TabsContent>
      </Tabs>

      {/* Insight Detail Modal/Panel */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {getInsightIcon(selectedInsight.type)}
                  <span>{selectedInsight.title}</span>
                  <Badge variant={getInsightBadgeVariant(selectedInsight.businessImpact)}>
                    {selectedInsight.businessImpact}
                  </Badge>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInsight(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">AI Generated Narrative</h4>
                <p className="text-gray-700">{selectedInsight.narrative}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Key Metrics</h4>
                  <div className="space-y-2">
                    {selectedInsight.keyMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{metric.name}</span>
                        <span className="font-medium">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>Confidence: {Math.round(selectedInsight.confidence * 100)}%</div>
                    <div>Priority: {selectedInsight.priority}</div>
                    <div>Type: {selectedInsight.type}</div>
                    <div>Generated: {selectedInsight.timestamp.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {selectedInsight.actionItems.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recommended Actions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {selectedInsight.actionItems.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedInsight.stakeholders.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Stakeholders</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInsight.stakeholders.map((stakeholder, index) => (
                      <Badge key={index} variant="outline">{stakeholder}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Detail Modal/Panel */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedReport.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Executive Summary</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.executiveSummary}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Full Report</h4>
                <div className="max-h-96 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.fullNarrative}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Key Insights ({selectedReport.keyInsights.length})</h4>
                <div className="space-y-3">
                  {selectedReport.keyInsights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        {getInsightIcon(insight.type)}
                        <span className="font-medium text-sm">{insight.title}</span>
                        <Badge variant={getInsightBadgeVariant(insight.businessImpact)}>
                          {insight.businessImpact}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{insight.narrative}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedReport.recommendations.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <div className="space-y-3">
                      {selectedReport.recommendations.map((rec) => (
                        <div key={rec.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{rec.title}</h5>
                            <Badge variant={rec.priority === 'high' ? 'destructive' : 'default'}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                            <div>Impact: {rec.impact}</div>
                            <div>Effort: {rec.effort}</div>
                            <div>Timeline: {rec.timeline}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NLPDashboard;