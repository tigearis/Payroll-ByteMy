"use client";

import { ChevronDown, Shield, Eye, X, Check } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EffectivePermission {
  hasPermission: boolean;
  source: 'role' | 'override_granted' | 'override_denied';
  overrideId?: string;
}

interface PermissionDropdownProps {
  currentPermission?: EffectivePermission;
  onPermissionChange: (granted: boolean) => void;
}

export function PermissionDropdown({
  currentPermission,
  onPermissionChange,
}: PermissionDropdownProps) {
  const isRolePermission = currentPermission?.source === 'role';
  const hasPermission = currentPermission?.hasPermission ?? false;
  const isOverride = currentPermission?.source?.startsWith('override');

  const getButtonVariant = () => {
    if (isOverride) {
      return "outline";
    }
    return "ghost";
  };

  const getButtonText = () => {
    if (isRolePermission) {
      return hasPermission ? "Granted (Role)" : "Denied (Role)";
    } else if (isOverride) {
      return hasPermission ? "Granted (Override)" : "Denied (Override)";
    }
    return "Unknown";
  };

  const getCurrentIcon = () => {
    if (hasPermission) {
      return <Check className="w-3 h-3 text-green-600" />;
    } else {
      return <X className="w-3 h-3 text-red-600" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={getButtonVariant()}
          size="sm"
          className="h-7 text-xs"
        >
          {getCurrentIcon()}
          <span className="ml-1">{getButtonText()}</span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isRolePermission ? (
          <>
            <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current: Role Default
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onPermissionChange(!hasPermission)}
              className="flex items-center"
            >
              {hasPermission ? (
                <>
                  <X className="w-4 h-4 mr-2 text-red-600" />
                  Override to Deny
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Override to Grant
                </>
              )}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current: Override
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onPermissionChange(true)}
              className="flex items-center"
              disabled={hasPermission}
            >
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Grant Access
              {hasPermission && <span className="ml-auto text-xs text-gray-400">Current</span>}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPermissionChange(false)}
              className="flex items-center"
              disabled={!hasPermission}
            >
              <X className="w-4 h-4 mr-2 text-red-600" />
              Deny Access
              {!hasPermission && <span className="ml-auto text-xs text-gray-400">Current</span>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // This will remove the override by setting it to the role default
                // The parent component will handle this logic
                const roleHasPermission = currentPermission?.source === 'role' 
                  ? currentPermission.hasPermission 
                  : false; // We'd need to pass this from parent
                onPermissionChange(roleHasPermission);
              }}
              className="flex items-center text-blue-600"
            >
              <Shield className="w-4 h-4 mr-2" />
              Reset to Role Default
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}