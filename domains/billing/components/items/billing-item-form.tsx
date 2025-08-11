"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";

interface BillingItemFormProps {
  itemId?: string;
  mode?: "create" | "edit";
  initialData?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export function BillingItemForm({ 
  itemId,
  mode = "create", 
  initialData, 
  onSave, 
  onCancel 
}: BillingItemFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create Billing Item" : "Edit Billing Item"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          <p>Billing item form placeholder</p>
          <p className="text-sm mt-2">This component needs to be implemented</p>
          {itemId && <p className="text-xs mt-1 text-muted-foreground">Item ID: {itemId}</p>}
        </div>
        
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={() => onSave?.({})}>
            <Save className="h-4 w-4 mr-2" />
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}