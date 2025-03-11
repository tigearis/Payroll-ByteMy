import { AustralianTaxCalculator } from "@/components/australian-tax-calculator"

export default function TaxCalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Australian Tax Calculator</h2>
        <p className="text-muted-foreground">Estimate tax for Australian payroll</p>
      </div>
      <AustralianTaxCalculator />
    </div>
  )
}

