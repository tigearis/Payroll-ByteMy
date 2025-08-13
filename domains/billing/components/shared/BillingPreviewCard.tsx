"use client";

import { Calculator, DollarSign, Info, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatAUD, calculateGST } from "@/lib/utils/australian-formatting";

interface BillingItem {
  id?: string;
  serviceId: string;
  serviceName: string;
  unitType: string;
  quantity: number;
  displayQuantity: string;
  unitPrice: number;
  totalAmount: number;
  description: string;
  notes?: string;
}

interface BillingPreviewCardProps {
  items: BillingItem[];
  showGST?: boolean;
  showUnitBreakdown?: boolean;
  className?: string;
  onItemClick?: (item: BillingItem) => void;
}

/**
 * BillingPreviewCard Component
 * 
 * Displays a comprehensive preview of billing items with Australian
 * currency formatting, GST calculations, and unit type breakdowns.
 * 
 * Features:
 * - Australian currency formatting
 * - GST calculation and display
 * - Unit type categorization
 * - Interactive item selection
 * - Responsive layout
 */
export function BillingPreviewCard({
  items,
  showGST = true,
  showUnitBreakdown = true,
  className = "",
  onItemClick,
}: BillingPreviewCardProps) {
  if (!items || items.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Billing Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-foreground opacity-60">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No billing items to preview</p>
            <p className="text-sm">Complete service entries to see billing preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.totalAmount, 0);
  const gstCalc = calculateGST(subtotal);

  // Group items by unit type for breakdown
  const itemsByUnitType = items.reduce((acc, item) => {
    if (!acc[item.unitType]) {
      acc[item.unitType] = [];
    }
    acc[item.unitType].push(item);
    return acc;
  }, {} as Record<string, BillingItem[]>);

  const getUnitTypeIcon = (unitType: string) => {
    switch (unitType.toLowerCase()) {
      case 'time':
        return '⏱️';
      case 'fixed':
        return '📋';
      case 'per_employee':
        return '👥';
      case 'per_payslip':
        return '📄';
      default:
        return '📊';
    }
  };

  const getUnitTypeColor = (unitType: string) => {
    switch (unitType.toLowerCase()) {
      case 'time':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'fixed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'per_employee':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'per_payslip':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Billing Preview
        </CardTitle>
        <p className="text-sm text-foreground opacity-60">
          {items.length} billing item{items.length !== 1 ? 's' : ''} ready for processing
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Unit Type Breakdown */}
        {showUnitBreakdown && Object.keys(itemsByUnitType).length > 1 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Breakdown by Unit Type
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {Object.entries(itemsByUnitType).map(([unitType, unitItems]) => {
                const unitTotal = unitItems.reduce((sum, item) => sum + item.totalAmount, 0);
                return (
                  <div
                    key={unitType}
                    className={`p-2 rounded border text-center ${getUnitTypeColor(unitType)}`}
                  >
                    <div className="text-lg mb-1">{getUnitTypeIcon(unitType)}</div>
                    <div className="text-xs font-medium capitalize">
                      {unitType.replace('_', ' ')}
                    </div>
                    <div className="text-sm font-semibold">
                      {formatAUD(unitTotal)}
                    </div>
                    <div className="text-xs opacity-75">
                      {unitItems.length} item{unitItems.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Billing Items List */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className={`p-3 border rounded transition-colors ${
                onItemClick
                  ? 'cursor-pointer hover:bg-muted'
                  : ''
              }`}
              onClick={() => onItemClick?.(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{item.serviceName}</h4>
                    <Badge variant="outline" className="text-xs">
                      {item.unitType}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground opacity-60 mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      {item.displayQuantity} × {formatAUD(item.unitPrice)}
                    </span>
                    <span className="text-foreground opacity-60">=</span>
                    <span className="font-medium text-green-600">
                      {formatAUD(item.totalAmount)}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-xs text-foreground opacity-60 mt-1 italic">
                      {item.notes}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {formatAUD(item.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-lg">
            <span>Subtotal:</span>
            <span className="font-semibold">{formatAUD(subtotal)}</span>
          </div>
          
          {showGST && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span>GST (10%):</span>
                <span>{formatAUD(gstCalc.gst)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total (inc. GST):</span>
                <span className="text-green-600">{formatAUD(gstCalc.total)}</span>
              </div>
            </>
          )}
        </div>

        {/* Information Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {items.length} billing item{items.length !== 1 ? 's' : ''} will be created totaling{' '}
            <strong>{showGST ? formatAUD(gstCalc.total) : formatAUD(subtotal)}</strong>
            {showGST ? ' (inc. GST)' : ''}. These items will be available for approval and invoicing after completion.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

export default BillingPreviewCard;