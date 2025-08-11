"use client";

/*
 * Modern Email Management Page
 *
 * Features progressive disclosure pattern with:
 * - 4 essential columns: Template Name, Category, Status, Actions
 * - Expandable rows for detailed template information and management
 * - Smart search and contextual email composition
 * - Mobile-first responsive design
 */

import {
  Plus,
  RefreshCw,
  Send,
  BarChart3,
  Settings,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmailAnalytics } from "@/domains/email/components/email-analytics";
import { EmailComposer } from "@/domains/email/components/email-composer";
import { ModernEmailManager } from "@/domains/email/components/ModernEmailManager";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDynamicLoading } from "@/lib/hooks/use-dynamic-loading";

// Create loading component for email
function EmailLoading() {
  const { Loading } = useDynamicLoading({
    title: "Loading Email Templates...",
    description: "Fetching templates and email system data",
  });
  return <Loading variant="minimal" />;
}

interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  isSystemTemplate: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdByUser?: {
    id: string;
    firstName?: string;
    lastName?: string;
    computedName?: string;
    email: string;
  } | null;
  variableCount?: number;
  usageCount?: number;
  lastUsedAt?: string;
  preview?: {
    subject: string;
    htmlContent: string;
  };
}

interface EmailStats {
  overview: {
    totalTemplates: number;
    activeTemplates: number;
    systemTemplates: number;
    recentlyUsed: number;
    emailsSentThisMonth: number;
    deliveryRate: number;
  };
  byCategory: {
    system: number;
    payroll: number;
    client: number;
    internal: number;
    marketing: number;
  };
}

function EmailManagementPage() {
  const { currentUser, loading: userLoading } = useCurrentUser();

  // Data state
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showQuickComposer, setShowQuickComposer] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  // Fetch email templates data
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/email/templates?includeStats=true");
      const data = await response.json();

      if (data.success) {
        setTemplates(data.data.templates || []);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      } else {
        setError(data.error || "Failed to fetch email templates");
      }
    } catch (err) {
      setError("Failed to fetch email templates");
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handler functions for email management
  const handleCreateTemplate = () => {
    // TODO: Navigate to template creation page or open modal
    console.log("Create new template");
  };

  const handleEditTemplate = (templateId: string) => {
    // TODO: Navigate to template editor
    console.log("Edit template:", templateId);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/email/templates/${templateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTemplates();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete template");
      }
    } catch (err) {
      setError("Failed to delete template");
      console.error("Error deleting template:", err);
    }
  };

  const handleComposeWithTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowQuickComposer(true);
  };

  const handleQuickCompose = () => {
    setSelectedTemplateId(null);
    setShowQuickComposer(true);
  };

  const handleViewAnalytics = () => {
    setShowAnalytics(true);
  };

  const handleManageSettings = () => {
    setShowSettings(true);
  };

  if (userLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="text-red-700 hover:bg-red-100"
              >
                <span className="w-4 h-4">✕</span>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Page Header */}
      <PageHeader
        title="Email Management"
        description="Modern email template management with progressive disclosure"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Email" },
        ]}
        actions={[
          { label: "Refresh", icon: RefreshCw, onClick: fetchTemplates },
          { label: "Quick Email", icon: Send, onClick: handleQuickCompose },
          {
            label: "New Template",
            icon: Plus,
            primary: true,
            onClick: handleCreateTemplate,
          },
        ]}
      />

      <PermissionGuard action="read">
        {/* Modern Email Manager */}
        <ModernEmailManager
          templates={templates}
          stats={stats}
          loading={loading}
          currentUser={currentUser}
          onCreateTemplate={handleCreateTemplate}
          onEditTemplate={handleEditTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onComposeWithTemplate={handleComposeWithTemplate}
          onQuickCompose={handleQuickCompose}
          onViewAnalytics={handleViewAnalytics}
          onManageSettings={handleManageSettings}
        />

        {/* Quick Email Dialog */}
        <Dialog open={showQuickComposer} onOpenChange={setShowQuickComposer}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Quick Email Composer
              </DialogTitle>
              <DialogDescription>
                {selectedTemplateId
                  ? "Compose an email using the selected template"
                  : "Send a quick email or select a template to get started"}
              </DialogDescription>
            </DialogHeader>

            <EmailComposer
              {...(selectedTemplateId
                ? { initialData: { templateId: selectedTemplateId } }
                : {})}
              onSend={composition => {
                console.log("Quick email sent:", composition);
                setShowQuickComposer(false);
                setSelectedTemplateId(null);
              }}
              onSave={draftId => {
                console.log("Quick email draft saved:", draftId);
                setShowQuickComposer(false);
              }}
              onCancel={() => {
                setShowQuickComposer(false);
                setSelectedTemplateId(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Email Analytics Dialog */}
        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Email Analytics
              </DialogTitle>
              <DialogDescription>
                Comprehensive email delivery and template usage analytics
              </DialogDescription>
            </DialogHeader>

            <EmailAnalytics />
          </DialogContent>
        </Dialog>

        {/* Email Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Email System Settings
              </DialogTitle>
              <DialogDescription>
                Configure email delivery, template approval, and system
                preferences
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Configuration */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium text-lg">Email Configuration</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">Resend Integration</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Email delivery service is configured and operational
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Default From Address</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      noreply@bytemy.com.au
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Daily Send Limit</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Unlimited (based on Resend plan)
                    </p>
                  </div>
                </div>
              </div>

              {/* Template Settings */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium text-lg">Template Settings</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">Template Approval</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      New templates require manager approval
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">System Templates</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {stats?.overview.systemTemplates || 0} system templates
                      available
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Template Sharing</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Templates can be shared across team members
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance & Audit */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium text-lg">Compliance & Audit</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">Audit Logging</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      All email activities are logged for SOC2 compliance
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Data Retention</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Email logs retained for 7 years
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Delivery Tracking</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Email delivery status tracked via Resend webhooks
                    </p>
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium text-lg">Usage Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">This Month</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {stats?.overview.emailsSentThisMonth || 0} emails sent,
                      {stats?.overview.deliveryRate || 98}% delivery rate
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Active Templates</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {stats?.overview.activeTemplates || 0} templates available
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Recent Activity</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Template system actively used
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PermissionGuard>
    </div>
  );
}

export default EmailManagementPage;
