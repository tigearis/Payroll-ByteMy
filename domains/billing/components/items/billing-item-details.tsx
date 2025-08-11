"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, DollarSign } from "lucide-react";

interface BillingItemDetailsProps {
  itemId?: string;
  data?: any;
}

export function BillingItemDetails({ itemId, data }: BillingItemDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Billing Item Details
            </CardTitle>
            <Badge variant="secondary">Placeholder</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <p>Billing item details placeholder</p>
            <p className="text-sm mt-2">This component needs to be implemented</p>
            {itemId && (
              <p className="text-xs mt-1 font-mono">ID: {itemId}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Date: TBD</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Amount: TBD</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Status: TBD</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}