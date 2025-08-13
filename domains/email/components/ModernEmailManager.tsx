"use client";

import { Mail, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  templates?: EmailTemplate[];
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

export function ModernEmailManager(props: ModernEmailManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Modern Email Manager
          <Badge variant="secondary">Placeholder</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Send className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Modern Email Manager placeholder</p>
          <p className="text-sm mt-2">This component needs to be implemented</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ModernEmailManager;