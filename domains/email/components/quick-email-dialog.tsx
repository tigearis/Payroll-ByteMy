'use client';

// Quick Email Dialog Component
// Security Classification: HIGH - Quick email sending from business contexts
// SOC2 Compliance: Context-aware email sending with audit trail

import { useQuery } from '@apollo/client';
import { 
  Send, 
  Mail, 
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Plus
} from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  GetEmailTemplatesDocument,
  type GetEmailTemplatesQuery
} from '../graphql/generated/graphql';
import type { EmailCategory, EmailComposition } from '../types';
import { EMAIL_CATEGORIES } from '../types/template-types';

interface QuickEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessContext: {
    category: EmailCategory;
    recipientEmails?: string[];
    payrollId?: string;
    clientId?: string;
    invoiceId?: string;
    leaveId?: string;
    assignmentId?: string;
    [key: string]: any;
  };
  suggestedSubject?: string;
  title?: string;
  description?: string;
}

interface EmailPreview {
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export function QuickEmailDialog({
  open,
  onOpenChange,
  businessContext,
  suggestedSubject,
  title = "Send Email",
  description = "Send a quick email using a template or compose from scratch"
}: QuickEmailDialogProps) {
  // State
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [recipients, setRecipients] = useState(businessContext.recipientEmails?.join(', ') || '');
  const [subject, setSubject] = useState(suggestedSubject || '');
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState<EmailPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Get category info
  const categoryInfo = EMAIL_CATEGORIES[businessContext.category];

  // Fetch templates for the category
  const { data: templatesData, loading: templatesLoading } = useQuery<GetEmailTemplatesQuery>(
    GetEmailTemplatesDocument,
    {
      variables: { category: businessContext.category },
      skip: !open
    }
  );

  const templates = templatesData?.emailTemplates || [];

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedTemplateId('');
      setSubject(suggestedSubject || '');
      setMessage('');
      setShowPreview(false);
      setPreview(null);
    }
  }, [open, suggestedSubject]);

  // Update recipients when business context changes
  useEffect(() => {
    if (businessContext.recipientEmails) {
      setRecipients(businessContext.recipientEmails.join(', '));
    }
  }, [businessContext.recipientEmails]);

  // Handle template selection
  const handleTemplateSelect = useCallback(async (templateId: string) => {
    if (!templateId || templateId === "none") {
      setSelectedTemplateId('');
      setSubject(suggestedSubject || '');
      setMessage('');
      return;
    }

    setIsLoading(true);
    try {
      // Process template with business context
      const response = await fetch(`/api/email/templates/${templateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'preview',
          previewData: businessContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.preview) {
          setSubject(data.preview.subject);
          setMessage(data.preview.htmlContent);
          setSelectedTemplateId(templateId);
        }
      } else {
        toast.error('Failed to load template');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
    } finally {
      setIsLoading(false);
    }
  }, [businessContext, suggestedSubject]);

  // Generate preview
  const handlePreview = useCallback(async () => {
    if (!subject || !message) {
      toast.error('Subject and message are required for preview');
      return;
    }

    setIsLoading(true);
    try {
      if (selectedTemplateId) {
        // Preview with template
        const response = await fetch(`/api/email/templates/${selectedTemplateId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'preview',
            previewData: businessContext
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.preview) {
            setPreview(data.preview);
            setShowPreview(true);
          }
        }
      } else {
        // Direct preview
        setPreview({
          subject,
          htmlContent: message
        });
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate preview');
    } finally {
      setIsLoading(false);
    }
  }, [subject, message, selectedTemplateId, businessContext]);

  // Send email
  const handleSend = useCallback(async () => {
    if (!recipients.trim()) {
      toast.error('Recipients are required');
      return;
    }

    if (!subject.trim()) {
      toast.error('Subject is required');
      return;
    }

    if (!message.trim()) {
      toast.error('Message is required');
      return;
    }

    setIsSending(true);
    try {
      const recipientEmails = recipients
        .split(',')
        .map(email => email.trim())
        .filter(email => email);

      const composition: EmailComposition = {
        templateId: selectedTemplateId || undefined,
        recipientEmails,
        subject,
        htmlContent: message,
        businessContext
      };

      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(composition)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || 'Email sent successfully');
        onOpenChange(false);
      } else {
        toast.error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  }, [recipients, subject, message, selectedTemplateId, businessContext, onOpenChange]);

  // Validate form
  const isValid = recipients.trim() && subject.trim() && message.trim();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
            
            {/* Category badge */}
            {categoryInfo && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" style={{ color: categoryInfo.color }}>
                  {categoryInfo.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {categoryInfo.description}
                </span>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-4">
            {/* Template selection */}
            <div className="space-y-2">
              <Label>Template (optional)</Label>
              <Select 
                value={selectedTemplateId} 
                onValueChange={handleTemplateSelect}
                disabled={templatesLoading || isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template or compose from scratch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Compose from scratch
                    </div>
                  </SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col">
                        <span>{template.name}</span>
                        {template.description && (
                          <span className="text-xs text-muted-foreground">
                            {template.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {templatesLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading templates...
                </div>
              )}
            </div>

            {/* Recipients */}
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Input
                id="recipients"
                placeholder="recipient@example.com, another@example.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple email addresses with commas
              </p>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Email message (HTML supported)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing template...
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={isLoading || !isValid}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSending}
              >
                Cancel
              </Button>
              
              <Button 
                onClick={handleSend}
                disabled={!isValid || isSending}
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Email
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              Preview how your email will appear to recipients
            </DialogDescription>
          </DialogHeader>
          
          {preview && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Subject:</Label>
                <p className="text-sm border rounded p-2 bg-gray-50">{preview.subject}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Content:</Label>
                <div 
                  className="border rounded p-4 bg-white min-h-[300px]"
                  dangerouslySetInnerHTML={{ __html: preview.htmlContent }}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
            <Button onClick={() => {
              setShowPreview(false);
              handleSend();
            }}>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}