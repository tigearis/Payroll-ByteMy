"use client";

import { 
  User,
  UserCog,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Settings
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { POSITION_ADMIN_DEFAULTS, type UserPosition } from "../services/enhanced-capacity-calculator";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface UserWithPosition {
  id: string;
  firstName: string;
  lastName: string;
  computedName?: string;
  email: string;
  position: UserPosition;
  defaultAdminTimePercentage: number;
  role: string;
  managerId?: string;
  isStaff: boolean;
}

interface PositionManagementProps {
  user: UserWithPosition;
  canEdit?: boolean;
  onUpdatePosition?: (userId: string, position: UserPosition, adminPercentage: number) => void;
  onUpdateAdminTime?: (userId: string, adminPercentage: number) => void;
}

interface PositionSelectorProps {
  currentPosition: UserPosition;
  onPositionChange: (position: UserPosition) => void;
  disabled?: boolean;
}

interface AdminTimeConfigProps {
  currentPercentage: number;
  position: UserPosition;
  useDefault: boolean;
  onPercentageChange: (percentage: number) => void;
  onUseDefaultChange: (useDefault: boolean) => void;
  disabled?: boolean;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getPositionColor = (position: UserPosition): string => {
  switch (position) {
    case 'consultant':
      return 'bg-blue-100 text-blue-800';
    case 'senior_consultant':
      return 'bg-indigo-100 text-indigo-800';
    case 'manager':
      return 'bg-green-100 text-green-800';
    case 'senior_manager':
      return 'bg-emerald-100 text-emerald-800';
    case 'partner':
      return 'bg-purple-100 text-purple-800';
    case 'senior_partner':
      return 'bg-violet-100 text-violet-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPositionDisplayName = (position: UserPosition): string => {
  return position.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const getAdminTimeStatus = (current: number, expected: number): 'normal' | 'warning' | 'error' => {
  const variance = Math.abs(current - expected);
  if (variance <= 5) return 'normal';
  if (variance <= 15) return 'warning';
  return 'error';
};

// =============================================================================
// POSITION SELECTOR COMPONENT
// =============================================================================

export function PositionSelector({ currentPosition, onPositionChange, disabled = false }: PositionSelectorProps) {
  const positions: UserPosition[] = [
    'consultant',
    'senior_consultant',
    'manager',
    'senior_manager',
    'partner',
    'senior_partner'
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="position-select">Organizational Position</Label>
      <Select
        value={currentPosition}
        onValueChange={(value: UserPosition) => onPositionChange(value)}
        disabled={disabled}
      >
        <SelectTrigger id="position-select">
          <SelectValue placeholder="Select position" />
        </SelectTrigger>
        <SelectContent>
          {positions.map((position) => (
            <SelectItem key={position} value={position}>
              <div className="flex items-center space-x-2">
                <span>{getPositionDisplayName(position)}</span>
                <Badge variant="secondary" className="text-xs">
                  {POSITION_ADMIN_DEFAULTS[position].defaultAdminPercentage}% admin
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        {POSITION_ADMIN_DEFAULTS[currentPosition].description}
      </p>
    </div>
  );
}

// =============================================================================
// ADMIN TIME CONFIGURATION COMPONENT
// =============================================================================

export function AdminTimeConfig({ 
  currentPercentage, 
  position, 
  useDefault, 
  onPercentageChange, 
  onUseDefaultChange,
  disabled = false 
}: AdminTimeConfigProps) {
  const defaultPercentage = POSITION_ADMIN_DEFAULTS[position].defaultAdminPercentage;
  const status = getAdminTimeStatus(currentPercentage, defaultPercentage);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="admin-time-config">Admin Time Allocation</Label>
        <div className="flex items-center space-x-2">
          <Label htmlFor="use-default" className="text-sm">Use position default</Label>
          <Switch
            id="use-default"
            checked={useDefault}
            onCheckedChange={onUseDefaultChange}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Position Default</Label>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl font-bold text-gray-600">
              {defaultPercentage}%
            </span>
            <Badge variant="outline" className="text-xs">
              {getPositionDisplayName(position)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on organizational position
          </p>
        </div>

        <div>
          <Label htmlFor="current-percentage" className="text-sm font-medium">
            {useDefault ? 'Effective Percentage' : 'Custom Percentage'}
          </Label>
          <div className="flex items-center space-x-2 mt-1">
            {useDefault ? (
              <span className="text-2xl font-bold text-green-600">
                {defaultPercentage}%
              </span>
            ) : (
              <div className="flex items-center space-x-2">
                <Input
                  id="current-percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={currentPercentage}
                  onChange={(e) => onPercentageChange(parseFloat(e.target.value) || 0)}
                  disabled={disabled || useDefault}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            )}
            {status === 'warning' && (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
            {status === 'error' && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            {status === 'normal' && !useDefault && (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
          </div>
          
          {!useDefault && status !== 'normal' && (
            <Alert className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {status === 'warning' ? 
                  `Variance of ${Math.abs(currentPercentage - defaultPercentage).toFixed(1)}% from position default` :
                  `Significant variance of ${Math.abs(currentPercentage - defaultPercentage).toFixed(1)}% from position default`
                }
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Impact Analysis</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Admin Time (8h day):</span>
            <span className="ml-2 font-medium">
              {((useDefault ? defaultPercentage : currentPercentage) * 8 / 100).toFixed(1)}h
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Payroll Capacity:</span>
            <span className="ml-2 font-medium">
              {(8 - (useDefault ? defaultPercentage : currentPercentage) * 8 / 100).toFixed(1)}h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN POSITION MANAGEMENT COMPONENT
// =============================================================================

export function PositionManagement({ 
  user, 
  canEdit = false, 
  onUpdatePosition, 
  onUpdateAdminTime 
}: PositionManagementProps) {
  const [selectedPosition, setSelectedPosition] = useState<UserPosition>(user.position);
  const [adminPercentage, setAdminPercentage] = useState(user.defaultAdminTimePercentage);
  const [useDefaultAdminTime, setUseDefaultAdminTime] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = selectedPosition !== user.position || 
    (selectedPosition === user.position && !useDefaultAdminTime && adminPercentage !== user.defaultAdminTimePercentage);

  const handleSave = async () => {
    if (!canEdit || !hasChanges) return;

    setIsSaving(true);
    try {
      if (selectedPosition !== user.position && onUpdatePosition) {
        await onUpdatePosition(
          user.id, 
          selectedPosition, 
          useDefaultAdminTime ? POSITION_ADMIN_DEFAULTS[selectedPosition].defaultAdminPercentage : adminPercentage
        );
      } else if (!useDefaultAdminTime && onUpdateAdminTime) {
        await onUpdateAdminTime(user.id, adminPercentage);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update position/admin time:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedPosition(user.position);
    setAdminPercentage(user.defaultAdminTimePercentage);
    setUseDefaultAdminTime(true);
    setIsEditing(false);
  };

  const handlePositionChange = (newPosition: UserPosition) => {
    setSelectedPosition(newPosition);
    if (useDefaultAdminTime) {
      setAdminPercentage(POSITION_ADMIN_DEFAULTS[newPosition].defaultAdminPercentage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <CardTitle className="text-lg">Position & Admin Time</CardTitle>
          </div>
          {canEdit && (
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Position Display */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Current Position</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getPositionColor(user.position)}>
                {getPositionDisplayName(user.position)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {user.defaultAdminTimePercentage}% admin time
              </span>
            </div>
          </div>
          <div className="text-right">
            <Label className="text-sm font-medium">System Role</Label>
            <div className="mt-1">
              <Badge variant="outline">{user.role}</Badge>
            </div>
          </div>
        </div>

        {isEditing && (
          <>
            <Separator />
            
            {/* Position Selector */}
            <PositionSelector
              currentPosition={selectedPosition}
              onPositionChange={handlePositionChange}
              disabled={isSaving}
            />

            <Separator />

            {/* Admin Time Configuration */}
            <AdminTimeConfig
              currentPercentage={adminPercentage}
              position={selectedPosition}
              useDefault={useDefaultAdminTime}
              onPercentageChange={setAdminPercentage}
              onUseDefaultChange={setUseDefaultAdminTime}
              disabled={isSaving}
            />
          </>
        )}

        {/* Position Info */}
        {!isEditing && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Position Insights</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="mb-2">{POSITION_ADMIN_DEFAULTS[user.position].description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Typical Admin Time:</span>
                  <span className="ml-2">{POSITION_ADMIN_DEFAULTS[user.position].defaultAdminPercentage}%</span>
                </div>
                <div>
                  <span className="font-medium">Daily Capacity (8h):</span>
                  <span className="ml-2">
                    {(8 - (POSITION_ADMIN_DEFAULTS[user.position].defaultAdminPercentage * 8 / 100)).toFixed(1)}h payroll
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// BULK POSITION MANAGEMENT COMPONENT
// =============================================================================

interface BulkPositionManagementProps {
  users: UserWithPosition[];
  onBulkUpdatePosition?: (userIds: string[], position: UserPosition) => void;
  onBulkUpdateAdminTime?: (userIds: string[], adminPercentage: number) => void;
}

export function BulkPositionManagement({ 
  users, 
  onBulkUpdatePosition, 
  onBulkUpdateAdminTime 
}: BulkPositionManagementProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkPosition, setBulkPosition] = useState<UserPosition>('consultant');
  const [bulkAdminPercentage, setBulkAdminPercentage] = useState(15);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleBulkPositionUpdate = async () => {
    if (selectedUsers.length === 0 || !onBulkUpdatePosition) return;

    setIsUpdating(true);
    try {
      await onBulkUpdatePosition(selectedUsers, bulkPosition);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Failed to bulk update positions:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkAdminTimeUpdate = async () => {
    if (selectedUsers.length === 0 || !onBulkUpdateAdminTime) return;

    setIsUpdating(true);
    try {
      await onBulkUpdateAdminTime(selectedUsers, bulkAdminPercentage);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Failed to bulk update admin time:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserCog className="w-5 h-5" />
          <span>Bulk Position Management</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* User Selection */}
        <div>
          <Label className="text-sm font-medium">Select Users</Label>
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user.id]);
                    } else {
                      setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                    }
                  }}
                  className="rounded"
                />
                <label htmlFor={`user-${user.id}`} className="flex items-center space-x-2 text-sm">
                  <span>{user.computedName || `${user.firstName} ${user.lastName}`.trim()}</span>
                  <Badge className={getPositionColor(user.position)} variant="secondary">
                    {getPositionDisplayName(user.position)}
                  </Badge>
                </label>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {selectedUsers.length} user(s) selected
          </p>
        </div>

        {selectedUsers.length > 0 && (
          <>
            <Separator />
            
            {/* Bulk Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Update Position</Label>
                <PositionSelector
                  currentPosition={bulkPosition}
                  onPositionChange={setBulkPosition}
                  disabled={isUpdating}
                />
                <Button
                  onClick={handleBulkPositionUpdate}
                  disabled={isUpdating}
                  className="w-full"
                  size="sm"
                >
                  {isUpdating ? 'Updating...' : 'Update Positions'}
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Update Admin Time</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={bulkAdminPercentage}
                    onChange={(e) => setBulkAdminPercentage(parseFloat(e.target.value) || 0)}
                    disabled={isUpdating}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <Button
                  onClick={handleBulkAdminTimeUpdate}
                  disabled={isUpdating}
                  className="w-full"
                  size="sm"
                >
                  {isUpdating ? 'Updating...' : 'Update Admin Time'}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}