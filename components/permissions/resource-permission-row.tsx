"use client";

import { ChevronDown, ChevronRight, Shield, Eye, Edit, Trash2, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PermissionDropdown } from "./permission-dropdown";

interface Resource {
  id: string;
  name: string;
  displayName?: string | null;
  description?: string | null;
  permissions?: Array<{
    id: string;
    action: string;
    description?: string | null;
  }> | null;
}

interface EffectivePermission {
  hasPermission: boolean;
  source: 'role' | 'override_granted' | 'override_denied';
  overrideId?: string;
}

interface PendingChange {
  resource: string;
  operation: string;
  granted: boolean;
  reason: string;
  isNew?: boolean;
  originalOverrideId?: string;
}

interface ResourcePermissionRowProps {
  resource: Resource;
  effectivePermissions: Record<string, EffectivePermission>;
  pendingChanges: PendingChange[];
  onPermissionChange: (
    resource: string,
    operation: string,
    granted: boolean,
    currentSource: string,
    overrideId?: string
  ) => void;
  onRemovePendingChange: (resource: string, operation: string) => void;
}

const ACTION_ICONS = {
  read: Eye,
  create: Plus,
  update: Edit,
  delete: Trash2,
  approve: Shield,
  export: Shield,
  manage: Shield,
};

const ACTION_COLORS = {
  read: "text-blue-600",
  create: "text-green-600", 
  update: "text-orange-600",
  delete: "text-red-600",
  approve: "text-purple-600",
  export: "text-indigo-600",
  manage: "text-gray-600",
};

export function ResourcePermissionRow({
  resource,
  effectivePermissions,
  pendingChanges,
  onPermissionChange,
  onRemovePendingChange,
}: ResourcePermissionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const permissions = resource.permissions || [];
  
  // Calculate resource-level access summary
  const permissionSummary = React.useMemo(() => {
    const granted = permissions.filter(p => {
      const pending = pendingChanges.find(pc => pc.operation === p.action);
      if (pending) return pending.granted;
      return effectivePermissions[p.action]?.hasPermission;
    }).length;
    
    const total = permissions.length;
    const hasOverrides = permissions.some(p => 
      effectivePermissions[p.action]?.source?.startsWith('override') ||
      pendingChanges.some(pc => pc.operation === p.action)
    );

    return { granted, total, hasOverrides };
  }, [permissions, effectivePermissions, pendingChanges]);

  // Get resource-level badge
  const getResourceBadge = () => {
    if (permissionSummary.granted === 0) {
      return <Badge variant="destructive" className="text-xs">No Access</Badge>;
    } else if (permissionSummary.granted === permissionSummary.total) {
      return <Badge className="text-xs bg-green-100 text-green-800">Full Access</Badge>;
    } else {
      return <Badge variant="secondary" className="text-xs">Partial Access ({permissionSummary.granted}/{permissionSummary.total})</Badge>;
    }
  };

  return (
    <Card className="relative">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {resource.displayName || resource.name}
                  </h3>
                  {resource.description && (
                    <p className="text-sm text-gray-500">{resource.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {permissionSummary.hasOverrides && (
                  <Badge variant="outline" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Custom
                  </Badge>
                )}
                {getResourceBadge()}
                {pendingChanges.length > 0 && (
                  <Badge className="text-xs bg-orange-100 text-orange-800">
                    {pendingChanges.length} Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="space-y-3">
              {permissions.map((permission) => {
                const effectivePermission = effectivePermissions[permission.action];
                const pendingChange = pendingChanges.find(pc => pc.operation === permission.action);
                const IconComponent = ACTION_ICONS[permission.action as keyof typeof ACTION_ICONS] || Shield;
                const iconColor = ACTION_COLORS[permission.action as keyof typeof ACTION_COLORS] || "text-gray-600";

                return (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-4 h-4 ${iconColor}`} />
                      <div>
                        <div className="font-medium text-sm">
                          {permission.action}
                        </div>
                        {permission.description && (
                          <div className="text-xs text-gray-500">
                            {permission.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Current Status */}
                      <div className="flex items-center space-x-2">
                        {effectivePermission ? (
                          <>
                            <div className={`w-3 h-3 rounded-full ${
                              pendingChange 
                                ? pendingChange.granted ? 'bg-green-500' : 'bg-red-500'
                                : effectivePermission.hasPermission ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span className="text-xs text-gray-600">
                              {pendingChange ? (
                                <span className="text-orange-600 font-medium">
                                  {pendingChange.granted ? 'Granted' : 'Denied'} (Pending)
                                </span>
                              ) : (
                                <>
                                  {effectivePermission.hasPermission ? 'Granted' : 'Denied'}
                                  <span className="ml-1 text-gray-400">
                                    ({effectivePermission.source === 'role' ? 'Role' : 'Override'})
                                  </span>
                                </>
                              )}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            <span className="text-xs text-gray-400">Unknown</span>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1">
                        {pendingChange ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemovePendingChange(resource.name, permission.action)}
                            className="h-7 w-7 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        ) : (
                          <PermissionDropdown
                            currentPermission={effectivePermission}
                            onPermissionChange={(granted) => 
                              onPermissionChange(
                                resource.name,
                                permission.action,
                                granted,
                                effectivePermission?.source || 'role',
                                effectivePermission?.overrideId
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}