"use client";

import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import { 
  Mail, 
  FileText, 
  Send, 
  Eye,
  Edit,
  Plus,
  Star,
  Calendar,
  User,
  Settings,
  Trash2,
  Copy,
  BarChart3,
  Play,
  Clock
} from "lucide-react";
import { useState, useMemo } from "react";
import { ModernDataTable, type ColumnDef, type RowAction } from "@/components/data/modern-data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { StatusIndicator } from "@/components/ui/status-indicator";

// Email template interface
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

interface ModernEmailManagerProps {
  templates: EmailTemplate[];
  stats?: EmailStats | null;
  loading?: boolean;
  currentUser?: any;
  onCreateTemplate?: () => void;
  onEditTemplate?: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onComposeWithTemplate?: (templateId: string) => void;
  onQuickCompose?: () => void;
  onViewAnalytics?: () => void;
  onManageSettings?: () => void;
}

// Category configurations
const categoryConfigs = {
  system: { 
    color: "bg-blue-100 text-blue-800", 
    icon: Settings,
    label: "System"
  },
  payroll: { 
    color: "bg-green-100 text-green-800", 
    icon: Calendar,
    label: "Payroll"
  },
  client: { 
    color: "bg-purple-100 text-purple-800", 
    icon: User,
    label: "Client"
  },
  internal: { 
    color: "bg-orange-100 text-orange-800", 
    icon: Mail,
    label: "Internal"
  },
  marketing: { 
    color: "bg-pink-100 text-pink-800", 
    icon: BarChart3,
    label: "Marketing"
  }
} as const;

// Status configurations
const statusConfigs = {
  active: { 
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="success">{label}</StatusIndicator>
    ),
    color: "bg-green-100 text-green-800"
  },
  inactive: { 
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="info">{label}</StatusIndicator>
    ),
    color: "bg-gray-100 text-gray-800"
  }
};

// Template Details component for sheet view
const TemplateDetails = ({ 
  template, 
  currentUser, 
  onEdit, 
  onDelete,
  onCompose,
  onPreview
}: { 
  template: EmailTemplate;
  currentUser: any;
  onEdit?: (templateId: string) => void;
  onDelete?: (templateId: string) => void;
  onCompose?: (templateId: string) => void;
  onPreview?: (template: EmailTemplate) => void;
}) => {
  const canEditTemplate = !template.isSystemTemplate && 
    (template.createdByUser?.id === currentUser?.id || 
     currentUser?.role === "org_admin" || 
     currentUser?.role === "developer");

  const canDeleteTemplate = !template.isSystemTemplate && canEditTemplate;

  const categoryConfig = categoryConfigs[template.category as keyof typeof categoryConfigs];
  const statusConfig = statusConfigs[template.isActive ? 'active' : 'inactive'];

  return (
    <div className="space-y-6">
      {/* Template Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-semibold">{template.name}</h3>
          {template.description && (
            <p className="text-neutral-600 dark:text-neutral-400">{template.description}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {categoryConfig && (
              <Badge className={categoryConfig.color}>
                {categoryConfig.label}
              </Badge>
            )}
            {template.isSystemTemplate && (
              <Badge variant="secondary">System Template</Badge>
            )}
            <statusConfig.component label={template.isActive ? "Active" : "Inactive"} />
          </div>
        </div>
      </div>

      {/* Template Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                {template.usageCount || 0}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Times Used
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                {template.variableCount || 0}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Variables
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Information */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Template Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-500">Created By</label>
              <p className="text-base font-medium">
                {template.createdByUser?.computedName ||
                 `${template.createdByUser?.firstName || ""} ${template.createdByUser?.lastName || ""}`.trim() ||
                 "System"}
              </p>
              {template.createdByUser?.email && (
                <p className="text-sm text-neutral-500">{template.createdByUser.email}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-500">Created</label>
              <p className="text-base font-medium">
                {format(new Date(template.createdAt), "dd MMM yyyy")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-500">Last Updated</label>
              <p className="text-base font-medium">
                {format(new Date(template.updatedAt), "dd MMM yyyy")}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-500">Last Used</label>
              <p className="text-base font-medium">
                {template.lastUsedAt 
                  ? format(new Date(template.lastUsedAt), "dd MMM yyyy")
                  : "Never used"
                }
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-500">Template ID</label>
          <p className="text-sm font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
            {template.id}
          </p>
        </div>
      </div>

      {/* Template Preview */}
      {template.preview && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Template Preview
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-neutral-500">Subject:</label>
              <p className="text-sm border rounded p-2 bg-neutral-50 dark:bg-neutral-900">
                {template.preview.subject}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-500">Content Preview:</label>
              <div
                className="border rounded p-4 bg-white dark:bg-neutral-900 min-h-[200px] max-h-[300px] overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(template.preview.htmlContent)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <h4 className="font-medium">Available Actions</h4>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onCompose?.(template.id)}>
            <Send className="h-4 w-4 mr-2" />
            Compose Email
          </Button>
          
          <Button variant="outline" onClick={() => onPreview?.(template)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Template
          </Button>
          
          {canEditTemplate && (
            <Button variant="outline" onClick={() => onEdit?.(template.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Template
            </Button>
          )}
          
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          
          {canDeleteTemplate && (
            <Button variant="destructive" onClick={() => onDelete?.(template.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Template
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export function ModernEmailManager({ 
  templates, 
  stats,
  loading = false, 
  currentUser,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onComposeWithTemplate,
  onQuickCompose,
  onViewAnalytics,
  onManageSettings
}: ModernEmailManagerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Calculate summary metrics
  const metrics = useMemo(() => {
    if (stats) {
      return {
        totalTemplates: stats.overview.totalTemplates,
        activeTemplates: stats.overview.activeTemplates,
        systemTemplates: stats.overview.systemTemplates,
        emailsSent: stats.overview.emailsSentThisMonth
      };
    }

    // Fallback calculation from templates
    return {
      totalTemplates: templates.length,
      activeTemplates: templates.filter(t => t.isActive).length,
      systemTemplates: templates.filter(t => t.isSystemTemplate).length,
      emailsSent: templates.reduce((sum, t) => sum + (t.usageCount || 0), 0)
    };
  }, [templates, stats]);

  // Define essential columns for progressive disclosure
  const columns: ColumnDef<EmailTemplate>[] = [
    {
      id: 'template',
      key: 'name',
      label: 'Template Name',
      essential: true,
      sortable: true,
      render: (_, template) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{template.name}</div>
            {template.description && (
              <div className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                {template.description}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'category',
      key: 'category',
      label: 'Category',
      essential: true,
      sortable: true,
      render: (_, template) => {
        const config = categoryConfigs[template.category as keyof typeof categoryConfigs];
        if (!config) {
          return <Badge variant="outline">{template.category}</Badge>;
        }
        
        return (
          <div className="flex items-center gap-2">
            <config.icon className="h-4 w-4 text-neutral-500" />
            <Badge className={config.color}>
              {config.label}
            </Badge>
          </div>
        );
      }
    },
    {
      id: 'status',
      key: 'isActive',
      label: 'Status',
      essential: true,
      sortable: true,
      render: (_, template) => (
        <div className="flex flex-col gap-1">
          <div>
            {template.isActive 
              ? <StatusIndicator variant="success">Active</StatusIndicator>
              : <StatusIndicator variant="info">Inactive</StatusIndicator>
            }
          </div>
          {template.isSystemTemplate && (
            <Badge variant="secondary" className="text-xs">System</Badge>
          )}
        </div>
      )
    },
    {
      id: 'actions',
      key: 'lastUsedAt',
      label: 'Actions',
      essential: true,
      render: (_, template) => (
        <div className="text-right space-y-1">
          <div className="flex items-center justify-end gap-1">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onComposeWithTemplate?.(template.id)}
            >
              <Send className="h-3 w-3 mr-1" />
              Use
            </Button>
          </div>
          <div className="text-xs text-neutral-500">
            {template.lastUsedAt 
              ? `Used ${format(new Date(template.lastUsedAt), "dd MMM")}`
              : "Never used"
            }
          </div>
        </div>
      )
    }
  ];

  // Row actions for contextual operations
  const rowActions: RowAction<EmailTemplate>[] = [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (template) => {
        setSelectedTemplate(template);
      }
    },
    {
      id: 'compose',
      label: 'Compose Email',
      icon: Send,
      onClick: (template) => onComposeWithTemplate?.(template.id)
    },
    {
      id: 'preview',
      label: 'Preview',
      icon: Play,
      onClick: async (template) => {
        // Load preview data if not already loaded
        if (!template.preview) {
          try {
            const response = await fetch(`/api/email/templates/${template.id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "preview" }),
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.preview) {
                template.preview = data.preview;
              }
            }
          } catch (error) {
            console.error("Error loading preview:", error);
          }
        }
        
        setSelectedTemplate(template);
        setShowPreview(true);
      }
    },
    {
      id: 'edit',
      label: 'Edit Template',
      icon: Edit,
      onClick: (template) => onEditTemplate?.(template.id),
      disabled: (template) => template.isSystemTemplate && 
        !(currentUser?.role === "org_admin" || currentUser?.role === "developer")
    },
    {
      id: 'delete',
      label: 'Delete Template',
      icon: Trash2,
      onClick: (template) => onDeleteTemplate?.(template.id),
      disabled: (template) => template.isSystemTemplate || 
        (template.createdByUser?.id !== currentUser?.id &&
         currentUser?.role !== "org_admin" &&
         currentUser?.role !== "developer"),
      variant: 'destructive' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Total Templates
                </p>
                <p className="text-2xl font-bold">{metrics.totalTemplates}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Active Templates
                </p>
                <p className="text-2xl font-bold text-green-600">{metrics.activeTemplates}</p>
              </div>
              <Settings className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  System Templates
                </p>
                <p className="text-2xl font-bold text-purple-600">{metrics.systemTemplates}</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Emails Sent
                </p>
                <p className="text-2xl font-bold text-orange-600">{metrics.emailsSent}</p>
              </div>
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Button onClick={onQuickCompose}>
            <Send className="h-4 w-4 mr-2" />
            Quick Email
          </Button>
          <Button variant="outline" onClick={onCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewAnalytics}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" onClick={onManageSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Modern Data Table */}
      <ModernDataTable
        data={templates}
        columns={columns}
        rowActions={rowActions}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search email templates..."
        expandableRows={true}
        renderExpandedRow={(template) => (
          <div className="p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Template Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Template Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Usage:</span>
                    <span className="font-medium">{template.usageCount || 0} times</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variables:</span>
                    <span className="font-medium">{template.variableCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">{format(new Date(template.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span className="font-medium">{format(new Date(template.updatedAt), "dd MMM yyyy")}</span>
                  </div>
                </div>
              </div>

              {/* Creator Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Creator
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-neutral-500">Created by:</span>
                    <div className="font-medium">
                      {template.createdByUser?.computedName || "System"}
                    </div>
                  </div>
                  {template.createdByUser?.email && (
                    <div>
                      <span className="text-neutral-500">Email:</span>
                      <div className="font-medium">{template.createdByUser.email}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-neutral-500">Type:</span>
                    <div className="font-medium">
                      {template.isSystemTemplate ? "System Template" : "User Template"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onComposeWithTemplate?.(template.id)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {!template.isSystemTemplate && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => onEditTemplate?.(template.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Template
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        emptyState={
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No Email Templates
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Get started by creating your first email template for streamlined communications
            </p>
            <Button onClick={onCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        }
      />

      {/* Template Details Sheet */}
      <Sheet open={!!selectedTemplate && !showPreview} onOpenChange={() => setSelectedTemplate(null)}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Template Details
            </SheetTitle>
            <SheetDescription>
              Comprehensive template information and management actions
            </SheetDescription>
          </SheetHeader>
          {selectedTemplate && (
            <TemplateDetails 
              template={selectedTemplate} 
              currentUser={currentUser}
              {...(onEditTemplate ? { onEdit: onEditTemplate } : {})}
              {...(onDeleteTemplate ? { onDelete: onDeleteTemplate } : {})}
              {...(onComposeWithTemplate ? { onCompose: onComposeWithTemplate } : {})}
              onPreview={(_template) => {
                setShowPreview(true);
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Template Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Template Preview: {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              Preview how this template will appear when processed
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate?.preview && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject:</label>
                <p className="text-sm border rounded p-2 bg-neutral-50 dark:bg-neutral-900 mt-1">
                  {selectedTemplate.preview.subject}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Content:</label>
                <div
                  className="border rounded p-4 bg-white dark:bg-neutral-900 min-h-[300px] mt-1"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(selectedTemplate.preview.htmlContent),
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
            <div className="flex gap-2">
              {selectedTemplate && (
                <Button onClick={() => onComposeWithTemplate?.(selectedTemplate.id)}>
                  <Send className="h-4 w-4 mr-2" />
                  Use This Template
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}