"use client";

import { useQuery, useMutation } from "@apollo/client";
import { Settings, ToggleLeft, ToggleRight, Search, RefreshCw, Users, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ByteMySpinner } from "@/components/ui/bytemy-loading-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  GET_FEATURE_FLAGS, 
  UPDATE_FEATURE_FLAG, 
  CREATE_FEATURE_FLAG 
} from "@/lib/feature-flags/queries";
import { 
  DEFAULT_FEATURE_FLAGS, 
  FEATURE_FLAG_NAMES, 
  type FeatureFlagKey,
  type FeatureFlag 
} from "@/lib/feature-flags/types";
import { getRoleDisplayName } from "@/lib/utils/role-utils";

interface FeatureFlagWithMetadata extends FeatureFlag {
  category: string;
  description: string;
  recommendedRoles: string[];
}

const FEATURE_FLAG_METADATA: Record<string, { category: string; description: string; recommendedRoles: string[] }> = {
  // AI Assistant Features
  'ai_assistant': { 
    category: 'AI Features', 
    description: 'Enable AI assistant functionality across the application',
    recommendedRoles: ['developer', 'org_admin']
  },
  'aidata_assistant': { 
    category: 'AI Features', 
    description: 'Enable natural language database queries and AI data analysis',
    recommendedRoles: ['developer', 'org_admin']
  },
  'ai_float': { 
    category: 'AI Features', 
    description: 'Show floating AI assistant button for quick access',
    recommendedRoles: ['developer', 'org_admin', 'manager']
  },
  'ai_debug': { 
    category: 'AI Features', 
    description: 'Enable AI debugging tools and detailed logging',
    recommendedRoles: ['developer']
  },
  'ollama_integration': { 
    category: 'AI Features', 
    description: 'Enable local Ollama LLM integration for development',
    recommendedRoles: ['developer']
  },

  // Security Features
  'mfa_enabled': { 
    category: 'Security', 
    description: 'Require multi-factor authentication for all users',
    recommendedRoles: ['developer', 'org_admin', 'manager']
  },
  'step_up_auth': { 
    category: 'Security', 
    description: 'Require additional authentication for sensitive operations',
    recommendedRoles: ['developer', 'org_admin', 'manager']
  },
  'enhanced_permissions': { 
    category: 'Security', 
    description: 'Enable advanced role-based permission system',
    recommendedRoles: ['developer', 'org_admin', 'manager']
  },
  'permission_debug': { 
    category: 'Security', 
    description: 'Show permission debugging information in UI',
    recommendedRoles: ['developer']
  },
  'audit_logging': { 
    category: 'Security', 
    description: 'Enable comprehensive audit logging for compliance',
    recommendedRoles: ['developer', 'org_admin', 'manager']
  },
  'session_monitoring': { 
    category: 'Security', 
    description: 'Monitor user sessions for security threats',
    recommendedRoles: ['developer', 'org_admin', 'manager']
  },
  'security_reporting': { 
    category: 'Security', 
    description: 'Enable security reporting and analytics dashboard',
    recommendedRoles: ['developer', 'org_admin', 'manager']
  },

  // Developer Tools
  'dev_tools': { 
    category: 'Developer Tools', 
    description: 'Enable developer tools page and debugging utilities',
    recommendedRoles: ['developer']
  },
  'debug_panels': { 
    category: 'Developer Tools', 
    description: 'Show debug panels and development information',
    recommendedRoles: ['developer']
  },
  'auth_debug': { 
    category: 'Developer Tools', 
    description: 'Enable authentication debugging and logging',
    recommendedRoles: ['developer']
  },

  // Financial & Billing
  'billing_access': { 
    category: 'Financial', 
    description: 'Enable access to billing and financial features',
    recommendedRoles: ['developer', 'org_admin', 'manager', 'consultant']
  },
  'financial_reporting': { 
    category: 'Financial', 
    description: 'Enable financial reporting and analytics',
    recommendedRoles: ['developer', 'org_admin', 'manager']
  },

  // Tax Calculator
  'tax_calculator': { 
    category: 'Tax Tools', 
    description: 'Enable tax calculation tools and utilities',
    recommendedRoles: ['developer', 'org_admin', 'manager', 'consultant', 'viewer']
  },
  'tax_calculator_prod': { 
    category: 'Tax Tools', 
    description: 'Enable production-ready tax calculator features',
    recommendedRoles: ['developer', 'org_admin', 'manager', 'consultant']
  },

  // Advanced Features
  'bulk_operations': { 
    category: 'Advanced Features', 
    description: 'Enable bulk operations for data management',
    recommendedRoles: ['developer', 'org_admin', 'manager']
  },
  'data_export': { 
    category: 'Advanced Features', 
    description: 'Enable data export functionality',
    recommendedRoles: ['developer', 'org_admin', 'manager', 'consultant']
  },
  'user_management': { 
    category: 'Advanced Features', 
    description: 'Enable user management and administration tools',
    recommendedRoles: ['developer', 'org_admin', 'manager']
  },
};

const AVAILABLE_ROLES = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];

export function FeatureFlagManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState<Set<string>>(new Set());

  const { data, loading, error, refetch } = useQuery(GET_FEATURE_FLAGS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  const [updateFeatureFlag] = useMutation(UPDATE_FEATURE_FLAG);
  const [createFeatureFlag] = useMutation(CREATE_FEATURE_FLAG);

  const featureFlags = useMemo(() => {
    const dbFlags = (data?.featureFlags || []) as FeatureFlag[];
    const allFlags: FeatureFlagWithMetadata[] = [];

    // Create a map of existing flags from database
    const dbFlagMap = new Map(dbFlags.map(flag => [flag.featureName, flag]));

    // Process all flags defined in types.ts
    Object.entries(FEATURE_FLAG_NAMES).forEach(([key, flagName]) => {
      const dbFlag = dbFlagMap.get(flagName);
      const metadata = FEATURE_FLAG_METADATA[flagName] || {
        category: 'Other',
        description: `Feature flag: ${flagName}`,
        recommendedRoles: ['developer']
      };

      allFlags.push({
        id: dbFlag?.id || '',
        featureName: flagName,
        isEnabled: dbFlag?.isEnabled ?? DEFAULT_FEATURE_FLAGS[key as FeatureFlagKey],
        allowedRoles: dbFlag?.allowedRoles || metadata.recommendedRoles,
        updatedAt: dbFlag?.updatedAt || new Date().toISOString(),
        ...metadata
      });
    });

    return allFlags;
  }, [data]);

  const filteredFlags = useMemo(() => {
    return featureFlags.filter(flag => {
      const matchesSearch = flag.featureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           flag.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || flag.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [featureFlags, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(featureFlags.map(flag => flag.category))];
    return cats;
  }, [featureFlags]);

  const handleToggleFlag = async (flag: FeatureFlagWithMetadata) => {
    setIsUpdating(prev => new Set(prev).add(flag.featureName));

    try {
      if (flag.id) {
        // Update existing flag
        await updateFeatureFlag({
          variables: {
            id: flag.id,
            isEnabled: !flag.isEnabled,
            allowedRoles: flag.allowedRoles
          }
        });
      } else {
        // Create new flag
        await createFeatureFlag({
          variables: {
            featureName: flag.featureName,
            isEnabled: !flag.isEnabled,
            allowedRoles: flag.allowedRoles
          }
        });
      }
      
      await refetch();
    } catch (error) {
      console.error('Failed to update feature flag:', error);
    } finally {
      setIsUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(flag.featureName);
        return newSet;
      });
    }
  };

  const handleRoleChange = async (flag: FeatureFlagWithMetadata, newRoles: string[]) => {
    setIsUpdating(prev => new Set(prev).add(flag.featureName));

    try {
      if (flag.id) {
        await updateFeatureFlag({
          variables: {
            id: flag.id,
            isEnabled: flag.isEnabled,
            allowedRoles: newRoles
          }
        });
      } else {
        await createFeatureFlag({
          variables: {
            featureName: flag.featureName,
            isEnabled: flag.isEnabled,
            allowedRoles: newRoles
          }
        });
      }
      
      await refetch();
    } catch (error) {
      console.error('Failed to update feature flag roles:', error);
    } finally {
      setIsUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(flag.featureName);
        return newSet;
      });
    }
  };

  const getStatusColor = (isEnabled: boolean) => {
    return isEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'AI Features': 'bg-purple-100 text-purple-800',
      'Security': 'bg-red-100 text-red-800',
      'Developer Tools': 'bg-blue-100 text-blue-800',
      'Financial': 'bg-green-100 text-green-800',
      'Tax Tools': 'bg-orange-100 text-orange-800',
      'Advanced Features': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors['Other'];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-lg">Feature Flag Management</CardTitle>
              <CardDescription>Loading feature flags...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <ByteMySpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-lg">Feature Flag Management</CardTitle>
              <CardDescription>Manage application feature flags and permissions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load feature flags: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle className="text-lg">Feature Flag Management</CardTitle>
            <CardDescription>
              Control application features and their permissions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search feature flags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => refetch()} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-2xl font-bold">{featureFlags.length}</div>
            <div className="text-sm text-muted-foreground">Total Flags</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {featureFlags.filter(f => f.isEnabled).length}
            </div>
            <div className="text-sm text-green-600">Enabled</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">
              {featureFlags.filter(f => !f.isEnabled).length}
            </div>
            <div className="text-sm text-gray-600">Disabled</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {categories.length - 1}
            </div>
            <div className="text-sm text-blue-600">Categories</div>
          </div>
        </div>

        {/* Feature Flags List */}
        <div className="space-y-4">
          {filteredFlags.map((flag) => (
            <div key={flag.featureName} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{flag.featureName}</h3>
                    <Badge className={getCategoryColor(flag.category)}>
                      {flag.category}
                    </Badge>
                    <Badge className={getStatusColor(flag.isEnabled)}>
                      {flag.isEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {flag.description}
                  </p>
                  
                  {/* Role Management */}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Allowed Roles:</span>
                    <div className="flex gap-1">
                      {flag.allowedRoles.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {getRoleDisplayName(role)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Toggle Switch */}
                <div className="flex items-center gap-2">
                  {isUpdating.has(flag.featureName) ? (
                    <ByteMySpinner size="sm" />
                  ) : (
                    <Switch
                      checked={flag.isEnabled}
                      onCheckedChange={() => handleToggleFlag(flag)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFlags.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2" />
            <p>No feature flags match your search criteria.</p>
          </div>
        )}

        {/* Help Text */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1 text-sm">
              <div className="font-medium">Feature Flag Management Guide:</div>
              <div>• Toggle switches enable/disable features instantly</div>
              <div>• Role assignments control which users can access features</div>
              <div>• Changes take effect immediately across the application</div>
              <div>• Security-critical flags should be managed carefully</div>
              <div>• Use search and filters to quickly find specific flags</div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}