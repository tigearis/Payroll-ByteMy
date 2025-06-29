// components/australian-tax-calculator.tsx
"use client";

import React, { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { useEnhancedPermissions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

// State Payroll Tax Data
const statePayrollTaxRates: Record<string, number> = {
  NSW: 0.0545,
  VIC: 0.0485,
  QLD: 0.0475,
  SA: 0.05,
  WA: 0.06,
  TAS: 0.045,
  NT: 0.055,
  ACT: 0.065,
};

const payrollTaxThresholds: Record<string, number> = {
  NSW: 1200000,
  VIC: 700000,
  QLD: 1300000,
  SA: 1500000,
  WA: 1000000,
  TAS: 1250000,
  NT: 1500000,
  ACT: 2000000,
};

export function AustralianTaxCalculator() {
  const { hasPermission } = useEnhancedPermissions();
  
  if (!hasPermission('payroll:read')) {
    return null;
  }

  const [state, setState] = useState<string>("NSW");
  const [annualPayroll, setAnnualPayroll] = useState<number | "">("");
  const [payrollTax, setPayrollTax] = useState<number>(0);

  const calculatePayrollTax = () => {
    const payrollAmount = Number(annualPayroll);
    if (annualPayroll === "" || isNaN(payrollAmount)) {
      alert("Please enter a valid payroll amount");
      return;
    }

    const threshold = payrollTaxThresholds[state] ?? 0;
    const taxRate = statePayrollTaxRates[state] ?? 0;
    const taxableAmount = Math.max(0, payrollAmount - threshold);
    const tax = taxableAmount * taxRate;
    setPayrollTax(parseFloat(tax.toFixed(2)));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Australian Tax & State Payroll Calculator</CardTitle>
        <CardDescription>
          Calculate your estimated payroll tax based on your annual payroll.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">Select State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(statePayrollTaxRates).map(st => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payroll">Annual Payroll ($)</Label>
              <Input
                id="payroll"
                type="number"
                placeholder="Enter annual payroll"
                value={annualPayroll}
                onChange={e =>
                  setAnnualPayroll(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>
          </div>
          <Button onClick={calculatePayrollTax} className="w-full">
            Calculate Payroll Tax
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center">
          <h3 className="text-lg font-semibold">Results</h3>
          <p>
            <strong>Payroll Tax:</strong> ${payrollTax}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
