"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText } from "lucide-react";

interface BillingItemsTableProps {
  data: any[];
  loading: boolean;
  refetch: () => void;
}

export function BillingItemsTable({ data, loading, refetch }: BillingItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Billing Items Table
          <Badge variant="secondary">Placeholder</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Billing Items Table placeholder</p>
          <p className="text-sm mt-2">This component needs to be implemented</p>
          <p className="text-xs mt-1">
            {loading ? "Loading..." : `${data.length} items`} | 
            <button onClick={refetch} className="text-blue-600 hover:underline ml-1">
              Refresh
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default BillingItemsTable;