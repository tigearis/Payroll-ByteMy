"use client";

import { useQuery, useMutation } from "@apollo/client";
import { Plus, Settings, Calendar, DollarSign, AlertCircle, Clock, TrendingUp, Users } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface RecurringServicesManagerProps {
  clientId: string;
  clientName: string;
}

// Standard recurring services from Tier 1 document
const STANDARD_RECURRING_SERVICES = [
  {
    serviceCode: 'MONTHLY_SERVICE',
    serviceName: 'Monthly Servicing Fee',
    description: 'Base client relationship fee covering account management, basic support, and system access',
    baseRate: 150.00,
    billingCycle: 'monthly',
    generationDay: 1,
    category: 'essential',
    autoApproval: true
  },
  {
    serviceCode: 'SYSTEM_MAINTENANCE',
    serviceName: 'System Maintenance Fee',
    description: 'Technology platform maintenance, updates, and infrastructure costs',
    baseRate: 75.00,
    billingCycle: 'monthly',
    generationDay: 1,
    category: 'essential',
    autoApproval: true
  },
  {
    serviceCode: 'COMPLIANCE_MONITORING',
    serviceName: 'Compliance Monitoring Fee',
    description: 'Ongoing compliance monitoring, regulatory updates, and audit support',
    baseRate: 50.00,
    billingCycle: 'monthly',
    generationDay: 1,
    category: 'standard',
    autoApproval: true
  },
  {
    serviceCode: 'PREMIUM_SUPPORT',
    serviceName: 'Premium Support Package',
    description: 'Priority support, dedicated account manager, extended hours support',
    baseRate: 200.00,
    billingCycle: 'monthly',
    generationDay: 1,
    category: 'premium',
    autoApproval: false
  },
  {
    serviceCode: 'DATA_BACKUP_SECURITY',
    serviceName: 'Data Backup & Security Package',
    description: 'Enhanced data backup, security monitoring, and disaster recovery services',
    baseRate: 100.00,
    billingCycle: 'monthly',
    generationDay: 1,
    category: 'premium',
    autoApproval: true
  }
];

export function RecurringServicesManager({ clientId, clientName }: RecurringServicesManagerProps) {
  const [selectedService, setSelectedService] = useState<string>("");
  const [customRate, setCustomRate] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data for now - will be replaced with real GraphQL queries
  const [clientServices, setClientServices] = useState([
    {
      id: '1',
      serviceCode: 'MONTHLY_SERVICE',
      customRate: null,
      effectiveFrom: '2024-01-01',
      effectiveTo: null,
      isActive: true,
      autoGenerate: true,
      recurringService: STANDARD_RECURRING_SERVICES[0]
    },
    {
      id: '2',
      serviceCode: 'SYSTEM_MAINTENANCE',
      customRate: null,
      effectiveFrom: '2024-01-01',
      effectiveTo: null,
      isActive: true,
      autoGenerate: true,
      recurringService: STANDARD_RECURRING_SERVICES[1]
    }
  ]);

  // Calculate monthly recurring total
  const monthlyTotal = clientServices
    .filter(service => service.isActive)
    .reduce((total, service) => {
      const rate = service.customRate || service.recurringService.baseRate;
      return total + rate;
    }, 0);

  // Get next billing date
  const getNextBillingDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth;
  };

  const handleAddService = async () => {
    if (!selectedService) return;

    const serviceConfig = STANDARD_RECURRING_SERVICES.find(s => s.serviceCode === selectedService);
    if (!serviceConfig) return;

    const newService = {
      id: Date.now().toString(),
      serviceCode: selectedService,
      customRate: customRate ? parseFloat(customRate) : null,
      effectiveFrom: new Date().toISOString().split('T')[0],
      effectiveTo: null,
      isActive: true,
      autoGenerate: true,
      recurringService: serviceConfig
    };

    setClientServices(prev => [...prev, newService]);
    toast.success(`Added ${serviceConfig.serviceName} successfully`);
    setIsDialogOpen(false);
    setSelectedService("");
    setCustomRate("");
  };

  const handleToggleService = async (serviceId: string, isActive: boolean) => {
    setClientServices(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, isActive } : service
      )
    );
    toast.success(isActive ? "Service activated" : "Service deactivated");
  };

  const handleGenerateMonthlyBilling = async () => {
    try {
      const response = await fetch('/api/billing/recurring/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientIds: [clientId],
          billingMonth: new Date().toISOString().split('T')[0].substring(0, 7) + '-01',
          dryRun: false
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate billing');
      }

      toast.success(`Generated billing for ${result.itemsCreated} services totaling $${result.totalAmount?.toFixed(2) || 0}`);
    } catch (error: any) {
      toast.error(`Failed to generate billing: ${error.message}`);
    }
  };

  // Get available services (not already subscribed)
  const subscribedCodes = new Set(clientServices.map(s => s.serviceCode));
  const availableServices = STANDARD_RECURRING_SERVICES.filter(config => 
    !subscribedCodes.has(config.serviceCode)
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      'essential': 'bg-blue-100 text-blue-800',
      'standard': 'bg-green-100 text-green-800',
      'premium': 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const nextBillingDate = getNextBillingDate();
  const activeServices = clientServices.filter(s => s.isActive);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${monthlyTotal.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Recurring revenue per month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices.length}</div>
            <p className="text-xs text-muted-foreground">
              of {clientServices.length} total services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {nextBillingDate.toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              1st of each month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">100%</div>
            <p className="text-xs text-muted-foreground">
              Auto-generated billing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recurring Services for {clientName}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monthly recurring services and automated billing
              </p>
            </div>
            
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Recurring Service</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="service-select">Service</Label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableServices.map(service => (
                            <SelectItem key={service.serviceCode} value={service.serviceCode}>
                              <div className="flex items-center justify-between w-full">
                                <span>{service.serviceName}</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  ${service.baseRate}/month
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedService && (
                        <div className="mt-2 p-3 bg-slate-50 rounded text-sm">
                          {availableServices.find(s => s.serviceCode === selectedService)?.description}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-rate">Custom Rate (optional)</Label>
                      <Input
                        id="custom-rate"
                        type="number"
                        step="0.01"
                        value={customRate}
                        onChange={(e) => setCustomRate(e.target.value)}
                        placeholder={selectedService ? `Default: $${availableServices.find(s => s.serviceCode === selectedService)?.baseRate}` : "Leave empty to use base rate"}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddService} disabled={!selectedService}>
                        Add Service
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button size="sm" onClick={handleGenerateMonthlyBilling}>
                <DollarSign className="h-4 w-4 mr-2" />
                Generate Billing
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {clientServices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recurring services configured</p>
              <p className="text-sm">Add services to automatically generate monthly billing</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Services List */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Billing Cycle</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientServices.map((service) => {
                    const config = service.recurringService;
                    const effectiveRate = service.customRate || config.baseRate;
                    const nextBilling = getNextBillingDate();

                    return (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{config.serviceName}</div>
                            <div className="text-sm text-muted-foreground">
                              {config.description}
                            </div>
                            <Badge 
                              variant="outline" 
                              className={getCategoryColor(config.category)}
                            >
                              {config.category}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">${effectiveRate.toFixed(2)}</span>
                            {service.customRate && (
                              <Badge variant="secondary" className="text-xs">
                                Custom
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per {config.billingCycle}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="outline">
                            {config.billingCycle}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            {nextBilling.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Day {config.generationDay} of month
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={service.isActive}
                              onCheckedChange={(checked) => 
                                handleToggleService(service.id, checked)
                              }
                            />
                            <span className="text-sm">
                              {service.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Catalog Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Available Recurring Services</CardTitle>
          <p className="text-sm text-muted-foreground">
            Standard recurring services that can be added to clients
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STANDARD_RECURRING_SERVICES.map((config) => {
              const isSubscribed = subscribedCodes.has(config.serviceCode);
              
              return (
                <Card 
                  key={config.serviceCode} 
                  className={`transition-all ${isSubscribed ? "opacity-60 bg-slate-50" : "hover:shadow-md"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{config.serviceName}</h4>
                        <Badge 
                          variant="outline" 
                          className={`${getCategoryColor(config.category)} mb-2`}
                        >
                          {config.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Badge variant={isSubscribed ? "secondary" : "outline"}>
                          ${config.baseRate}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {config.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Billed {config.billingCycle}</span>
                      {isSubscribed ? (
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      ) : (
                        <span className={config.autoApproval ? "text-green-600" : "text-orange-600"}>
                          {config.autoApproval ? "Auto-approved" : "Requires approval"}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing Automation Process */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Automated Billing Process</CardTitle>
          <p className="text-sm text-muted-foreground">
            How recurring services generate monthly billing automatically
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Monthly Schedule</h4>
                <p className="text-sm text-gray-600">
                  Automated job runs on the 1st of each month at 6:00 AM
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">2</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Pro-ration Logic</h4>
                <p className="text-sm text-gray-600">
                  New clients get pro-rated billing, terminated clients get partial billing
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">3</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Auto-Approval</h4>
                <p className="text-sm text-gray-600">
                  Most recurring services are auto-approved and ready for invoicing
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}