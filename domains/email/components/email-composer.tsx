"use client";

// Email Composer Component
// Security Classification: HIGH - Email composition with template support
// SOC2 Compliance: Email creation audit and validation

import { useMutation, useQuery } from "@apollo/client";
import DOMPurify from "isomorphic-dompurify";
import {
  Send,
  Save,
  Eye,
  Clock,
  Plus,
  Minus,
  Mail,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  GetEmailTemplatesDocument,
  CreateEmailDraftDocument,
  LogEmailSendDocument,
  type GetEmailTemplatesQuery,
  type CreateEmailDraftMutation,
  type LogEmailSendMutation,
} from "../graphql/generated/graphql";
import type { EmailCategory, EmailComposition } from "../types";
import { EMAIL_CATEGORIES } from "../types/template-types";

interface EmailComposerProps {
  initialData?: {
    templateId?: string;
    recipientEmails?: string[];
    subject?: string;
    htmlContent?: string;
    businessContext?: {
      category: EmailCategory;
      [key: string]: any;
    };
  };
  onSend?: (composition: EmailComposition) => void;
  onSave?: (draftId: string) => void;
  onCancel?: () => void;
  className?: string;
}

interface EmailPreview {
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export function EmailComposer({
  initialData,
  onSend,
  onSave,
  onCancel,
  className,
}: EmailComposerProps) {
  // Form state
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialData?.templateId || ""
  );
  const [category, setCategory] = useState<EmailCategory>(
    initialData?.businessContext?.category || "system"
  );
  const [recipients, setRecipients] = useState<string[]>(
    initialData?.recipientEmails || [""]
  );
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [htmlContent, setHtmlContent] = useState(
    initialData?.htmlContent || ""
  );
  const [textContent, setTextContent] = useState("");
  const [variableValues, setVariableValues] = useState<Record<string, any>>({});
  const [scheduledFor, setScheduledFor] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState("compose");
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState<EmailPreview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // GraphQL queries and mutations
  const { data: templatesData, loading: templatesLoading } =
    useQuery<GetEmailTemplatesQuery>(GetEmailTemplatesDocument, {
      variables: { category: category || undefined },
      skip: !category,
    });

  const [createDraft, { loading: savingDraft }] =
    useMutation<CreateEmailDraftMutation>(CreateEmailDraftDocument);

  const [sendEmail, { loading: sendingEmail }] =
    useMutation<LogEmailSendMutation>(LogEmailSendDocument);

  // Get available templates
  const templates = templatesData?.emailTemplates || [];

  // Add recipient
  const addRecipient = useCallback(() => {
    setRecipients(prev => [...prev, ""]);
  }, []);

  // Remove recipient
  const removeRecipient = useCallback((index: number) => {
    setRecipients(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Update recipient
  const updateRecipient = useCallback((index: number, value: string) => {
    setRecipients(prev =>
      prev.map((email, i) => (i === index ? value : email))
    );
  }, []);

  // Validate email addresses
  const validateEmails = useCallback((emails: string[]): string[] => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.filter(
      email => email.trim() && !emailRegex.test(email.trim())
    );
  }, []);

  // Validate form
  const validateForm = useCallback((): string[] => {
    const errors: string[] = [];

    const validRecipients = recipients.filter(email => email.trim());
    if (validRecipients.length === 0) {
      errors.push("At least one recipient is required");
    }

    const invalidEmails = validateEmails(validRecipients);
    if (invalidEmails.length > 0) {
      errors.push(`Invalid email addresses: ${invalidEmails.join(", ")}`);
    }

    if (!subject.trim()) {
      errors.push("Subject is required");
    }

    if (!htmlContent.trim()) {
      errors.push("Email content is required");
    }

    return errors;
  }, [recipients, subject, htmlContent, validateEmails]);

  // Update validation on form changes
  useEffect(() => {
    const errors = validateForm();
    setValidationErrors(errors);
  }, [validateForm]);

  // Handle template selection
  const handleTemplateSelect = useCallback(
    async (templateId: string) => {
      if (!templateId || templateId === "none") {
        setSelectedTemplateId("");
        return;
      }

      setIsProcessing(true);
      try {
        // Fetch template and process with variables
        const response = await fetch(`/api/email/templates/${templateId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "preview",
            previewData: variableValues,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.preview) {
            setSubject(data.preview.subject);
            setHtmlContent(data.preview.htmlContent);
            setTextContent(data.preview.textContent || "");
            setSelectedTemplateId(templateId);
          }
        }
      } catch (error) {
        console.error("Error loading template:", error);
        toast.error("Failed to load template");
      } finally {
        setIsProcessing(false);
      }
    },
    [variableValues]
  );

  // Generate preview
  const generatePreview = useCallback(async () => {
    if (!subject || !htmlContent) {
      toast.error("Subject and content are required for preview");
      return;
    }

    setIsProcessing(true);
    try {
      if (selectedTemplateId) {
        // Preview with template
        const response = await fetch(
          `/api/email/templates/${selectedTemplateId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "preview",
              previewData: variableValues,
            }),
          }
        );

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
          htmlContent,
          textContent,
        });
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      toast.error("Failed to generate preview");
    } finally {
      setIsProcessing(false);
    }
  }, [subject, htmlContent, textContent, selectedTemplateId, variableValues]);

  // Save as draft
  const handleSaveDraft = useCallback(async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    try {
      const validRecipients = recipients.filter(email => email.trim());

      const result = await createDraft({
        variables: {
          input: {
            templateId: selectedTemplateId || null,
            recipientEmails: validRecipients,
            subject,
            htmlContent,
            textContent: textContent || null,
            variableValues:
              Object.keys(variableValues).length > 0
                ? JSON.stringify(variableValues)
                : null,
            businessContext: initialData?.businessContext
              ? JSON.stringify(initialData.businessContext)
              : null,
            scheduledFor: scheduledFor || null,
          },
        },
      });

      if (result.data?.insertEmailDraftsOne) {
        toast.success("Draft saved successfully");
        onSave?.(result.data.insertEmailDraftsOne.id);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    }
  }, [
    createDraft,
    selectedTemplateId,
    recipients,
    subject,
    htmlContent,
    textContent,
    variableValues,
    scheduledFor,
    initialData?.businessContext,
    onSave,
    validateForm,
  ]);

  // Send email
  const handleSendEmail = useCallback(async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error("Please fix validation errors before sending");
      return;
    }

    try {
      const validRecipients = recipients.filter(email => email.trim());

      const composition: EmailComposition = {
        templateId: selectedTemplateId || undefined,
        recipientEmails: validRecipients,
        subject,
        htmlContent,
        textContent: textContent || undefined,
        variableValues:
          Object.keys(variableValues).length > 0 ? variableValues : undefined,
        businessContext: initialData?.businessContext,
        scheduledFor: scheduledFor || undefined,
      };

      // Send via API
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(composition),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Email sent successfully");
        onSend?.(composition);
      } else {
        toast.error(result.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  }, [
    selectedTemplateId,
    recipients,
    subject,
    htmlContent,
    textContent,
    variableValues,
    scheduledFor,
    initialData?.businessContext,
    onSend,
    validateForm,
  ]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Compose Email
        </CardTitle>
        <CardDescription>
          Create and send emails using templates or compose from scratch
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            {/* Recipients */}
            <div className="space-y-2">
              <Label>Recipients</Label>
              {recipients.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="recipient@example.com"
                    value={email}
                    onChange={e => updateRecipient(index, e.target.value)}
                    className="flex-1"
                  />
                  {recipients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRecipient(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRecipient}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Recipient
              </Button>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Email content (HTML supported)..."
                value={htmlContent}
                onChange={e => setHtmlContent(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            {/* Scheduled sending */}
            <div className="space-y-2">
              <Label htmlFor="scheduledFor">
                Schedule for later (optional)
              </Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                value={scheduledFor}
                onChange={e => setScheduledFor(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </TabsContent>

          <TabsContent value="template" className="space-y-4">
            {/* Category selection */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(value: EmailCategory) => setCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select email category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EMAIL_CATEGORIES).map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" style={{ color: cat.color }}>
                          {cat.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {cat.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template selection */}
            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                value={selectedTemplateId}
                onValueChange={handleTemplateSelect}
                disabled={templatesLoading || isProcessing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template or compose from scratch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    No template (compose from scratch)
                  </SelectItem>
                  {templates.map(template => (
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
            </div>

            {templatesLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading templates...
              </div>
            )}
          </TabsContent>

          <TabsContent value="variables" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Template variables will be processed automatically based on your
              business context. You can override values here if needed.
            </div>

            {/* Variable inputs would go here */}
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">
                Variable editor coming soon. Variables are automatically
                populated from business context.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div className="mt-4 p-3 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
              <AlertCircle className="h-4 w-4" />
              Please fix the following errors:
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={generatePreview}
              disabled={isProcessing || !subject || !htmlContent}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={savingDraft || validationErrors.length > 0}
            >
              {savingDraft ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
          </div>

          <div className="flex gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}

            <Button
              onClick={handleSendEmail}
              disabled={sendingEmail || validationErrors.length > 0}
            >
              {sendingEmail ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : scheduledFor ? (
                <Clock className="h-4 w-4 mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {scheduledFor ? "Schedule" : "Send"} Email
            </Button>
          </div>
        </div>
      </CardContent>

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
                <p className="text-sm border rounded p-2 bg-gray-50">
                  {preview.subject}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Content:</Label>
                <div
                  className="border rounded p-4 bg-white min-h-[300px]"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(preview.htmlContent),
                  }}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
