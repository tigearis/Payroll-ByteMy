"use client";

import { useQuery, useMutation } from "@apollo/client";
import { format } from 'date-fns';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  History
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GetUserBillingRatesAdvancedDocument,
  GetUserBillingStatisticsAdvancedDocument,
  CreateUserBillingRateAdvancedDocument,
  UpdateUserBillingRateAdvancedDocument,
  UpdateUserCurrentRateAdvancedDocument,
  DeactivateUserBillingRateAdvancedDocument,
  type GetUserBillingRatesAdvancedQuery,
  type GetUserBillingStatisticsAdvancedQuery,
  type CreateUserBillingRateAdvancedMutation,
  type CreateUserBillingRateAdvancedMutationVariables,
  type UpdateUserBillingRateAdvancedMutation,
  type UpdateUserBillingRateAdvancedMutationVariables,
  type UpdateUserCurrentRateAdvancedMutation,
  type UpdateUserCurrentRateAdvancedMutationVariables,
  type DeactivateUserBillingRateAdvancedMutation,
  type DeactivateUserBillingRateAdvancedMutationVariables
} from "../../graphql/generated/graphql";

// Types
type User = NonNullable<GetUserBillingRatesAdvancedQuery['users']>[0];
type BillingRate = User['userBillingRates'][0];

interface RateFormData {
  userId: string;
  hourly_rate: number;
  seniorityLevel: string;
  effective_from: string;
  effective_to?: string;
  isActive: boolean;
}

const SENIORITY_LEVELS = [
  { value: "junior", label: "Junior", multiplier: "1.0x" },
  { value: "senior", label: "Senior", multiplier: "1.3x" },
  { value: "manager", label: "Manager", multiplier: "1.6x" },
  { value: "partner", label: "Partner", multiplier: "2.0x" }
];

const ROLE_COLORS = {
  developer: "bg-purple-100 text-purple-800",
  org_admin: "bg-red-100 text-red-800",
  manager: "bg-blue-100 text-blue-800",
  consultant: "bg-green-100 text-green-800",
  viewer: "bg-gray-100 text-gray-800"
};

export function UserBillingRateManager() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [formData, setFormData] = useState<RateFormData>({
    userId: "",
    hourly_rate: 0,
    seniorityLevel: "junior",
    effective_from: new Date().toISOString().split('T')[0],
    isActive: true
  });

  // GraphQL hooks
  const { data: usersData, loading: usersLoading, refetch } = useQuery<GetUserBillingRatesAdvancedQuery>(GetUserBillingRatesAdvancedDocument);
  const { data: statsData } = useQuery<GetUserBillingStatisticsAdvancedQuery>(GetUserBillingStatisticsAdvancedDocument);
  
  const [createUserBillingRate] = useMutation<CreateUserBillingRateAdvancedMutation, CreateUserBillingRateAdvancedMutationVariables>(CreateUserBillingRateAdvancedDocument);
  const [updateUserBillingRate] = useMutation<UpdateUserBillingRateAdvancedMutation, UpdateUserBillingRateAdvancedMutationVariables>(UpdateUserBillingRateAdvancedDocument);
  const [updateUserCurrentRate] = useMutation<UpdateUserCurrentRateAdvancedMutation, UpdateUserCurrentRateAdvancedMutationVariables>(UpdateUserCurrentRateAdvancedDocument);
  const [deactivateUserBillingRate] = useMutation<DeactivateUserBillingRateAdvancedMutation, DeactivateUserBillingRateAdvancedMutationVariables>(DeactivateUserBillingRateAdvancedDocument);

  const users = usersData?.users || [];

  // Statistics
  const totalUsers = statsData?.usersAggregate?.aggregate?.count || 0;
  const usersWithRates = statsData?.usersWithRatesAggregate?.aggregate?.count || 0;
  const avgRate = statsData?.usersWithRatesAggregate?.aggregate?.avg?.currentHourlyRate || 0;
  const minRate = statsData?.usersWithRatesAggregate?.aggregate?.min?.currentHourlyRate || 0;
  const maxRate = statsData?.usersWithRatesAggregate?.aggregate?.max?.currentHourlyRate || 0;

  const getRoleColor = (role: string) => {
    return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || "bg-gray-100 text-gray-800";
  };

  const getSeniorityColor = (level: string) => {
    const colors = {
      junior: "bg-blue-100 text-blue-800",
      senior: "bg-green-100 text-green-800", 
      manager: "bg-orange-100 text-orange-800",
      partner: "bg-purple-100 text-purple-800"
    };
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleCreateRate = async () => {
    try {
      const result = await createUserBillingRate({
        variables: {
          input: {
            userId: formData.userId,
            hourlyRate: formData.hourly_rate,
            seniorityLevel: formData.seniorityLevel as any,
            effectiveFrom: formData.effective_from,
            effectiveTo: formData.effective_to || undefined,
            isActive: formData.isActive,
            createdBy: formData.userId // Self-created for now
          }
        }
      });

      // Update user's current rate if this is the active rate
      if (formData.isActive) {
        await updateUserCurrentRate({
          variables: {
            userId: formData.userId,
            hourlyRate: formData.hourly_rate,
            seniorityLevel: formData.seniorityLevel
          }
        });
      }

      const user = users.find(u => u.id === formData.userId);
      toast.success(`Billing rate created for ${user?.computedName}`);
      setIsCreateDialogOpen(false);
      setFormData({
        userId: "",
        hourly_rate: 0,
        seniorityLevel: "junior",
        effective_from: new Date().toISOString().split('T')[0],
        isActive: true
      });
      refetch();
    } catch (error: any) {
      toast.error(`Failed to create billing rate: ${error.message}`);
    }
  };

  const handleDeactivateRate = async (rate: BillingRate, user: User) => {
    if (!confirm(`Deactivate billing rate for ${user.computedName}? This will end the rate as of today.`)) {
      return;
    }

    try {
      // Compute current date in JavaScript
      const effectiveTo = new Date().toISOString().split('T')[0];
      
      await deactivateUserBillingRate({
        variables: { 
          id: rate.id,
          effectiveTo
        }
      });

      toast.success(`Billing rate deactivated for ${user.computedName}`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to deactivate rate: ${error.message}`);
    }
  };

  const openCreateDialog = (user?: User) => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userId: user.id,
        hourly_rate: user.currentHourlyRate || 75,
        seniorityLevel: user.seniorityLevel || "junior"
      }));
    }
    setIsCreateDialogOpen(true);
  };

  const openHistoryDialog = (user: User) => {
    setSelectedUser(user);
    setIsHistoryDialogOpen(true);
  };

  const RateForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="user">User *</Label>
        <Select value={formData.userId} onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex items-center gap-2">
                  <span>{user.computedName}</span>
                  <Badge variant="outline" className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hourly_rate">Hourly Rate ($) *</Label>
          <Input
            id="hourly_rate"
            type="number"
            step="0.01"
            value={formData.hourly_rate}
            onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="seniorityLevel">Seniority Level *</Label>
          <Select value={formData.seniorityLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, seniorityLevel: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {SENIORITY_LEVELS.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  <div className="flex items-center gap-2">
                    <span>{level.label}</span>
                    <span className="text-xs text-muted-foreground">({level.multiplier})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="effective_from">Effective From *</Label>
          <Input
            id="effective_from"
            type="date"
            value={formData.effective_from}
            onChange={(e) => setFormData(prev => ({ ...prev, effective_from: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="effective_to">Effective To (Optional)</Label>
          <Input
            id="effective_to"
            type="date"
            value={formData.effective_to || ""}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              ...(e.target.value ? { effective_to: e.target.value } : {})
            }))}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Set as Current Rate</Label>
          <p className="text-sm text-muted-foreground">
            Update user's current hourly rate and seniority level
          </p>
        </div>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
      </div>
    </div>
  );

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading user billing rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Billing Rates</h1>
          <p className="text-muted-foreground mt-1">
            Manage hourly rates and seniority levels for all users
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Rate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Billing Rate</DialogTitle>
            </DialogHeader>
            <RateForm />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRate} disabled={!formData.userId || formData.hourly_rate <= 0}>
                Create Rate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active users in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users with Rates</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{usersWithRates}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0 ? Math.round((usersWithRates / totalUsers) * 100) : 0}% coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgRate.toFixed(0)}/hr</div>
            <p className="text-xs text-muted-foreground">
              Range: ${minRate.toFixed(0)} - ${maxRate.toFixed(0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate History</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((sum, user) => sum + user.userBillingRates.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total rate records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Billing Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Current Rate</TableHead>
                  <TableHead>Seniority Level</TableHead>
                  <TableHead>Rate History</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        No users found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{user.computedName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {user.currentHourlyRate ? (
                          <div className="font-medium text-green-600">
                            ${user.currentHourlyRate.toFixed(2)}/hr
                          </div>
                        ) : (
                          <div className="text-muted-foreground">
                            No rate set
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {user.seniorityLevel ? (
                          <Badge variant="outline" className={getSeniorityColor(user.seniorityLevel)}>
                            {user.seniorityLevel}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {user.userBillingRates.length} rate{user.userBillingRates.length !== 1 ? 's' : ''}
                          </span>
                          {user.userBillingRates.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openHistoryDialog(user)}
                            >
                              <History className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openCreateDialog(user)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          {user.userBillingRates.find(rate => rate.isActive) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeactivateRate(
                                user.userBillingRates.find(rate => rate.isActive)!,
                                user
                              )}
                              className="text-orange-600 hover:text-orange-700"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Rate History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Rate History: {selectedUser?.computedName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      ${selectedUser.currentHourlyRate?.toFixed(2) || '0.00'}
                    </div>
                    <p className="text-xs text-muted-foreground">Current Rate</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {selectedUser.seniorityLevel || '-'}
                    </div>
                    <p className="text-xs text-muted-foreground">Seniority Level</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {selectedUser.userBillingRates.length}
                    </div>
                    <p className="text-xs text-muted-foreground">Rate Changes</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rate</TableHead>
                      <TableHead>Seniority</TableHead>
                      <TableHead>Effective From</TableHead>
                      <TableHead>Effective To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedUser.userBillingRates.map((rate: any) => (
                      <TableRow key={rate.id}>
                        <TableCell className="font-medium">
                          ${rate.hourly_rate.toFixed(2)}/hr
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="outline" className={getSeniorityColor(rate.seniorityLevel)}>
                            {rate.seniorityLevel}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          {format(new Date(rate.effective_from), 'dd MM yyyy')}
                        </TableCell>
                        
                        <TableCell>
                          {rate.effective_to 
                            ? format(new Date(rate.effective_to), 'dd MM yyyy')
                            : rate.isActive 
                              ? "Current" 
                              : "Indefinite"
                          }
                        </TableCell>
                        
                        <TableCell>
                          {rate.isActive ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        
                        <TableCell className="text-sm text-muted-foreground">
                          {rate.created_by_user?.computedName || 'System'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}