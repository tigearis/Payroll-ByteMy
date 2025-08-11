"use client";

import { Plus, Download, Settings, Users, DollarSign, TrendingUp } from "lucide-react";

// New Modern Components
import { 
  ModernDashboard,
  StatusBar,
  QuickActions,
  InsightsGrid,
  WorkflowSuggestions
} from "@/components/dashboard";
import { ModernDataTable, type ColumnDef } from "@/components/data";
import { AppShell, ShellWithHeader } from "@/components/layout";
import { 
  StatusIndicator,
  SuccessStatus,
  WarningStatus,
  TrendDisplay,
  LargeNumberDisplay,
  MetricsCard
} from "@/components/ui";
import {
  ContentSection,
  CardSection,
  InfoSection,
  ContentGrid,
  SectionHeader
} from "@/components/ui";
import { Button } from "@/components/ui/button";

// Example data for demo
const mockClientData = [
  {
    id: '1',
    name: 'Acme Corp',
    status: 'Active',
    revenue: 125000,
    lastPayroll: '2025-01-15',
    consultant: 'John Smith'
  },
  {
    id: '2', 
    name: 'Tech Solutions',
    status: 'Pending',
    revenue: 85000,
    lastPayroll: '2025-01-12',
    consultant: 'Sarah Johnson'
  }
];

const clientColumns: ColumnDef<typeof mockClientData[0]>[] = [
  {
    id: 'name',
    key: 'name',
    label: 'Client Name',
    essential: true,
    sortable: true
  },
  {
    id: 'status',
    key: 'status', 
    label: 'Status',
    essential: true,
    render: (value) => (
      <StatusIndicator variant={value === 'Active' ? 'success' : 'pending'} badge>
        {value}
      </StatusIndicator>
    )
  },
  {
    id: 'revenue',
    key: 'revenue',
    label: 'Annual Revenue',
    essential: true,
    render: (value) => new Intl.NumberFormat('en-AU', { 
      style: 'currency', 
      currency: 'AUD',
      minimumFractionDigits: 0
    }).format(value)
  },
  {
    id: 'consultant',
    key: 'consultant',
    label: 'Consultant', 
    essential: true
  }
];

const mockInsights = [
  {
    id: 'revenue',
    type: 'revenue-trends' as const,
    title: 'Monthly Revenue',
    priority: 'medium' as const,
    metrics: [
      {
        label: 'This Month',
        value: 450000,
        format: 'currency' as const,
        change: { value: 12.5, type: 'increase' as const, period: 'last month' }
      }
    ],
    actions: [
      { label: 'View Details', href: '/billing/analytics' }
    ]
  },
  {
    id: 'deadlines',
    type: 'upcoming-deadlines' as const,
    title: 'Upcoming Deadlines',
    priority: 'high' as const,
    items: [
      { label: 'ATO Submission', value: 'Due in 3 days', status: 'warning' as const },
      { label: 'Quarterly Report', value: 'Due next week', status: 'pending' as const }
    ],
    actions: [
      { label: 'View All', href: '/deadlines' }
    ]
  }
];

const mockSuggestions = [
  {
    id: 'automation',
    type: 'automation' as const,
    title: 'Automate Invoice Generation', 
    description: 'Set up automatic invoice generation for recurring clients to save time',
    reasoning: 'You have 12 clients with regular monthly billing that could be automated',
    impact: 'high' as const,
    effort: 'low' as const,
    estimatedSavings: { time: '4 hours/week', cost: 2400 },
    actions: [
      { label: 'Set up automation', href: '/billing/automation', primary: true },
      { label: 'Learn more', href: '/help/automation' }
    ]
  }
];

/**
 * Modern UI Demo
 * 
 * Demonstrates the complete UI transformation showing:
 * - Modern AppShell with grouped navigation
 * - Intelligent dashboard with actionable insights
 * - Progressive disclosure data tables
 * - Enhanced status indicators and metrics
 * - Mobile-first responsive design
 */
export function ModernUIDemo() {
  return (
    <ShellWithHeader
      title="Modern Dashboard"
      description="Redesigned interface with improved usability and mobile support"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Modern UI Demo" }
      ]}
      actions={[
        { label: "Export Data", icon: Download },
        { label: "Settings", icon: Settings },
        { label: "New Client", icon: Plus, primary: true }
      ]}
    >
      <div className="space-y-8">
        {/* Modern Dashboard */}
        <ModernDashboard
          systemHealth="operational"
          alerts={[]}
          insights={mockInsights}
          suggestions={mockSuggestions}
          pendingTasks={3}
          lastUpdate={new Date()}
        />

        {/* Content Grid with Different Section Types */}
        <ContentGrid columns={2} gap="lg">
          <CardSection
            header={<SectionHeader title="Metrics Overview" />}
          >
            <MetricsCard title="Revenue Performance">
              <div className="grid grid-cols-2 gap-4">
                <LargeNumberDisplay
                  label="Monthly Revenue"
                  value={450000}
                  format="currency"
                  highlight
                  icon={DollarSign}
                />
                <TrendDisplay
                  label="Growth Rate"
                  value={12.5}
                  previousValue={8.2}
                  period="last month"
                  format="percentage"
                  icon={TrendingUp}
                />
              </div>
            </MetricsCard>
          </CardSection>

          <InfoSection 
            header={<SectionHeader title="System Status" />}
          >
            <div className="space-y-3">
              <SuccessStatus>All systems operational</SuccessStatus>
              <WarningStatus>3 pending approvals</WarningStatus>
              <StatusIndicator variant="info" badge>
                Last backup: 2 hours ago
              </StatusIndicator>
            </div>
          </InfoSection>
        </ContentGrid>

        {/* Modern Data Table */}
        <CardSection
          header={
            <SectionHeader 
              title="Client Management"
              description="Progressive disclosure table with essential information"
              actions={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              }
            />
          }
        >
          <ModernDataTable
            data={mockClientData}
            columns={clientColumns}
            searchPlaceholder="Search clients..."
            expandableRows
            renderExpandedRow={(row) => (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <p className="text-sm text-neutral-600">
                    Last payroll: {row.lastPayroll}<br/>
                    Consultant: {row.consultant}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recent Activity</h4>
                  <div className="space-y-1">
                    <SuccessStatus size="sm">Invoice sent</SuccessStatus>
                    <StatusIndicator variant="pending" size="sm">
                      Payroll processing
                    </StatusIndicator>
                  </div>
                </div>
              </div>
            )}
            rowActions={[
              {
                id: 'edit',
                label: 'Edit',
                onClick: (row) => console.log('Edit', row.name)
              },
              {
                id: 'delete',
                label: 'Delete',
                variant: 'destructive',
                onClick: (row) => console.log('Delete', row.name)
              }
            ]}
          />
        </CardSection>
      </div>
    </ShellWithHeader>
  );
}

// Usage example for the new AppShell
export function SimplePageExample() {
  return (
    <AppShell 
      pageHeader={{
        title: "Simple Page",
        description: "Example of the new AppShell usage",
        actions: [
          { label: "Action", onClick: () => console.log('clicked') }
        ]
      }}
    >
      <ContentGrid columns={3}>
        <LargeNumberDisplay
          label="Total Users"
          value={1247}
          icon={Users}
          subtitle="Active this month"
        />
        <TrendDisplay
          label="Revenue"
          value={85600}
          previousValue={72400}
          period="last month"
          format="currency"
        />
        <StatusIndicator variant="success" badge>
          System Operational
        </StatusIndicator>
      </ContentGrid>
    </AppShell>
  );
}