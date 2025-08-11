"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
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

// GraphQL Queries
const GET_USER_BILLING_RATES = gql`
  query GetUserBillingRates {
    users(where: { is_active: { _eq: true } }) {
      id
      email
      first_name
      last_name
      computed_name
      role
      current_hourly_rate
      seniority_level
      is_active
      user_billing_rates(order_by: { effective_from: desc }) {
        id
        hourly_rate
        seniority_level
        effective_from
        effective_to
        is_active
        created_at
        created_by_user {
          computed_name
        }
      }
    }
  }
`;

const GET_USER_BILLING_STATISTICS = gql`
  query GetUserBillingStatistics {
    usersAggregate: users_aggregate(where: { is_active: { _eq: true } }) {
      aggregate {
        count
      }
    }
    usersWithRatesAggregate: users_aggregate(where: { 
      is_active: { _eq: true } 
      current_hourly_rate: { _is_null: false } 
    }) {
      aggregate {
        count
        avg {
          current_hourly_rate
        }
        min {
          current_hourly_rate
        }
        max {
          current_hourly_rate
        }
      }
    }
    ratesByRole: users_aggregate(
      where: { is_active: { _eq: true }, current_hourly_rate: { _is_null: false } }
      group_by: [role, seniority_level]
    ) {
      nodes {
        role
        seniority_level
      }
      aggregate {
        count
        avg {
          current_hourly_rate
        }
      }
    }
  }
`;

const CREATE_USER_BILLING_RATE = gql`
  mutation CreateUserBillingRate($input: user_billing_rates_insert_input!) {
    insert_user_billing_rates_one(object: $input) {
      id
      hourly_rate
      seniority_level
      effective_from
      user {
        computed_name
        current_hourly_rate
      }
    }
  }
`;

const UPDATE_USER_BILLING_RATE = gql`
  mutation UpdateUserBillingRate($id: uuid!, $input: user_billing_rates_set_input!) {
    update_user_billing_rates_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
      hourly_rate
      effective_from
      effective_to
    }
  }
`;

const UPDATE_USER_CURRENT_RATE = gql`
  mutation UpdateUserCurrentRate($userId: uuid!, $hourlyRate: numeric!, $seniorityLevel: seniority_level_type!) {
    update_users_by_pk(
      pk_columns: { id: $userId }
      _set: { 
        current_hourly_rate: $hourlyRate
        seniority_level: $seniorityLevel
      }
    ) {
      id
      current_hourly_rate
      seniority_level
    }
  }
`;

const DEACTIVATE_USER_BILLING_RATE = gql`
  mutation DeactivateUserBillingRate($id: uuid!) {
    update_user_billing_rates_by_pk(
      pk_columns: { id: $id }
      _set: { is_active: false, effective_to: "now()" }
    ) {
      id
      effective_to
    }
  }
`;

// Types
interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  computed_name: string;
  role: string;
  current_hourly_rate?: number;
  seniority_level?: string;
  is_active: boolean;
  user_billing_rates: BillingRate[];
}

interface BillingRate {
  id: string;
  hourly_rate: number;
  seniority_level: string;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
  created_at: string;
  created_by_user?: {
    computed_name: string;
  };
}

interface RateFormData {
  userId: string;
  hourly_rate: number;
  seniority_level: string;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
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
    seniority_level: "junior",
    effective_from: new Date().toISOString().split('T')[0],
    is_active: true
  });

  // GraphQL hooks
  const { data: usersData, loading: usersLoading, refetch } = useQuery(GET_USER_BILLING_RATES);
  const { data: statsData } = useQuery(GET_USER_BILLING_STATISTICS);
  
  const [createUserBillingRate] = useMutation(CREATE_USER_BILLING_RATE);
  const [updateUserBillingRate] = useMutation(UPDATE_USER_BILLING_RATE);
  const [updateUserCurrentRate] = useMutation(UPDATE_USER_CURRENT_RATE);
  const [deactivateUserBillingRate] = useMutation(DEACTIVATE_USER_BILLING_RATE);

  const users: User[] = usersData?.users || [];

  // Statistics
  const totalUsers = statsData?.usersAggregate?.aggregate?.count || 0;
  const usersWithRates = statsData?.usersWithRatesAggregate?.aggregate?.count || 0;
  const avgRate = statsData?.usersWithRatesAggregate?.aggregate?.avg?.current_hourly_rate || 0;
  const minRate = statsData?.usersWithRatesAggregate?.aggregate?.min?.current_hourly_rate || 0;
  const maxRate = statsData?.usersWithRatesAggregate?.aggregate?.max?.current_hourly_rate || 0;

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
            user_id: formData.userId,
            hourly_rate: formData.hourly_rate,
            seniority_level: formData.seniority_level,
            effective_from: formData.effective_from,
            effective_to: formData.effective_to || null,
            is_active: formData.is_active,
            created_by: formData.userId // Self-created for now
          }
        }
      });

      // Update user's current rate if this is the active rate
      if (formData.is_active) {
        await updateUserCurrentRate({
          variables: {
            userId: formData.userId,
            hourlyRate: formData.hourly_rate,
            seniorityLevel: formData.seniority_level
          }
        });
      }

      const user = users.find(u => u.id === formData.userId);
      toast.success(`Billing rate created for ${user?.computed_name}`);
      setIsCreateDialogOpen(false);
      setFormData({
        userId: "",
        hourly_rate: 0,
        seniority_level: "junior",
        effective_from: new Date().toISOString().split('T')[0],
        is_active: true
      });
      refetch();
    } catch (error: any) {
      toast.error(`Failed to create billing rate: ${error.message}`);
    }
  };

  const handleDeactivateRate = async (rate: BillingRate, user: User) => {
    if (!confirm(`Deactivate billing rate for ${user.computed_name}? This will end the rate as of today.`)) {
      return;
    }

    try {
      await deactivateUserBillingRate({
        variables: { id: rate.id }
      });

      toast.success(`Billing rate deactivated for ${user.computed_name}`);
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
        hourly_rate: user.current_hourly_rate || 75,
        seniority_level: user.seniority_level || "junior"
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
                  <span>{user.computed_name}</span>
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
          <Label htmlFor="seniority_level">Seniority Level *</Label>
          <Select value={formData.seniority_level} onValueChange={(value) => setFormData(prev => ({ ...prev, seniority_level: value }))}>
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
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
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
              {users.reduce((sum, user) => sum + user.user_billing_rates.length, 0)}
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
                          <div className="font-medium">{user.computed_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {user.current_hourly_rate ? (
                          <div className="font-medium text-green-600">
                            ${user.current_hourly_rate.toFixed(2)}/hr
                          </div>
                        ) : (
                          <div className="text-muted-foreground">
                            No rate set
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {user.seniority_level ? (
                          <Badge variant="outline" className={getSeniorityColor(user.seniority_level)}>
                            {user.seniority_level}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {user.user_billing_rates.length} rate{user.user_billing_rates.length !== 1 ? 's' : ''}
                          </span>
                          {user.user_billing_rates.length > 0 && (
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
                          {user.user_billing_rates.find(rate => rate.is_active) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeactivateRate(
                                user.user_billing_rates.find(rate => rate.is_active)!,
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
              Rate History: {selectedUser?.computed_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      ${selectedUser.current_hourly_rate?.toFixed(2) || '0.00'}
                    </div>
                    <p className="text-xs text-muted-foreground">Current Rate</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {selectedUser.seniority_level || '-'}
                    </div>
                    <p className="text-xs text-muted-foreground">Seniority Level</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {selectedUser.user_billing_rates.length}
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
                    {selectedUser.user_billing_rates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell className="font-medium">
                          ${rate.hourly_rate.toFixed(2)}/hr
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="outline" className={getSeniorityColor(rate.seniority_level)}>
                            {rate.seniority_level}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          {format(new Date(rate.effective_from), 'dd MM yyyy')}
                        </TableCell>
                        
                        <TableCell>
                          {rate.effective_to 
                            ? format(new Date(rate.effective_to), 'dd MM yyyy')
                            : rate.is_active 
                              ? "Current" 
                              : "Indefinite"
                          }
                        </TableCell>
                        
                        <TableCell>
                          {rate.is_active ? (
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
                          {rate.created_by_user?.computed_name || 'System'}
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