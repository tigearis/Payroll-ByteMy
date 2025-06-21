// components/payroll-details-card.tsx
'use client'

import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PayrollDetailsCardProps {
  payroll: {
    status: string;
    processing_days_before_eft: number;
    payroll_system?: string;
  };
  className?: string; // Allow custom styles
}

export const PayrollDetailsCard: React.FC<PayrollDetailsCardProps> = ({ payroll, className }) => (
  <Card className={`p-4 ${className} shadow-md rounded-lg`}>
    <CardHeader>
      <CardTitle className="text-lg font-bold">Payroll Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm">
      <p><strong>Status:</strong> {payroll.status}</p>
      <p><strong>Processing Days Before EFT:</strong> {payroll.processing_days_before_eft} days</p>
      {payroll.payroll_system && (
        <p><strong>System:</strong> {payroll.payroll_system}</p>
      )}
    </CardContent>
  </Card>
);
