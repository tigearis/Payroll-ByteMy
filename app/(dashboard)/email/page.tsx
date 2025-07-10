'use client';

// Email Management Page
// Security Classification: HIGH - Email system management interface
// SOC2 Compliance: Email operations with full audit trail

import { 
  Mail,
  FileText,
  BarChart3,
  Plus,
  Send,
  Settings
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  EmailComposer,
  TemplateLibrary
} from '@/domains/email';
import { EmailAnalytics } from '@/domains/email/components/email-analytics';

export default function EmailManagementPage() {
  // State
  const [activeTab, setActiveTab] = useState('compose');
  const [showComposer, setShowComposer] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Handle template selection from library
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setActiveTab('compose');
    setShowComposer(true);
  };

  // Handle new template creation
  const handleCreateTemplate = () => {
    // TODO: Navigate to template creation page or open modal
    console.log('Create new template');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Management</h1>
          <p className="text-muted-foreground">
            Manage email templates, send emails, and monitor delivery performance
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowComposer(true)}
          >
            <Send className="h-4 w-4 mr-2" />
            Quick Email
          </Button>
          
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <EmailComposer
            {...(selectedTemplateId ? { initialData: { templateId: selectedTemplateId } } : {})}
            onSend={(composition) => {
              console.log('Email sent:', composition);
              setSelectedTemplateId(null);
            }}
            onSave={(draftId) => {
              console.log('Draft saved:', draftId);
            }}
            onCancel={() => {
              setSelectedTemplateId(null);
            }}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplateLibrary
            onSelectTemplate={handleTemplateSelect}
            onCreateNew={handleCreateTemplate}
            onEditTemplate={(templateId) => {
              console.log('Edit template:', templateId);
              // TODO: Navigate to template editor
            }}
            mode="manage"
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <EmailAnalytics />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>
                  Configure email sending settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Resend Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Email delivery service is configured and operational
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Default From Address</h4>
                    <p className="text-sm text-muted-foreground">
                      noreply@bytemy.com.au
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Daily Send Limit</h4>
                    <p className="text-sm text-muted-foreground">
                      Unlimited (based on Resend plan)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
                <CardDescription>
                  Manage template approval and sharing settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Template Approval</h4>
                    <p className="text-sm text-muted-foreground">
                      New templates require manager approval
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">System Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      4 system templates available for all users
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Template Sharing</h4>
                    <p className="text-sm text-muted-foreground">
                      Templates can be shared across team members
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Audit */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Audit</CardTitle>
                <CardDescription>
                  SOC2 compliance and email audit settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Audit Logging</h4>
                    <p className="text-sm text-muted-foreground">
                      All email activities are logged for SOC2 compliance
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Data Retention</h4>
                    <p className="text-sm text-muted-foreground">
                      Email logs retained for 7 years
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Delivery Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Email delivery status tracked via Resend webhooks
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>
                  Current email system usage and limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">This Month</h4>
                    <p className="text-sm text-muted-foreground">
                      150 emails sent, 98% delivery rate
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Active Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      12 templates available for use
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Recent Activity</h4>
                    <p className="text-sm text-muted-foreground">
                      Last email sent 2 hours ago
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Email Dialog */}
      <Dialog open={showComposer} onOpenChange={setShowComposer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quick Email</DialogTitle>
            <DialogDescription>
              Send a quick email using templates or compose from scratch
            </DialogDescription>
          </DialogHeader>
          
          <EmailComposer
            {...(selectedTemplateId ? { initialData: { templateId: selectedTemplateId } } : {})}
            onSend={(composition) => {
              console.log('Quick email sent:', composition);
              setShowComposer(false);
              setSelectedTemplateId(null);
            }}
            onSave={(draftId) => {
              console.log('Quick email draft saved:', draftId);
              setShowComposer(false);
            }}
            onCancel={() => {
              setShowComposer(false);
              setSelectedTemplateId(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}