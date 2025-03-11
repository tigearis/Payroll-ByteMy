"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Australian tax brackets for 2023-2024 (example data, please verify with current ATO rates)
const taxBrackets = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.19, base: 0 },
  { min: 45001, max: 120000, rate: 0.325, base: 5092 },
  { min: 120001, max: 180000, rate: 0.37, base: 29467 },
  { min: 180001, max: Number.POSITIVE_INFINITY, rate: 0.45, base: 51667 },
]

const medicareLevy = 0.02 // 2% Medicare Levy

export function AustralianTaxCalculator() {
  const [income, setIncome] = useState("")
  const [payPeriod, setPayPeriod] = useState("annual")
  const [taxResult, setTaxResult] = useState<{
    grossIncome: number
    taxPayable: number
    medicareLevy: number
    netIncome: number
  } | null>(null)

  const calculateTax = (annualIncome: number) => {
    let taxPayable = 0
    for (const bracket of taxBrackets) {
      if (annualIncome > bracket.min) {
        const taxableInThisBracket = Math.min(annualIncome, bracket.max) - bracket.min
        taxPayable += bracket.base + taxableInThisBracket * bracket.rate
      }
      if (annualIncome <= bracket.max) break
    }
    const medicareAmount = annualIncome * medicareLevy
    const netIncome = annualIncome - taxPayable - medicareAmount

    return {
      grossIncome: annualIncome,
      taxPayable,
      medicareLevy: medicareAmount,
      netIncome,
    }
  }

  const handleCalculate = () => {
    const incomeValue = Number.parseFloat(income)
    if (isNaN(incomeValue) || incomeValue < 0) {
      alert("Please enter a valid income amount")
      return
    }

    let annualIncome = incomeValue
    if (payPeriod === "weekly") annualIncome *= 52
    else if (payPeriod === "fortnightly") annualIncome *= 26
    else if (payPeriod === "monthly") annualIncome *= 12

    const result = calculateTax(annualIncome)
    setTaxResult(result)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Australian Tax Calculator</CardTitle>
        <CardDescription>Calculate your estimated tax based on your income</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Income</Label>
              <Input
                id="income"
                placeholder="Enter your income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-period">Pay Period</Label>
              <Select value={payPeriod} onValueChange={setPayPeriod}>
                <SelectTrigger id="pay-period">
                  <SelectValue placeholder="Select pay period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="fortnightly">Fortnightly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full">
            Calculate Tax
          </Button>
        </div>
      </CardContent>
      {taxResult && (
        <CardFooter>
          <div className="w-full space-y-2">
            <h3 className="text-lg font-semibold">Tax Calculation Results (Annual)</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>Gross Income:</div>
              <div>${taxResult.grossIncome.toFixed(2)}</div>
              <div>Tax Payable:</div>
              <div>${taxResult.taxPayable.toFixed(2)}</div>
              <div>Medicare Levy:</div>
              <div>${taxResult.medicareLevy.toFixed(2)}</div>
              <div className="font-semibold">Net Income:</div>
              <div className="font-semibold">${taxResult.netIncome.toFixed(2)}</div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

